# Autonomous Incident App

A local incident-response lab powered by Kestra, Ollama, and one native Node.js app.

The goal is simple: break a demo service, let Kestra collect evidence, ask Ollama for triage, check a safety policy, notify through Gmail dry-run, recover the service, and remember what happened.

For the shortest setup path, see [QUICKSTART.md](QUICKSTART.md).

## What Runs

There are only two layers now:

- Docker runs infrastructure: Kestra, PostgreSQL, Prometheus, and Alertmanager.
- Node.js runs one native app on port `8004`.

The app includes the browser console, breakable demo API, recovery action, incident memory, policy check, recent logs, metrics, and Gmail notification endpoint.

## Main URLs

- App Console: http://localhost:8004
- App Health: http://localhost:8004/api/health
- Demo Service Health: http://localhost:8004/health
- Kestra UI: http://localhost:8080
- Prometheus: http://localhost:9090
- Alertmanager: http://localhost:9093

Kestra login:

- Username: `admin@local.dev`
- Password: `Admin1234!`

## Quick Start

```bash
cp .env.example .env
npm install
make up
```

Open http://localhost:8004 and click `Run Test Incident`.

That button intentionally breaks the demo service, starts the Kestra app workflow, auto-approves the safe local recovery action, verifies recovery, and records the incident.

## Ollama

This project uses your native Ollama installation. Pull the default model once:

```bash
ollama pull qwen3:4b
```

`qwen3:4b` is the default because it is light enough for a laptop and good enough at structured incident triage. Kestra runs inside Docker, so it reaches native Ollama through:

```bash
OLLAMA_BASE_URL=http://host.docker.internal:11434
```

## Useful Commands

```bash
make up
```

Starts Docker infrastructure and the one native app.

```bash
make smoke
```

Checks Kestra, Prometheus, Alertmanager, Ollama, the app, and the policy gate.

```bash
make demo
```

Starts the stack and prints the fastest demo path.

```bash
make native-logs
```

Shows the app log.

```bash
make down
```

Stops the app and Docker infrastructure.

## Test Paths

Fast direct Kestra webhook:

```bash
./scripts/direct_webhook_test.sh
```

Full Prometheus and Alertmanager path:

```bash
./scripts/trigger_test_incident.sh
```

Full non-interactive validation:

```bash
./scripts/run_app_auto_approved_test.sh
```

Show stored incident memory:

```bash
./scripts/show_incident_memory.sh
```

## Important Endpoints

- `GET /api/health`: app health.
- `GET /health`: demo service health.
- `POST /simulate-failure`: intentionally break the demo service.
- `POST /recover`: recover the demo service.
- `GET /metrics`: Prometheus metrics.
- `GET /logs/recent`: recent demo-service events.
- `GET /services/demo-api`: service ownership and safe actions.
- `POST /policy/evaluate`: checks whether a recovery action is allowed.
- `POST /notify`: Gmail dry-run or live SMTP notification.
- `GET /incidents/recent?service=demo-api`: incident memory.

All of those live in the one app at `http://localhost:8004`.

## Repo Layout

```text
app/server.js              app entrypoint
app/routes.js              HTTP routes
app/config.js              environment-backed settings
app/demoService.js         breakable demo service state
app/incidentStore.js       local JSON incident memory
app/policy.js              safe-action policy check
app/notification.js        Gmail dry-run or SMTP delivery
app/kestraClient.js        Kestra execution client
app/catalog.js             service ownership and safe actions
app/static/                browser console
kestra/flows/              Kestra workflows
observability/             Prometheus and Alertmanager config
scripts/                   helper scripts
docs/                      short app docs
data/                      local incident memory, ignored by git
tmp/                       local pids and logs, ignored by git
```

## Docs

- [Quick Start](QUICKSTART.md)
- [Simple Guide](docs/simple-guide.md)
- [Architecture](docs/architecture.md)
- [Demo Script](docs/demo-script.md)
- [Gmail Setup](docs/gmail.md)
- [Build Phases](docs/phases.md)
- [Build Checklist](docs/build-checklist.md)
