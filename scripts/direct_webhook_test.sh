#!/usr/bin/env bash
set -euo pipefail

KESTRA_USERNAME="${KESTRA_USERNAME:-admin@local.dev}"
KESTRA_PASSWORD="${KESTRA_PASSWORD:-Admin1234!}"
KESTRA_URL="${KESTRA_URL:-http://localhost:8080}"

curl --fail --show-error --silent \
  --user "${KESTRA_USERNAME}:${KESTRA_PASSWORD}" \
  -X POST \
  -H "Content-Type: application/json" \
  "${KESTRA_URL}/api/v1/main/executions/webhook/incident.app/autonomous_incident/local-incident-key" \
  --data-binary @- <<'JSON'
{
  "receiver": "manual-direct-webhook",
  "status": "firing",
  "alerts": [
    {
      "status": "firing",
      "labels": {
        "alertname": "ManualDirectWebhookIncident",
        "severity": "critical",
        "service": "demo-api"
      },
      "annotations": {
        "summary": "Manual direct webhook test"
      }
    }
  ]
}
JSON

echo
echo "Direct Kestra app webhook test submitted."
