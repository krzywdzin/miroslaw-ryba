# Installation Guide

This guide walks you through setting up **Miroslaw Ryba** for local development or production deployment.

## Prerequisites

| Requirement | Minimum Version | Notes |
|-------------|----------------|-------|
| **Docker** | >= 24.0 | Required for MiroFish backend |
| **Docker Compose** | v2 | Included with Docker Desktop |
| **Node.js** | >= 18.0 | Frontend development |
| **npm** | >= 9.0 | Package management |
| **Git** | Latest | Repository cloning |

## Option 1: Docker (Recommended)

Docker is the recommended approach -- it handles the complex Python backend dependencies automatically.

### Step 1: Clone the repository

```bash
git clone https://github.com/OWNER/miroslaw-ryba.git
cd miroslaw-ryba
```

### Step 2: Configure environment

```bash
cp .env.example .env
```

Open `.env` in your editor and fill in your API keys. At minimum, you need:

- `LLM_API_KEY` -- your OpenAI-compatible API key
- `ZEP_API_KEY` -- your Zep Cloud API key

See the [Configuration Guide](configuration.md) for details on all available options.

### Step 3: Start MiroFish backend

```bash
docker compose up -d
```

This pulls the `ghcr.io/666ghj/MiroFish:latest` image and starts the backend service.

### Step 4: Verify backend is running

```bash
docker compose ps
```

You should see `mirofish-backend` with status **healthy**. You can also test directly:

```bash
curl http://localhost:5050/health
```

This should return an OK response. Note: the backend may take up to 30 seconds to become healthy on first start.

### Step 5: Install frontend dependencies

```bash
npm install
```

### Step 6: Start frontend dev server

```bash
npm run dev
```

### Step 7: Open the application

Navigate to [http://localhost:5173](http://localhost:5173) in your browser.

## Option 2: Source Deployment

For development without Docker. This path requires more manual setup.

### Backend

> **Note:** Docker is strongly recommended as the MiroFish backend has complex Python dependencies. Only use source deployment if you cannot run Docker.

1. **Python 3.10+** is required
2. Clone the MiroFish repository: `git clone https://github.com/666ghj/MiroFish.git`
3. Install Python dependencies per MiroFish documentation
4. Run the backend:

```bash
python backend/run.py
```

The backend will start on port `5001` by default.

### Frontend

Follow the same steps as the Docker path (Steps 5--7 above):

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Production Build

To create an optimized production build of the frontend:

```bash
npm run build
```

This compiles TypeScript and creates an optimized bundle in the `dist/` directory.

To preview the production build locally:

```bash
npm run preview
```

For deployment, serve the `dist/` directory with any static file server (Nginx, Caddy, Vercel, Netlify, etc.).

## Troubleshooting

### Port conflicts

If the default ports are already in use, change them in your `.env` file:

```env
BACKEND_PORT=8080    # Default: 5050
VITE_PORT=3000       # Default: 5173
```

### Backend not starting

Check the container logs for errors:

```bash
docker compose logs mirofish-backend
```

Common issues:
- Missing or invalid API keys in `.env`
- Port `5050` already in use (change `BACKEND_PORT`)
- Docker daemon not running

### Health check failing

The backend has a `start_period` of 30 seconds in the Docker Compose configuration. If the health check fails immediately after starting, wait 30 seconds and check again:

```bash
docker compose ps
```

If the container keeps restarting, check logs with `docker compose logs mirofish-backend`.

### Frontend not connecting to backend

Ensure the backend is running and healthy before starting the frontend. The Vite dev server proxies API requests to `http://localhost:${BACKEND_PORT}`.

---

Next: [Configuration Guide](configuration.md)
