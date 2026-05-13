# Build Phases

This project went through six phases, then was simplified into one native app.

## Phase 1: Local Foundation

Kestra, PostgreSQL, Prometheus, and Alertmanager run with Docker Compose. The local app layer runs natively with Node.js.

## Phase 2: Ollama Triage and Gmail Notifications

Kestra collects incident evidence and asks native Ollama for a structured triage brief. Notifications are Gmail-ready, but dry-run by default.

## Phase 3: Context and Memory

The workflow adds service ownership, safe actions, recent logs, and prior incidents. Completed incidents are stored in local JSON memory.

## Phase 4: App Console

The browser console at http://localhost:8004 shows service health, recent activity, incident memory, policy status, and useful links.

## Phase 5: Policy Guardrail

The policy endpoint checks whether the requested action is registered as safe. Auto-recovery only runs when the policy allows it.

## Phase 6: Demo Pack

The repo includes a smoke test, direct webhook test, Prometheus-triggered test, and auto-approved validation path.

## Simplification Pass

The first working version used six native helper processes. They have been merged into one app:

- demo API
- recovery action
- notification endpoint
- incident memory
- policy endpoint
- browser console

This keeps Kestra as the interesting orchestrator while making the local system much easier to run and explain.
