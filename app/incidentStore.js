const fs = require("fs");
const path = require("path");
const { dataDir } = require("./config");

const dbPath = path.join(dataDir, "incidents.json");

function ensureStore() {
  fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, "[]\n");
  }
}

function readIncidents() {
  ensureStore();
  return JSON.parse(fs.readFileSync(dbPath, "utf8") || "[]");
}

function writeIncidents(incidents) {
  ensureStore();
  fs.writeFileSync(dbPath, `${JSON.stringify(incidents, null, 2)}\n`);
}

function compactIncident(record) {
  return {
    incident_id: record.incident_id,
    service: record.service,
    status: record.status,
    severity: record.severity,
    summary: record.summary,
    current_status: record.current_status,
    recommended_action: record.recommended_action,
    created_at: record.created_at,
  };
}

function recentIncidents(service = "demo-api", limit = 5, includeDetails = false) {
  const incidents = readIncidents()
    .filter((item) => item.service === service)
    .sort((a, b) => b.id - a.id)
    .slice(0, limit);

  return {
    service,
    count: incidents.length,
    incidents: incidents.map((item) => includeDetails ? item : compactIncident(item)),
  };
}

function recordIncident(payload = {}) {
  const incidents = readIncidents();
  const record = {
    id: incidents.length ? Math.max(...incidents.map((item) => item.id || 0)) + 1 : 1,
    incident_id: payload.incident_id,
    service: payload.service || "demo-api",
    status: payload.status || "resolved",
    severity: payload.severity || "critical",
    summary: payload.summary || "",
    current_status: payload.current_status || "",
    recommended_action: payload.recommended_action || "",
    triage: payload.triage ?? null,
    policy: payload.policy ?? null,
    recovery: payload.recovery ?? null,
    verification: payload.verification ?? null,
    created_at: new Date().toISOString(),
  };

  incidents.push(record);
  writeIncidents(incidents);

  return {
    ok: true,
    incident_id: record.incident_id,
    service: record.service,
    status: record.status,
    created_at: record.created_at,
  };
}

module.exports = {
  dbPath,
  ensureStore,
  recentIncidents,
  recordIncident,
};
