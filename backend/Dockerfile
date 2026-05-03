# --- Build Stage ---
FROM python:3.10-slim as builder

WORKDIR /app

# Prevent Python from writing .pyc files and enable unbuffered logging
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install build dependencies if needed (e.g., for certain python packages)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# --- Final Stage ---
FROM python:3.10-slim

WORKDIR /app

# Create a non-root user for security
RUN groupadd -r votewise && useradd -r -g votewise votewise
USER votewise

# Copy installed dependencies from builder
COPY --from=builder /root/.local /home/votewise/.local
ENV PATH=/home/votewise/.local/bin:$PATH

# Copy the entire project structure to preserve package hierarchy
# This ensures "import backend.xxx" works correctly
COPY --chown=votewise:votewise . /app/

# Cloud Run environment variables
ENV PORT=8080
EXPOSE 8080

# Use uvicorn to serve the FastAPI application
# module path: backend.main:app
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8080"]