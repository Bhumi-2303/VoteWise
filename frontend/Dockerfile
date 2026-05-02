FROM nginx:alpine

# Use a non-root user for security (if possible with nginx image)
# However, for simplicity in hackathon, we keep nginx defaults but optimize config

# Copy custom nginx config
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Copy frontend assets
COPY frontend/ /usr/share/nginx/html/

# Cloud Run uses 8080 by default
EXPOSE 8080

# Overwrite default nginx command to listen on 8080
CMD ["nginx", "-g", "daemon off;"]
