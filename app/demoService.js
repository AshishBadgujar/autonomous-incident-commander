const { serviceName } = require("./config");

const state = {
  failure_mode: false,
  failure_reason: "healthy",
  started_at: Date.now() / 1000,
  recoveries_total: 0,
  last_incident_id: null,
};

const events = [];

function logEvent(level, message, options = {}) {
  events.push({
    timestamp: new Date().toISOString(),
    level,
    service: serviceName,
    message,
    incident_id: options.incident_id || null,
    metadata: options.metadata || {},
  });

  if (events.length > 100) {
    events.shift();
  }
}

function health() {
  return {
    service: serviceName,
    healthy: !state.failure_mode,
    failure_mode: state.failure_mode,
    failure_reason: state.failure_reason,
    uptime_seconds: Number((Date.now() / 1000 - state.started_at).toFixed(2)),
    recoveries_total: state.recoveries_total,
    last_incident_id: state.last_incident_id,
  };
}

function metrics() {
  const forcedFailure = state.failure_mode ? 1 : 0;
  return [
    "# HELP demo_api_forced_failure Whether the demo API is currently in forced failure mode.",
    "# TYPE demo_api_forced_failure gauge",
    `demo_api_forced_failure{service="${serviceName}"} ${forcedFailure}`,
    "# HELP demo_api_recoveries_total Total local recovery actions.",
    "# TYPE demo_api_recoveries_total counter",
    `demo_api_recoveries_total{service="${serviceName}"} ${state.recoveries_total}`,
  ].join("\n");
}

function recentLogs(limit = 25) {
  return {
    service: serviceName,
    count: events.length,
    logs: events.slice(-limit),
  };
}

function simulateFailure(payload = {}) {
  state.failure_mode = true;
  state.failure_reason = payload.reason || "manual simulation";
  state.last_incident_id = payload.incident_id || null;

  logEvent("CRITICAL", "Failure mode enabled for incident simulation.", {
    incident_id: state.last_incident_id,
    metadata: { reason: state.failure_reason },
  });

  return {
    ok: true,
    message: "Demo API is now failing.",
    state,
  };
}

function recover(payload = {}) {
  state.failure_mode = false;
  state.failure_reason = "recovered";
  state.recoveries_total += 1;
  state.last_incident_id = payload.incident_id || null;

  logEvent("INFO", "Demo API recovered after recovery action.", {
    incident_id: state.last_incident_id,
    metadata: {
      approved_by: payload.approved_by || null,
      reason: payload.reason || null,
      recoveries_total: state.recoveries_total,
    },
  });

  return {
    ok: true,
    message: "Demo API recovered.",
    approved_by: payload.approved_by || null,
    reason: payload.reason || null,
    state,
  };
}

module.exports = {
  health,
  logEvent,
  metrics,
  recentLogs,
  recover,
  simulateFailure,
};
