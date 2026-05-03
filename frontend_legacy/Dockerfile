# Use Nginx alpine for a small footprint
FROM nginx:alpine

# Copy custom nginx configuration that listens on 8080
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Copy static frontend files to the default nginx serving directory
COPY frontend/ /usr/share/nginx/html/

# Expose PORT 8080 as required by Cloud Run
EXPOSE 8080

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
