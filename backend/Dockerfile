# Use Python 3.10 slim image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=8080

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ /app/

# Expose port
EXPOSE 8080

# Start the application using uvicorn as requested
# Note: Since main.py is in the root of /app (copied from backend/), we use main:app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
