# Simple Guide

This project is now intentionally small.

There is one native Node.js app running at http://localhost:8004. It contains the UI, demo service, recovery action, Gmail dry-run notification, policy check, incident memory, logs, and metrics.

Docker only runs the supporting infrastructure: Kestra, PostgreSQL, Prometheus, and Alertmanager.

## The Two Screens

- Open http://localhost:8004 for the simple console.
- Open http://localhost:8080 when you want to inspect the Kestra workflow.

Kestra login is `admin@local.dev` / `Admin1234!`.

## The Story

1. The demo service starts healthy.
2. `Run Test Incident` breaks it on purpose.
3. Kestra starts the incident workflow.
4. Kestra collects health, metrics, logs, service context, and incident history.
5. Ollama writes a structured triage.
6. The policy check confirms `restart-demo-api` is safe.
7. The app dry-runs a Gmail notification.
8. The app recovers the demo service.
9. Kestra verifies recovery and records the incident.

## Daily Commands

```bash
make up
```

Starts everything.

```bash
make smoke
```

Checks that the stack is healthy.

```bash
make demo
```

Runs the prepared local demo path.

```bash
make native-logs
```

Shows the single app log.

```bash
make down
```

Stops everything.
