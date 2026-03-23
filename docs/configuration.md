# Configuration Guide

All configuration is managed through environment variables in the `.env` file and the in-app Settings panel.

## Environment Variables

Create your `.env` file by copying the example:

```bash
cp .env.example .env
```

### Required

| Variable | Description | Example |
|----------|-------------|---------|
| `LLM_API_KEY` | OpenAI-compatible API key | `sk-...` |
| `LLM_BASE_URL` | API endpoint URL | `https://dashscope.aliyuncs.com/compatible-mode/v1` |
| `LLM_MODEL_NAME` | Model to use for simulations | `qwen-plus` |
| `ZEP_API_KEY` | Zep Cloud API key for graph memory | `z_...` |

### Optional

| Variable | Description | Default |
|----------|-------------|---------|
| `LLM_BOOST_API_KEY` | Secondary LLM key for faster processing | *(empty)* |
| `LLM_BOOST_BASE_URL` | Secondary LLM endpoint | *(empty)* |
| `LLM_BOOST_MODEL_NAME` | Secondary model name | *(empty)* |
| `BACKEND_PORT` | Backend port mapping | `5050` |
| `VITE_PORT` | Frontend dev server port | `5173` |

## LLM Configuration

Miroslaw Ryba works with any **OpenAI-compatible API** provider.

### Supported Providers

| Provider | `LLM_BASE_URL` | Notes |
|----------|----------------|-------|
| **Alibaba DashScope** | `https://dashscope.aliyuncs.com/compatible-mode/v1` | Default, recommended |
| **OpenAI** | `https://api.openai.com/v1` | GPT-4 and newer |
| **Azure OpenAI** | `https://{resource}.openai.azure.com/openai/deployments/{model}` | Enterprise |
| **Ollama** (local) | `http://localhost:11434/v1` | Free, runs locally |

### Recommended Models

- **`qwen-plus`** (default) -- good balance of cost and quality for simulation tasks
- **`gpt-4`** -- higher quality output, higher cost
- **Custom models** -- enter any model name in the Settings panel

### Testing Your Connection

Use the **Test Connection** button in the Settings panel to verify your LLM configuration is working correctly. This sends a small test request and reports success or failure.

## Zep Cloud Configuration

Zep Cloud provides **graph memory** for agent personality and knowledge retention across simulation sessions.

### Setup

1. Create an account at [zep.ai](https://www.zep.ai)
2. Navigate to your dashboard and generate an API key
3. Add the key to your `.env` file:

```env
ZEP_API_KEY=z_your_api_key_here
```

### Testing

Use the **Test Connection** button in the Settings panel (Zep section) to verify your Zep Cloud configuration.

## Docker Management

The Settings panel provides Docker container management directly from the UI:

- **Status indicator** -- see if the MiroFish backend container is running, stopped, or unhealthy
- **Start / Stop / Restart** -- control the backend container without using the terminal
- **View logs** -- check container logs for debugging issues

You can also manage Docker from the command line:

```bash
docker compose up -d       # Start backend
docker compose stop        # Stop backend
docker compose restart     # Restart backend
docker compose logs -f     # Follow logs
```

## UI Configuration

All settings can also be configured through the **Settings panel** in the application:

- **LLM settings** -- API key, base URL, model name
- **Zep settings** -- API key
- **Boost LLM settings** -- secondary LLM configuration

### Persistence

Settings configured through the UI are stored in **localStorage** and persist across browser sessions. UI configuration takes precedence over `.env` values for LLM and Zep settings.

### Priority Order

1. Settings panel values (localStorage) -- highest priority
2. `.env` file values -- used as initial defaults
