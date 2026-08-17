# MeetingMind AI

> Turn messy meetings into clear, actionable outcomes — automatically.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture Diagrams](#architecture-diagrams)
3. [Core Components](#core-components)
4. [AI Models Used](#ai-models-used)
5. [API & Event Model](#api--event-model)
6. [Local Setup (Docker Compose)](#local-setup-docker-compose)
7. [Production Deployment (Kubernetes)](#production-deployment-kubernetes)
8. [Observability & SLOs](#observability--slos)
9. [Security & Compliance](#security--compliance)
10. [Testing Strategy](#testing-strategy)
11. [Contributing](#contributing)
12. [License](#license)

---

## Project Overview

MeetingMind AI listens to your meetings and does the heavy lifting for you. It takes audio or transcripts as input, runs them through a multi-agent AI pipeline, and outputs summaries, action items, and direct integrations with your team's tools.

The system is built around a routing layer that decides which agent handles what — with full audit trails and support for human overrides when needed.

---

## Architecture Diagrams

These diagrams are written in **Mermaid** and render directly on GitHub. Use them for design reviews or onboarding new team members.

### 1) System Overview (Data Flow)

```mermaid
flowchart LR
  subgraph Ingest
    A[Meeting audio / transcript] --> B[Ingest API / Uploader]
    B --> C[Preprocessor: speaker diarization, normalize]
  end

  subgraph Agents
    C --> TA[Transcription Agent\nGLM-4.5-Air]
    TA --> SA[Summarization Agent\nGLM-4.7 Thinking Mode]
    TA --> AE[Action Extraction Agent\nGLM-4.6 + Function Calling]
    SA --> QA[Q&A Agent\nGLM-4-32B + RAG]
    AE --> OR[Orchestration Agent\nGLM-4.7-Flash + MCP]
  end

  subgraph Integrations
    OR --> PT[Project Tracker]
    OR --> CHAT[Team Chat]
    OR --> CAL[Calendar / Invite]
    OR --> EMAIL[Email]
  end

  subgraph Observability
    OR --> MON[Monitoring & Audit]
    AE --> DB[Vector DB]
  end
```

### 2) Sequence: One Meeting → Actionable Item

```mermaid
sequenceDiagram
  participant User
  participant Ingest
  participant Transcription
  participant Summarizer
  participant Extractor
  participant Orchestrator
  participant Channel

  User->>Ingest: Upload audio / start meeting
  Ingest->>Transcription: Stream audio
  Transcription-->>Summarizer: Cleaned transcript
  Summarizer-->>Extractor: Summarized decisions
  Extractor-->>Orchestrator: Structured action items (JSON)
  Orchestrator-->>Channel: Create task / post message / calendar invite
  Channel-->>User: Notification (ack)
  Orchestrator-->>Monitoring: Audit log + metrics
```

### 3) Component Relationship (Deployment View)

```mermaid
graph TD
  subgraph Backend Cluster
    API[FastAPI / GraphQL API]
    OrchestratorSvc[Orchestrator worker]
    AgentWorkers[Agent workers - containerized]
    WorkerQueue[Message broker: RabbitMQ / Kafka]
    Redis(Cache)
    Postgres[(Postgres DB)]
    VectorDB[(Vector DB)]
    Storage[(S3 / Object Storage)]
  end

  API --> WorkerQueue
  WorkerQueue --> AgentWorkers
  AgentWorkers --> VectorDB
  AgentWorkers --> Postgres
  AgentWorkers --> Storage
  OrchestratorSvc --> WorkerQueue
  API --> Redis
  API --> Postgres
```

---

## Core Components

| Component | What it does |
|---|---|
| **Ingest API** | Accepts audio files, recorded meetings, or transcripts. Handles speaker diarization and normalization. |
| **Transcription Agent** | Converts audio to clean text with speaker labels. |
| **Summarization Agent** | Produces deep summaries using chain-of-thought / thinking mode. |
| **Action Extraction Agent** | Uses function-calling to pull out structured action items as JSON. |
| **Q&A Agent** | Answers queries using RAG (retrieval from vector DB with citations). |
| **Orchestration Agent** | Routes tasks, handles retries, and pushes to the right channels using MCP tool discovery. |
| **Message Broker** | RabbitMQ / Kafka / Redis Streams for decoupling and scaling agent workloads. |
| **Storage** | Postgres for metadata & audit logs, Vector DB for embeddings, S3 for audio & transcripts. |
| **Monitoring** | Prometheus + Grafana for metrics, ELK/Loki for logs. |

---

## AI Models Used

These are the logical model assignments used in this architecture. Swap them out for your actual vendor model IDs or local checkpoints as needed.

| Task | Model | Why |
|---|---|---|
| Transcription | `GLM-4.5-Air` | Low latency, large context for streaming |
| Summarization | `GLM-4.7` | Thinking mode for deep summaries |
| Action Extraction | `GLM-4.6` | Native function-calling + structured JSON output |
| Q&A / RAG | `GLM-4-32B` | Retrieval-augmented generation with citations |
| Orchestration | `GLM-4.7-Flash + MCP` | Fast, high-concurrency tool routing |

---

## API & Event Model

### REST API (FastAPI)

**Create a meeting** — `POST /api/v1/meetings`

```
Content-Type: multipart/form-data
Body:
  file: audio.mp3
  metadata: { "title": "Q3 Budget", "participants": ["alice","bob"] }

Response: { "meeting_id": "m_123", "status": "processing" }
```

**Get summary** — `GET /api/v1/meetings/{id}/summary`

```json
{
  "meeting_id": "m_123",
  "summary": [
    "Budget: $50k allocated (LinkedIn $20k...)",
    "Decisions: Q3 plan approved"
  ],
  "action_items": [
    { "task": "Draft LinkedIn ad copy", "assignee": "Bob", "due_date": "2026-08-05" }
  ],
  "audit_log_id": "audit_456"
}
```

### Event Flow (Message Broker)

```
meeting.created       → preprocessing worker
transcript.ready      → transcription agent
summary.generated     → action extraction / storage
action.created        → orchestrator → delivery events
                           (delivery.sent, delivery.ack, delivery.failed)
```

---

## Local Setup (Docker Compose)

A `docker-compose.yml` spins up the API, worker, Postgres, Redis, and a mock vector DB.

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: password
      POSTGRES_DB: meetingmind
    volumes: ["./data/postgres:/var/lib/postgresql/data"]

  redis:
    image: redis:7
    command: redis-server --appendonly yes

  rabbitmq:
    image: rabbitmq:3-management
    ports: ["15672:15672","5672:5672"]

  api:
    build: ./services/api
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@postgres/meetingmind
      - REDIS_URL=redis://redis:6379
      - RABBIT_URL=amqp://rabbitmq:5672
    depends_on:
      - postgres
      - redis
      - rabbitmq

  worker:
    build: ./services/agents
    command: python -u worker.py
    environment:
      - RABBIT_URL=amqp://rabbitmq:5672
      - VECTOR_URL=http://vector:8080
    depends_on:
      - rabbitmq
      - api
```

**`.env` example**

```env
DATABASE_URL=postgresql://postgres:password@postgres/meetingmind
REDIS_URL=redis://redis:6379
RABBIT_URL=amqp://rabbitmq:5672
OBJECT_STORAGE_URL=http://minio:9000
SECRET_KEY=change_this_to_a_secure_value
```

**Quick start**

```bash
git clone <repo>
cd repo
docker-compose up --build
# Visit http://localhost:8000/docs
```

---

## Production Deployment (Kubernetes)

- **API**: Deploy as a `Deployment + Service` behind an ingress (NGINX / Traefik).
- **Agent Workers**: Scalable `Deployments` with HPA based on queue depth or CPU.
- **Databases**: Use `StatefulSets` for Postgres / Vector DB, or use managed services.
- **Storage**: `PersistentVolumeClaims` for object storage, or connect to real S3.
- **Security**: Store secrets in KMS/SecretsManager. Use mTLS between services (Istio or Linkerd).
- **Observability**: Prometheus scraping + Grafana dashboards + Loki/ELK for logs.
- **CI/CD**: Build in CI, push to registry, deploy via GitOps (ArgoCD) or GitHub Actions + Helm.

---

## Observability & SLOs

**Key Metrics**
- Per-agent latency: transcription, summarization, extraction times
- Throughput: meetings processed per minute, action items per hour
- Delivery success rate: % of ACKs vs failed deliveries

**SLO Targets**
- Transcription latency: 95th percentile < 1s (streamed chunk)
- Orchestrator delivery success: 99% within SLA

**Tracing & Audit**
- Use OpenTelemetry for distributed tracing across agents
- Immutable audit logs stored in Postgres, exportable to cold storage for compliance

---

## Security & Compliance

- **Data minimization**: Store only what's needed. Redact or remove PII unless the user opts in.
- **Anonymization**: Strip tokens and apply k-anonymity before building any aggregated benchmarks.
- **Encryption**: TLS in transit, AES-256 at rest for all audio and transcripts.
- **Access control**: RBAC for the admin UI and API. Human-in-the-loop review requires elevated privileges.
- **Compliance**: Designed with SOC2 readiness in mind. Supports on-prem or VPC-isolated deployments for enterprise use.

---

## Testing Strategy

| Test Type | What it covers |
|---|---|
| **Unit tests** | Parsing, transformation logic, and small isolated components |
| **Integration tests** | End-to-end agent flows with mock models, checking event flows and DB state |
| **Contract tests** | Ensures agents produce correct JSON action item schema |
| **Load tests** | Simulates concurrent meetings to validate throughput and autoscaling |
| **Security tests** | Static analysis, dependency scans, and pen tests for critical endpoints |

**Tips:**
- Use local model stubs/mocks in CI — don't call real LLM APIs during unit tests.
- Keep a small set of canned meeting transcripts for deterministic, repeatable test runs.

---

## Contributing

Contributions are welcome! Here's how to get started:

1. Fork the repo and create a feature branch: `feature/<ticket>-short-desc`
2. Run tests locally and add unit/integration tests for your changes
3. Open a Pull Request with a clear description and link to any related issues
4. Make sure CI passes (lint, unit, integration)
5. For bigger changes, open an RFC issue first to discuss the architecture impact

**Code style**
- Python: Black formatting, type hints, and docstrings
- JavaScript/TypeScript (if used): Prettier + ESLint

---

## Example Snippets

**Agent worker (Python pseudo-code)**

```python
# worker.py
import os
from queue_client import QueueClient
from models import TranscriptionModel, SummarizationModel, ActionExtractor

q = QueueClient(os.getenv("RABBIT_URL"))
transcriber = TranscriptionModel(api_key=os.getenv("MODEL_KEY"))
summarizer = SummarizationModel(...)
extractor = ActionExtractor(...)

def handle_meeting(meeting_id, audio_url):
    transcript = transcriber.transcribe(audio_url)
    summary = summarizer.summarize(transcript)
    actions = extractor.extract(transcript, summary)
    q.publish("actions.created", {"meeting_id": meeting_id, "actions": actions})

if __name__ == "__main__":
    q.consume("meeting.created", handle_meeting)
```

**Orchestration rule (JSON)**

```json
{
  "rule_id": "route_high_priority",
  "condition": "priority == 'high'",
  "actions": [
    { "type": "assign", "target": "team_lead" },
    { "type": "notify", "channel": "sms", "delay": 0 }
  ],
  "retry": { "attempts": 3, "delay_seconds": 300 }
}
```

---

## Troubleshooting

| Problem | What to check |
|---|---|
| Worker backlog keeps growing | Inspect the broker, scale up workers, check downstream DB latency |
| Action delivery failures | Review orchestration logs and retry policy, check channel credentials and audit trail |
| Model timeouts | Use model stubs; fall back to degraded mode (store for manual review) |

---

## License

This repository is released under the **MIT License** — see `LICENSE` for the full text.

---

## Acknowledgements

- Architecture and model assignments are inspired by modern multi-agent research and real-world production patterns.
- The design is intentionally vendor-agnostic — swap the model layer for whichever LLM provider or self-hosted checkpoint fits your setup.
