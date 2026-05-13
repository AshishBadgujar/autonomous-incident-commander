const { kestra, ollama } = require("./config");

function appConsoleAlert() {
  return JSON.stringify({
    receiver: "app-console",
    status: "firing",
    alerts: [
      {
        status: "firing",
        labels: {
          alertname: "AppConsoleIncident",
          severity: "critical",
          service: "demo-api",
        },
        annotations: {
          summary: "App console validation incident",
        },
      },
    ],
  });
}

async function startIncident(incidentId) {
  const form = new FormData();
  form.append("incident_id", incidentId);
  form.append("service", "demo-api");
  form.append("model", ollama.model);
  form.append("ollama_base_url", ollama.baseUrl);
  form.append("action", "restart-demo-api");
  form.append("auto_approve", "true");
  form.append("alert", appConsoleAlert());

  const auth = Buffer.from(`${kestra.username}:${kestra.password}`).toString("base64");
  const response = await fetch(`${kestra.url}/api/v1/main/executions/${kestra.namespace}/${kestra.flowId}`, {
    method: "POST",
    headers: { Authorization: `Basic ${auth}` },
    body: form,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(JSON.stringify(data));
  }

  return data;
}

module.exports = {
  startIncident,
};
