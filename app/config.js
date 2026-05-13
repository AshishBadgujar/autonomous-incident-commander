const path = require("path");

const rootDir = path.resolve(__dirname, "..");

module.exports = {
  port: Number(process.env.PORT || 8004),
  rootDir,
  staticDir: path.join(__dirname, "static"),
  serviceName: "demo-api",
  dataDir: process.env.INCIDENT_MEMORY_DATA_DIR || path.join(rootDir, "data"),
  kestra: {
    url: process.env.KESTRA_URL || "http://localhost:8080",
    username: process.env.KESTRA_USERNAME || "admin@local.dev",
    password: process.env.KESTRA_PASSWORD || "Admin1234!",
    namespace: "incident.app",
    flowId: "autonomous_incident",
  },
  ollama: {
    model: process.env.OLLAMA_MODEL || "qwen3:4b",
    baseUrl: process.env.OLLAMA_BASE_URL || "http://host.docker.internal:11434",
  },
  gmail: {
    host: process.env.GMAIL_SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.GMAIL_SMTP_PORT || 587),
    user: process.env.GMAIL_SMTP_USER || "",
    password: process.env.GMAIL_SMTP_PASSWORD || "",
    from: process.env.GMAIL_FROM || process.env.GMAIL_SMTP_USER || "",
    to: process.env.GMAIL_TO || "",
    dryRun: /^(1|true|yes|on)$/i.test(process.env.GMAIL_DRY_RUN || "true"),
  },
};
