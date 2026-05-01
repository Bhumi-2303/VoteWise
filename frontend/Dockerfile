FROM nginx:alpine

# Copy the nginx configuration template
COPY frontend/nginx.conf /etc/nginx/templates/default.conf.template

# Copy the frontend files to the nginx html directory
COPY frontend/ /usr/share/nginx/html/

# Expose the port Cloud Run will expect
EXPOSE 8080
