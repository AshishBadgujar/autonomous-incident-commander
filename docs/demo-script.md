# Demo Script

Use this when you want to show the project end to end.

## Start

```bash
npm install
make up
```

If the Ollama model is not installed yet:

```bash
ollama pull qwen3:4b
```

Open:

- App Console: http://localhost:8004
- Kestra: http://localhost:8080

Kestra login is `admin@local.dev` / `Admin1234!`.

## Fastest Demo

In the App Console, click `Run Test Incident`.

Expected result:

1. The demo service enters failure mode.
2. Kestra starts `incident.app.autonomous_incident`.
3. Ollama writes the triage.
4. The policy gate allows `restart-demo-api`.
5. Gmail notification runs in dry-run mode.
6. The recovery action runs.
7. Kestra verifies the service is healthy.
8. The incident appears in memory.

## Terminal Demo

Run the same complete validation from the terminal:

```bash
./scripts/run_app_auto_approved_test.sh
```

Then check:

```bash
make smoke
./scripts/show_incident_memory.sh
```

## Full Observability Demo

This path uses Prometheus and Alertmanager before Kestra starts:

```bash
./scripts/trigger_test_incident.sh
```

Prometheus should detect `demo_api_forced_failure == 1`, Alertmanager should call the Kestra webhook, and Kestra should start the app workflow.

## Manual Kestra Webhook Demo

This skips Prometheus and Alertmanager but still starts the Kestra workflow:

```bash
./scripts/direct_webhook_test.sh
```

## Stop

```bash
make down
```
