# Use official lightweight Nginx Alpine image
FROM nginx:alpine

# Maintainer information
LABEL maintainer="CodeWithBotinaOficial"
LABEL version="2.0.0"
LABEL description="Secure Nginx container for OnionForge"

# Install curl for health checks (already includes tzdata in alpine)
RUN apk update && apk upgrade --no-cache && \
    apk add --no-cache curl && \
    rm -rf /var/cache/apk/*

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom Nginx configuration
COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY docker/nginx/security-headers.conf /etc/nginx/conf.d/security-headers.conf

# Copy static website files with correct permissions
COPY src/ /usr/share/nginx/html/
RUN chmod -R 755 /usr/share/nginx/html

# Expose port 80 (HTTP)
EXPOSE 80

# Simple health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]