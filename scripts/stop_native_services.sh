#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${ROOT_DIR}"

if [ ! -d tmp/pids ]; then
  echo "No native service pid directory found."
  exit 0
fi

for pid_file in tmp/pids/*.pid; do
  [ -e "${pid_file}" ] || continue
  name="$(basename "${pid_file}" .pid)"
  pid="$(cat "${pid_file}")"

  if kill -0 "${pid}" 2>/dev/null; then
    echo "Stopping ${name} (${pid})..."
    kill "${pid}" 2>/dev/null || true
  fi

  rm -f "${pid_file}"
done

echo "Native app stopped."
