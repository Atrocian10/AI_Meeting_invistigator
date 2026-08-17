import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerChatRoutes } from "./chat";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // CORS for development
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "authorization, content-type, x-client-info, apikey");
    if (req.method === "OPTIONS") return res.sendStatus(200);
    next();
  });

  // Health endpoint
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      mockMode: process.env.MOCK_MODE === "true",
      timestamp: new Date().toISOString(),
    });
  });

  // Mock mode stubs
  if (process.env.MOCK_MODE === "true") {
    const fs = await import("fs");
    const path = await import("path");
    const mockDir = path.resolve(process.cwd(), "../../mock-data");

    app.post("/api/v1/models/transcribe", (_req, res) => {
      try {
        const transcript = fs.readFileSync(path.join(mockDir, "transcripts/meeting_001.txt"), "utf8");
        res.json({ transcript });
      } catch {
        res.json({ transcript: "Mock transcript not found. Ensure mock-data/ directory exists." });
      }
    });

    app.get("/api/v1/meetings/:id/summary", (req, res) => {
      try {
        const summary = JSON.parse(fs.readFileSync(path.join(mockDir, "summaries/sum_meeting_001_v1.json"), "utf8"));
        const actions = JSON.parse(fs.readFileSync(path.join(mockDir, "actions/actions_meeting_001.json"), "utf8"));
        res.json({ ...summary, action_items: actions });
      } catch {
        res.json({ summary_text: "Mock summary", action_items: [] });
      }
    });
  }

  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  // Chat API with streaming and tool calling
  registerChatRoutes(app);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
