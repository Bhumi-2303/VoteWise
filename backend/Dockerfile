# --- Build Stage ---
FROM python:3.10-slim as builder

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt gunicorn

# --- Final Stage ---
FROM python:3.10-slim

WORKDIR /app

# Create a non-root user for security
RUN groupadd -r votewise && useradd -r -g votewise votewise
USER votewise

# Copy installed dependencies from builder
COPY --from=builder /root/.local /home/votewise/.local
ENV PATH=/home/votewise/.local/bin:$PATH

# Copy backend code
COPY --chown=votewise:votewise backend/ /app/backend/

ENV PORT=8080
EXPOSE ${PORT}

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:${PORT}/health || exit 1

# Production server configuration
# Using gunicorn with uvicorn workers for process management
CMD exec gunicorn backend.main:app \
    --bind 0.0.0.0:${PORT} \
    --workers 4 \
    --worker-class uvicorn.workers.UvicornWorker \
    --timeout 0 \
    --access-logfile - \
    --error-logfile -
