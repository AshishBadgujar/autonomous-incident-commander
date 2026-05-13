#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${ROOT_DIR}"

mkdir -p tmp/pids tmp/logs data

if [ -f .env ]; then
  set -a
  . ./.env
  set +a
fi

start_service() {
  local name="$1"
  shift
  local pid_file="tmp/pids/${name}.pid"
  local log_file="tmp/logs/${name}.log"

  if [ -f "${pid_file}" ] && kill -0 "$(cat "${pid_file}")" 2>/dev/null; then
    echo "${name} already running on pid $(cat "${pid_file}")"
    return
  fi

  echo "Starting ${name}..."
  nohup "$@" >"${log_file}" 2>&1 &
  echo "$!" >"${pid_file}"
}

start_service app env \
  PORT=8004 \
  INCIDENT_MEMORY_DATA_DIR="${INCIDENT_MEMORY_DATA_DIR:-${ROOT_DIR}/data}" \
  KESTRA_URL="${KESTRA_URL:-http://localhost:8080}" \
  KESTRA_USERNAME="${KESTRA_USERNAME:-admin@local.dev}" \
  KESTRA_PASSWORD="${KESTRA_PASSWORD:-Admin1234!}" \
  OLLAMA_MODEL="${OLLAMA_MODEL:-qwen3:4b}" \
  OLLAMA_BASE_URL="${OLLAMA_BASE_URL:-http://host.docker.internal:11434}" \
  node app/server.js

echo "Native app started. Logs are in tmp/logs."
