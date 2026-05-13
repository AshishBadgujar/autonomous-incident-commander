#!/usr/bin/env bash
set -euo pipefail

KESTRA_USERNAME="${KESTRA_USERNAME:-admin@local.dev}"
KESTRA_PASSWORD="${KESTRA_PASSWORD:-Admin1234!}"
KESTRA_URL="${KESTRA_URL:-http://localhost:8080}"
DEMO_API_URL="${DEMO_API_URL:-http://localhost:8004}"
INCIDENT_ID="app-auto-$(date +%Y%m%d-%H%M%S)"

curl --fail --show-error --silent \
  -X POST \
  -H "Content-Type: application/json" \
  "${DEMO_API_URL}/simulate-failure" \
  --data-binary @- <<JSON
{
  "incident_id": "${INCIDENT_ID}",
  "reason": "Auto-approved app validation"
}
JSON

echo
echo "Demo API failure simulated."

curl --fail --show-error --silent \
  --user "${KESTRA_USERNAME}:${KESTRA_PASSWORD}" \
  -X POST \
  "${KESTRA_URL}/api/v1/main/executions/incident.app/autonomous_incident" \
  --form "incident_id=${INCIDENT_ID}" \
  --form "service=demo-api" \
  --form "model=${OLLAMA_MODEL:-qwen3:4b}" \
  --form "ollama_base_url=${OLLAMA_BASE_URL:-http://host.docker.internal:11434}" \
  --form "action=restart-demo-api" \
  --form "auto_approve=true" \
  --form 'alert={"receiver":"manual-auto-approved","status":"firing","alerts":[{"status":"firing","labels":{"alertname":"ManualAutoApprovedAppIncident","severity":"critical","service":"demo-api"},"annotations":{"summary":"Auto-approved app validation incident"}}]}'

echo
echo "Auto-approved app validation submitted."
echo "Incident ID: ${INCIDENT_ID}"
