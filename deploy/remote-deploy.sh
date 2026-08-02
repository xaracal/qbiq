#!/usr/bin/env bash
set -euo pipefail

DEPLOY_DIR="/opt/qbiq"
COMPOSE_FILE="${DEPLOY_DIR}/docker-compose.prod.yml"
ENV_FILE="${DEPLOY_DIR}/.env.prod"
REGISTRY="${REGISTRY:?REGISTRY is required}"

# Authenticate Docker to Artifact Registry using the VM service account
TOKEN=$(curl -s -H "Metadata-Flavor: Google" \
  "http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token" \
  | python3 -c "import sys, json; print(json.load(sys.stdin)['access_token'])")

REGISTRY_HOST="${REGISTRY%%/*}"
echo "${TOKEN}" | sudo docker login -u oauth2accesstoken --password-stdin "https://${REGISTRY_HOST}"

cd "${DEPLOY_DIR}"
sudo docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" pull
sudo docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" up -d --remove-orphans

curl -fsS http://localhost/health
echo "Deploy complete."
