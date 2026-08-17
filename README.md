# MeetingMind AI 

---

## **Table of contents**

1. [Project overview](https://chatgpt.com/c/69a5b4a3-3c9c-8328-be04-7b787a42e894#project-overview)  
2. [High-level architecture diagrams](https://chatgpt.com/c/69a5b4a3-3c9c-8328-be04-7b787a42e894#high-level-architecture-diagrams)  
3. [Core components](https://chatgpt.com/c/69a5b4a3-3c9c-8328-be04-7b787a42e894#core-components)  
4. [Data & model mapping](https://chatgpt.com/c/69a5b4a3-3c9c-8328-be04-7b787a42e894#data--model-mapping)  
5. [API surface & event model](https://chatgpt.com/c/69a5b4a3-3c9c-8328-be04-7b787a42e894#api-surface--event-model)  
6. [Local development & runbook (Docker Compose)](https://chatgpt.com/c/69a5b4a3-3c9c-8328-be04-7b787a42e894#local-development--runbook-docker-compose)  
7. [Production deployment notes (Kubernetes)](https://chatgpt.com/c/69a5b4a3-3c9c-8328-be04-7b787a42e894#production-deployment-notes-kubernetes)  
8. [Observability & SLOs](https://chatgpt.com/c/69a5b4a3-3c9c-8328-be04-7b787a42e894#observability--slos)  
9. [Security, privacy & compliance](https://chatgpt.com/c/69a5b4a3-3c9c-8328-be04-7b787a42e894#security-privacy--compliance)  
10. [Testing strategy](https://chatgpt.com/c/69a5b4a3-3c9c-8328-be04-7b787a42e894#testing-strategy)  
11. [Contributing](https://chatgpt.com/c/69a5b4a3-3c9c-8328-be04-7b787a42e894#contributing)  
12. [License](https://chatgpt.com/c/69a5b4a3-3c9c-8328-be04-7b787a42e894#license)

---

## **Project overview**

MeetingMind AI turns messy meetings into reliable, actionable workflows. The system listens or ingests meeting transcripts, runs a multi-agent pipeline to transcribe, summarize, extract action items, answer queries, and orchestrate integration into team tools. The orchestration layer routes tasks using policies and ML-informed heuristics while preserving audit trails and human oversight.


---

## **High-level architecture diagrams**

Use the diagrams below as authoritative illustrations for design reviews and onboarding. They are written as **Mermaid** so they render on GitHub.

### **1\) System Overview (data flow)**

flowchart LR  
  subgraph Ingest  
    A\[Meeting audio / transcript\] \--\> B\[Ingest API / Uploader\]  
    B \--\> C\[Preprocessor (speaker diarization, normalize)\]  
  end

  subgraph Agents  
    C \--\> TA\[Transcription Agent\<br/\>GLM-4.5-Air\]  
    TA \--\> SA\[Summarization Agent\<br/\>GLM-4.7 (Thinking Mode)\]  
    TA \--\> AE\[Action Extraction Agent\<br/\>GLM-4.6 \+ Function Calling\]  
    SA \--\> QA\[Q\&A Agent\<br/\>GLM-4-32B \+ RAG\]  
    AE \--\> OR\[Orchestration Agent\<br/\>GLM-4.7-Flash \+ MCP\]  
  end

  subgraph Integrations  
    OR \--\> PT\[Project Tracker (generic)\]  
    OR \--\> CHAT\[Team Chat (generic)\]  
    OR \--\> CAL\[Calendar / Invite\]  
    OR \--\> EMAIL\[Email\]  
  end

  subgraph Observability  
    OR \--\> MON\[Monitoring & Audit\]  
    AE \--\> DB\[Vector DB (knowledge store)\]  
  end

### **2\) Sequence diagram — one meeting → actionable item**

sequenceDiagram  
  participant User  
  participant Ingest  
  participant Transcription  
  participant Summarizer  
  participant Extractor  
  participant Orchestrator  
  participant Channel

  User-\>\>Ingest: Upload audio / start meeting  
  Ingest-\>\>Transcription: stream audio  
  Transcription--\>\>Summarizer: cleaned transcript  
  Summarizer--\>\>Extractor: summarized decisions  
  Extractor--\>\>Orchestrator: structured action items (JSON)  
  Orchestrator--\>\>Channel: create task / post message / calendar invite  
  Channel--\>\>User: notification (ack)  
  Orchestrator--\>\>Monitoring: audit log \+ metrics

### **3\) Component relationship (deployment view)**

graph TD  
  subgraph Backend Cluster  
    API\[FastAPI / GraphQL API\]  
    OrchestratorSvc\[Orchestrator (worker)\]  
    AgentWorkers\[Agent workers (containerized)\]  
    WorkerQueue\[Message broker (RabbitMQ / Kafka)\]  
    Redis(Cache)  
    Postgres\[(Postgres DB)\]  
    VectorDB\[(Vector DB)\]  
    Storage\[(S3 / Object Storage)\]  
  end

  API \--\> WorkerQueue  
  WorkerQueue \--\> AgentWorkers  
  AgentWorkers \--\> VectorDB  
  AgentWorkers \--\> Postgres  
  AgentWorkers \--\> Storage  
  OrchestratorSvc \--\> WorkerQueue  
  API \--\> Redis  
  API \--\> Postgres

---

## **Core components**

* **Ingest API**  
  * Accepts audio files, recorded meetings, or transcripts (multipart upload / streaming).  
  * Preprocess: speaker diarization, noise filtering, normalization.  
* **Agent workers**  
  * Dockerized processes that run specialized agents:  
    * **Transcription Agent** — audio → cleaned text \+ speaker labels.  
    * **Summarization Agent** — long context summarization with "thinking mode" traces.  
    * **Action Extraction Agent** — function-calling to produce structured action items (JSON).  
    * **Q\&A Agent** — RAG-powered answer retrieval from vector DB.  
    * **Integration/Orchestration Agent** — routing, retries, channel fan-out, MCP tool discovery.  
* **Orchestration & Routing**  
  * Decision engine that applies routing rules (low-code), ML scoring, priority queues, and retry policies. Supports human overrides and audit trails.  
* **Storage & DBs**  
  * **Postgres** for metadata, audit logs.  
  * **Vector DB** (Milvus/Pinecone/Weaviate or equivalent) for embeddings & retrieval.  
  * **Object Storage** (S3 or compatible) for audio and transcripts.  
* **Message broker**  
  * RabbitMQ / Kafka / Redis Streams for scaling agent workloads and decoupling.  
* **API & Web UI**  
  * FastAPI (or Node.js) backend exposes ingestion endpoints, admin UI, and rule editor.  
* **Monitoring & Audit**  
  * Prometheus \+ Grafana and centralized logs (ELK / Loki) for metrics, SLA tracking, and forensics.

---

## **Data & model mapping**

The README assumes the following model assignment (logical mapping):

* **Transcription**: `GLM-4.5-Air` — low latency, large context for streaming transcription and speaker attribution.  
* **Summarization**: `GLM-4.7` — chain-of-thought / thinking mode for deep summarization and decision extraction.  
* **Action Extraction**: `GLM-4.6` — native function-calling and structured outputs (JSON).  
* **Q\&A / RAG**: `GLM-4-32B` — retrieval-augmented generation for historical queries with citation.  
* **Orchestration**: `GLM-4.7-Flash + MCP` — orchestration, tool discovery, high concurrency.

These names are **logical references** in the architecture. The implementation should replace them with the exact vendor model signatures or local checkpoints your environment uses.

---

## **API surface & event model**

### **REST API example (FastAPI pseudo-spec)**

`POST /api/v1/meetings` — create a meeting (upload audio or transcript)

POST /api/v1/meetings  
Content-Type: multipart/form-data  
Body:  
  file: audio.mp3  
  metadata: { "title": "Q3 Budget", "participants": \["alice","bob"\] }  
Response: { "meeting\_id": "m\_123", "status": "processing" }

`GET /api/v1/meetings/{id}/summary`

{  
  "meeting\_id": "m\_123",  
  "summary": \[  
    "Budget: $50k allocated (LinkedIn $20k...)",   
    "Decisions: Q3 plan approved"  
  \],  
  "action\_items": \[  
    { "task": "Draft LinkedIn ad copy", "assignee": "Bob", "due\_date":"2026-08-05" }  
  \],  
  "audit\_log\_id": "audit\_456"  
}

### **Example event flow (message broker)**

* `meeting.created` → preprocessing worker  
* `transcript.ready` → transcription agent  
* `summary.generated` → action extraction / storage  
* `action.created` → orchestrator → delivery events (`delivery.sent`, `delivery.ack`, `delivery.failed`)

---

## **Local development & runbook (Docker Compose)**

A basic `docker-compose.yml` will spin up API, worker, Postgres, Redis, and a mock vector DB.

version: '3.8'  
services:  
  postgres:  
    image: postgres:15  
    environment:  
      POSTGRES\_PASSWORD: password  
      POSTGRES\_DB: meetingmind  
    volumes: \["./data/postgres:/var/lib/postgresql/data"\]

  redis:  
    image: redis:7  
    command: redis-server \--appendonly yes

  rabbitmq:  
    image: rabbitmq:3-management  
    ports: \["15672:15672","5672:5672"\]

  api:  
    build: ./services/api  
    command: uvicorn app.main:app \--host 0.0.0.0 \--port 8000 \--reload  
    ports:  
      \- "8000:8000"  
    environment:  
      \- DATABASE\_URL=postgresql://postgres:password@postgres/meetingmind  
      \- REDIS\_URL=redis://redis:6379  
      \- RABBIT\_URL=amqp://rabbitmq:5672  
    depends\_on:  
      \- postgres  
      \- redis  
      \- rabbitmq

  worker:  
    build: ./services/agents  
    command: python \-u worker.py  
    environment:  
      \- RABBIT\_URL=amqp://rabbitmq:5672  
      \- VECTOR\_URL=http://vector:8080  
    depends\_on:  
      \- rabbitmq  
      \- api

**.env (example)**

DATABASE\_URL=postgresql://postgres:password@postgres/meetingmind  
REDIS\_URL=redis://redis:6379  
RABBIT\_URL=amqp://rabbitmq:5672  
OBJECT\_STORAGE\_URL=http://minio:9000  
SECRET\_KEY=change\_this\_to\_a\_secure\_value

**Quick start**

git clone \<repo\>  
cd repo  
docker-compose up \--build  
\# Open http://localhost:8000/docs

---

## **Production deployment notes (Kubernetes)**

* **K8s primitives**  
  * Deploy API as a Deployment \+ Service (ClusterIP) behind ingress (NGINX / Traefik).  
  * Agent workers as scalable Deployments (HPA based on queue depth / CPU).  
  * Use StatefulSets for Postgres / Vector DB or managed services.  
  * Use PersistentVolumeClaims for object storage or use real S3.  
  * Configure HorizontalPodAutoscaler for workers and orchestrator.  
* **Security**  
  * Use KMS/SecretsManager for secrets.  
  * MTLS between services (service mesh like Istio or Linkerd recommended).  
* **Observability**  
  * Prometheus scraping endpoints, Grafana dashboards, and Loki/ELK for logs.  
* **CI/CD**  
  * Build containers in CI, push to registry, deploy via GitOps (ArgoCD) or CI pipeline (GitHub Actions \+ kubectl/helm).

---

## **Observability & SLOs**

* **Metrics**  
  * Latency (per-agent): transcription latency, summarization latency, extraction time.  
  * Throughput: processed meetings/minute, action items/hour.  
  * Delivery success rate: % ACKs vs failed deliveries.  
* **SLO examples**  
  * Transcription latency: 95% \< 1s (streamed chunk).  
  * Orchestrator delivery success: 99% within SLA.  
* **Tracing**  
  * Use distributed tracing (OpenTelemetry) to follow a message through agents and channels.  
* **Audit**  
  * Immutable audit logs stored in Postgres and optionally exported to cold storage for compliance.

---

## **Security, privacy & compliance**

* **Data minimization**: store only required metadata and timestamps for routing. Remove or redact PII unless customer explicitly opts in for storage.  
* **Anonymization**: when building aggregated benchmarks, strip tokens and apply k-anonymity before aggregation.  
* **Encryption**: TLS in transit, AES-256 at rest for all stored audio/transcripts.  
* **Access control**: RBAC for UI and API admin surfaces. Human-in-loop review functionality should require elevated privileges.  
* **Compliance**: plan for SOC2 readiness and regional data residency. Provide options for on-prem or VPC-isolated deployments for enterprise customers.

---

## **Testing strategy**

* **Unit tests**: for parsing, transformation logic, and small components.  
* **Integration tests**: end-to-end tests that run agents locally (mock models) and verify event flows and database state.  
* **Contract tests**: ensure agents adhere to the agreed JSON contract for actions.  
* **Load tests**: simulate concurrent meetings and validate throughput and autoscaling behavior.  
* **Security tests**: static code analysis, dependency vulnerability scans, and pen tests for critical endpoints.

Tips:

* Use local model stubs/mocks so CI does not call real LLM APIs during unit tests.  
* Keep a small dataset of canned meeting transcripts for deterministic test runs.

---

## **Contributing**

We welcome contributions — please follow the project conventions.

1. Fork the repo and open a feature branch: `feature/<ticket>-short-desc`.  
2. Run tests locally and add unit/integration tests for new features.  
3. Open a Pull Request with a clear description and link to issues.  
4. Ensure CI passes (lint, unit, integration).  
5. For larger changes, open an RFC issue to discuss architecture impact.

**Code style**

* Python: Black formatting, type hints, and docstrings.  
* JavaScript/TypeScript (if used): Prettier \+ ESLint.

---

## **Example dev snippets**

**Example agent worker (Python pseudo)**

\# worker.py  
import os  
import json  
from queue\_client import QueueClient  
from models import TranscriptionModel, SummarizationModel, ActionExtractor

q \= QueueClient(os.getenv("RABBIT\_URL"))

transcriber \= TranscriptionModel(api\_key=os.getenv("MODEL\_KEY"))  
summarizer \= SummarizationModel(...)  
extractor \= ActionExtractor(...)

def handle\_meeting(meeting\_id, audio\_url):  
    transcript \= transcriber.transcribe(audio\_url)  
    summary \= summarizer.summarize(transcript)  
    actions \= extractor.extract(transcript, summary)  
    q.publish("actions.created", {"meeting\_id": meeting\_id, "actions": actions})

if \_\_name\_\_ \== "\_\_main\_\_":  
    q.consume("meeting.created", handle\_meeting)

**Sample orchestration rule (JSON)**

{  
  "rule\_id": "route\_high\_priority",  
  "condition": "priority \== 'high'",  
  "actions": \[  
    { "type": "assign", "target": "team\_lead" },  
    { "type": "notify", "channel": "sms", "delay": 0 }  
  \],  
  "retry": { "attempts": 3, "delay\_seconds": 300 }  
}

---

## **Troubleshooting & runbook (short)**

* **Worker backlog grows** → Inspect broker, scale workers, check downstream DB latency.  
* **Action delivery failures** → Check orchestration logs (retry policy), inspect channel credentials, consult audit trail for error codes.  
* **Model timeouts** → Use model stubs in quarantine; fallback to degraded mode (store for manual review).

---

## **License**

This repository is available under the **MIT License** — see `LICENSE` for full text.

---

## **Acknowledgements & references**

* Architecture and models inspired by modern multi-agent research and practical production patterns.  
* Foundation and orchestration concepts build on a modular design intended to be vendor-agnostic — adapt the model layer to whichever LLM provider or self-hosted checkpoints you use.
