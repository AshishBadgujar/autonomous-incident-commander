#!/usr/bin/env bash
set -euo pipefail

check() {
  local name="$1"
  local url="$2"

  printf "Checking %-24s" "${name}"
  curl --fail --show-error --silent --max-time 8 "${url}" >/dev/null
  printf " ok\n"
}

check "Kestra API" "http://localhost:8081/health"
check "App" "http://localhost:8004/api/health"
check "Demo Health" "http://localhost:8004/health"
check "App Console" "http://localhost:8004/api/overview"
check "Prometheus" "http://localhost:9090/-/ready"
check "Alertmanager" "http://localhost:9093/-/ready"
check "Native Ollama" "http://localhost:11434/api/tags"

curl --fail --show-error --silent --max-time 8 \
  -X POST \
  -H "Content-Type: application/json" \
  "http://localhost:8004/policy/evaluate" \
  --data '{"service":"demo-api","action":"restart-demo-api","auto_approve":true}' \
  | grep -q '"allowed":true'

echo "Policy gate ok"
echo "Smoke test complete"
