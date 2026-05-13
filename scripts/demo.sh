#!/usr/bin/env bash
set -euo pipefail

echo "Starting Autonomous Incident App..."
docker compose up -d --remove-orphans
npm run native:start

echo
echo "Running smoke test..."
./scripts/smoke_test.sh

echo
echo "Running auto-approved incident..."
./scripts/run_app_auto_approved_test.sh

echo
echo "Open the app console: http://localhost:8004"
echo "Open Kestra executions: http://localhost:8080/ui/executions/incident.app/autonomous_incident"
