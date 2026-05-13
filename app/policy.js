const { getService } = require("./catalog");

function evaluate(payload = {}) {
  const service = payload.service || "demo-api";
  const context = getService(service);
  const safeActions = context.safe_actions || [];
  const action = payload.action || "";
  const allowed = safeActions.includes(action);
  const reasons = [];

  if (allowed) {
    reasons.push(`${action} is registered as a safe action for ${service}.`);
  } else {
    reasons.push(`${action} is not registered as a safe action for ${service}.`);
  }

  if (payload.auto_approve) {
    reasons.push("Auto-approval is enabled; only safe catalog actions may run.");
  } else {
    reasons.push("Human approval is required before recovery.");
  }

  return {
    allowed,
    service,
    action,
    risk: allowed ? "low" : "blocked",
    requires_human_approval: !(payload.auto_approve && allowed),
    reasons,
    safe_actions: safeActions,
  };
}

module.exports = {
  evaluate,
};
