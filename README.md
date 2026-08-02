# QBIQ — Mini E-Commerce Platform

Full-stack digital products shop: **FastAPI** backend, **Vue 3** frontend, **MongoDB**, **Redis**, **Docker Compose**, **Terraform** (GCP).

## Prerequisites

- Node.js 24+
- Python 3.12+
- Docker & Docker Compose (Phase 5+)

## Local development

### Backend

```bash
cd backend
python3.12 -m venv .venv
source .venv/bin/activate
pip install -r requirements-dev.txt
uvicorn app.main:app --reload --port 8000
```

Health check: http://localhost:8000/health  
API docs: http://localhost:8000/docs

### Frontend

```bash
cd frontend
npm ci
npm run dev
```

App: http://localhost:5173

## Project phases

| Phase | Status |
|-------|--------|
| 0 — Scaffold | Done |
| 1 — Products API | Pending |
| 2 — Cart API | Pending |
| 3 — Frontend core | Pending |
| 4 — Pages + UI | Pending |
| 5 — Docker + tests | Pending |
| 6 — Resilience | Pending |
| 7 — GCP deploy | Pending |

## Pinned stack (highlights)

- **Backend:** FastAPI 0.136.1, Beanie 2.1.0, Python 3.12
- **Frontend:** Vue 3.5.40, Vite 8.2.0, Pinia 4.0.2, shadcn-vue (Sky theme)
- **Docker:** `python:3.12.8-slim-bookworm`, `node:24.11.0-bookworm-slim`, `mongo:8.0.4-noble`, `redis:8.0.2-alpine`
