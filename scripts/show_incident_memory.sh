#!/usr/bin/env bash
set -euo pipefail

MEMORY_API_URL="${MEMORY_API_URL:-http://localhost:8004}"
SERVICE="${SERVICE:-demo-api}"

curl --fail --show-error --silent \
  "${MEMORY_API_URL}/incidents/recent?service=${SERVICE}&limit=10&include_details=true"

echo
