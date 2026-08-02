#!/usr/bin/env bash
set -euo pipefail

DEPLOY_DIR="/opt/qbiq-dig-store"
COMPOSE_FILE="${DEPLOY_DIR}/docker-compose.prod.yml"
ENV_FILE="${DEPLOY_DIR}/.env.prod"

cd "${DEPLOY_DIR}"
sudo docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" down -v
sudo docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" up -d --remove-orphans

curl -fsS http://localhost/health
echo "Volumes cleared and stack restarted."
