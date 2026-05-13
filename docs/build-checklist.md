# Build Checklist

## Local Runtime

- [x] Docker Compose infrastructure for Kestra, PostgreSQL, Prometheus, and Alertmanager
- [x] One native Node.js app on port `8004`
- [x] Native Ollama integration
- [x] Local `.env` configuration
- [x] Simple start, stop, smoke, and demo commands

## App

- [x] Browser console
- [x] Small app modules with clear responsibilities
- [x] Demo service health endpoint
- [x] Simulated failure endpoint
- [x] Safe recovery endpoint
- [x] Prometheus metrics endpoint
- [x] Recent logs endpoint
- [x] Service catalog endpoint
- [x] Policy evaluation endpoint
- [x] Gmail dry-run or live SMTP notification endpoint
- [x] Local JSON incident memory

## Kestra Workflow

- [x] Alert/webhook ingestion
- [x] Evidence collection
- [x] Native Ollama triage
- [x] Policy gate before recovery
- [x] Gmail notification step
- [x] Human approval path
- [x] Auto-approved safe action path
- [x] Recovery verification
- [x] Incident memory recording
- [x] Postmortem log

## Validation

- [x] `make smoke`
- [x] `./scripts/direct_webhook_test.sh`
- [x] `./scripts/trigger_test_incident.sh`
- [x] `./scripts/run_app_auto_approved_test.sh`
- [x] Prometheus scrape target points to `host.docker.internal:8004`
- [x] Docker app containers removed
