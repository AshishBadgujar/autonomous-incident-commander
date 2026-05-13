const services = {
  "demo-api": {
    service: "demo-api",
    owner: "local-owner",
    tier: "customer-facing-demo",
    runbook: "docs/runbooks/demo-api-forced-failure.md",
    incident_channel: "#incidents",
    dependencies: ["orders-db", "payment-gateway"],
    safe_actions: ["restart-demo-api", "rollback-demo-api"],
    default_action: "restart-demo-api",
    escalation: {
      primary: "local-owner",
      secondary: "backup-owner",
    },
    decision_rules: [
      "If forced failure is active, restart-demo-api is safe.",
      "If recovery fails after restart, escalate to local-owner.",
      "If errors continue after recovery, inspect orders-db before repeating recovery.",
    ],
  },
};

function getService(serviceName) {
  return services[serviceName] || {
    service: serviceName,
    owner: "unknown",
    tier: "unknown",
    safe_actions: [],
    default_action: "",
    decision_rules: [],
  };
}

module.exports = {
  services,
  getService,
};
