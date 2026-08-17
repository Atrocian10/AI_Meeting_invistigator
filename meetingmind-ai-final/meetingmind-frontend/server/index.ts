import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json());

  // Simple health check for proxy and smoke tests
  app.get("/api/health", (_req, res) => {
    res.status(200).json({
      status: "ok",
      db: "ok",
      broker: "ok",
    });
  });

  // Minimal demo flow endpoints for smoke testing
  app.post("/api/v1/meetings", (_req, res) => {
    // In this reference implementation we just return a stub meeting id
    res.status(201).json({
      meeting_id: "demo-meeting-1",
      status: "processing",
    });
  });

  app.get("/api/v1/meetings/:id/summary", (req, res) => {
    const { id } = req.params;
    res.status(200).json({
      meeting_id: id,
      summary: ["This is a demo summary for the meeting."],
      action_items: [
        {
          task: "Replace demo stub with real pipeline integration",
          assignee: "engineering",
          due_date: null,
        },
      ],
    });
  });

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
