# Quick Start

This is the shortest path to run the project locally.

## 1. Install Dependencies

```bash
cp .env.example .env
npm install
```

## 2. Pull the Ollama Model

```bash
ollama pull qwen3:4b
```

## 3. Start Everything

```bash
make up
```

Open:

- App Console: http://localhost:8004
- Kestra: http://localhost:8080
- Prometheus: http://localhost:9090
- Alertmanager: http://localhost:9093

Kestra login:

- Username: `admin@local.dev`
- Password: `Admin1234!`

## 4. Run a Test

From the app console, click `Run Test Incident`.

Or run the terminal validation:

```bash
make smoke
./scripts/run_app_auto_approved_test.sh
```

## 5. Stop Everything

```bash
make down
```
