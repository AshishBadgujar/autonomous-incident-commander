#!/usr/bin/env bash
set -euo pipefail

DEMO_API_URL="${DEMO_API_URL:-http://localhost:8004}"

curl --fail --show-error --silent \
  -X POST \
  -H "Content-Type: application/json" \
  "${DEMO_API_URL}/recover" \
  --data-binary @- <<'JSON'
{
  "incident_id": "manual-recovery",
  "approved_by": "operator",
  "reason": "Manual local reset"
}
JSON

echo
echo "Demo API recovered."

