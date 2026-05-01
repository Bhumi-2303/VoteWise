# Use official Python runtime as a parent image
FROM python:3.10-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=8080

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container
# Since the build context will be the project root, we can copy requirements.txt from root
COPY requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt gunicorn

# Copy the backend directory contents into the container at /app/backend
COPY backend/ /app/backend/

# Expose the port
EXPOSE ${PORT}

# Run the application using Uvicorn via Gunicorn for production
CMD exec gunicorn backend.main:app -k uvicorn.workers.UvicornWorker -w 4 -b 0.0.0.0:${PORT}
