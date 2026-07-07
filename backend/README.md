# Backend (FastAPI)

A minimal FastAPI service, scaffolded so the frontend has a real API to grow
into. The story storage here is in-memory — swap `app/api/routes/stories.py`
for a real database (Postgres via SQLAlchemy/SQLModel is a natural fit) before
relying on it for anything persistent.

## Setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate   # .venv\Scripts\activate on Windows
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

The API is then available at `http://localhost:8000`, with interactive docs
at `http://localhost:8000/docs`.

## Layout

```
backend/
  app/
    main.py            FastAPI app, CORS, router wiring
    core/config.py     Settings (env-driven via pydantic-settings)
    schemas/story.py    Pydantic models mirroring src/shared/types/story.ts
    api/routes/         Route modules, one per resource
  requirements.txt
```

## Connecting the frontend

Set `VITE_API_URL` in the frontend's `.env` (see the root `.env.example`) to
point at this server, e.g. `http://localhost:8000/api`. The frontend's
`src/shared/services/api.ts` reads that variable.
