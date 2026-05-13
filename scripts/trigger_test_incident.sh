#!/usr/bin/env bash
set -euo pipefail

DEMO_API_URL="${DEMO_API_URL:-http://localhost:8004}"
INCIDENT_ID="demo-$(date +%Y%m%d-%H%M%S)"

curl --fail --show-error --silent \
  -X POST \
  -H "Content-Type: application/json" \
  "${DEMO_API_URL}/simulate-failure" \
  --data-binary @- <<JSON
{
  "incident_id": "${INCIDENT_ID}",
  "reason": "Simulated failure for Autonomous Incident App"
}
JSON

echo
echo "Demo API failure simulated."
echo "Incident ID: ${INCIDENT_ID}"
echo "Prometheus should fire DemoApiForcedFailure after roughly 10 seconds."
echo "Kestra should start the Autonomous Incident App flow shortly after that."
