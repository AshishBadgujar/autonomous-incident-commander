const { kestra, ollama, port } = require("./config");
const { getService } = require("./catalog");
const demo = require("./demoService");
const incidentStore = require("./incidentStore");
const notification = require("./notification");
const policy = require("./policy");
const { startIncident } = require("./kestraClient");

function boundedNumber(value, fallback, min, max) {
  const parsed = Number(value || fallback);
  if (Number.isNaN(parsed)) return fallback;
  return Math.max(min, Math.min(max, parsed));
}

function registerRoutes(app) {
  app.get("/api/health", (_req, res) => {
    res.json({
      service: "app",
      healthy: true,
      port,
      routes: ["ui", "demo", "memory", "policy", "notification", "recovery"],
      incident_memory_database: incidentStore.dbPath,
    });
  });

  app.get("/api/overview", (_req, res) => {
    const health = demo.health();
    const catalog = getService("demo-api");

    res.json({
      updated_at: new Date().toISOString(),
      service: "app",
      model: ollama.model,
      health,
      logs: demo.recentLogs(8),
      memory: incidentStore.recentIncidents("demo-api", 5, false),
      catalog,
      policy: policy.evaluate({
        service: "demo-api",
        action: catalog.default_action,
        auto_approve: true,
        health,
      }),
      notification: notification.health(),
      links: {
        kestra: "http://localhost:8080",
        kestra_executions: `http://localhost:8080/ui/executions/${kestra.namespace}/${kestra.flowId}`,
        prometheus: "http://localhost:9090",
        alertmanager: "http://localhost:9093",
        app: "http://localhost:8004",
        demo_api: "http://localhost:8004/health",
        memory: "http://localhost:8004/incidents/recent?service=demo-api",
      },
    });
  });

  app.post("/api/recover", (_req, res) => {
    res.json(demo.recover({
      incident_id: "app-console-recovery",
      approved_by: "app-console",
      reason: "Manual app console recovery",
    }));
  });

  app.post("/api/run-incident", async (_req, res, next) => {
    try {
      const incidentId = `ui-${new Date().toISOString().replace(/[-:]/g, "").slice(0, 15)}`;
      demo.simulateFailure({
        incident_id: incidentId,
        reason: "App console validation incident",
      });

      res.json(await startIncident(incidentId));
    } catch (error) {
      next(error);
    }
  });

  app.get("/health", (_req, res) => {
    const health = demo.health();
    if (!health.healthy) {
      res.status(503);
    }
    res.json(health);
  });

  app.post("/simulate-failure", (req, res) => {
    res.json(demo.simulateFailure(req.body || {}));
  });

  app.post("/recover", (req, res) => {
    res.json(demo.recover(req.body || {}));
  });

  app.get("/metrics", (_req, res) => {
    res.type("text/plain").send(`${demo.metrics()}\n`);
  });

  app.get("/logs/recent", (req, res) => {
    const limit = boundedNumber(req.query.limit, 25, 1, 100);
    res.json(demo.recentLogs(limit));
  });

  app.get("/services/:serviceName", (req, res) => {
    res.json(getService(req.params.serviceName));
  });

  app.post("/policy/evaluate", (req, res) => {
    res.json(policy.evaluate(req.body || {}));
  });

  app.get("/incidents/recent", (req, res) => {
    const service = req.query.service || "demo-api";
    const limit = boundedNumber(req.query.limit, 5, 1, 25);
    const includeDetails = String(req.query.include_details || "false") === "true";
    res.json(incidentStore.recentIncidents(service, limit, includeDetails));
  });

  app.post("/incidents", (req, res) => {
    res.json(incidentStore.recordIncident(req.body || {}));
  });

  app.get("/notify/health", (_req, res) => {
    res.json(notification.health());
  });

  app.post("/notify", async (req, res, next) => {
    try {
      res.json(await notification.send(req.body || {}));
    } catch (error) {
      next(error);
    }
  });

  app.post("/actions/restart-demo-api", (req, res) => {
    const payload = {
      incident_id: req.body?.incident_id || "manual",
      approved_by: req.body?.approved_by || "local-operator",
      reason: req.body?.reason || "approved from Kestra",
    };

    res.json({
      ok: true,
      action: "restart-demo-api",
      incident_id: payload.incident_id,
      demo_api_response: demo.recover(payload),
    });
  });

  app.post("/actions/rollback-demo-api", (req, res) => {
    const payload = {
      incident_id: req.body?.incident_id || "manual",
      approved_by: req.body?.approved_by || "local-operator",
      reason: `rollback requested: ${req.body?.reason || "approved from Kestra"}`,
    };

    res.json({
      ok: true,
      action: "rollback-demo-api",
      incident_id: payload.incident_id,
      demo_api_response: demo.recover(payload),
    });
  });
}

module.exports = {
  registerRoutes,
};
