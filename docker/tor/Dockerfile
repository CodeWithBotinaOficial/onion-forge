# Use Alpine Linux for minimal size
FROM alpine:latest

# Install Tor
RUN apk update && apk upgrade --no-cache && \
    apk add --no-cache tor curl && \
    rm -rf /var/cache/apk/*

# Create directory for hidden service
RUN mkdir -p /var/lib/tor/hidden_service && \
    chmod -R 700 /var/lib/tor

# Copy Tor configuration
COPY docker/tor/torrc /etc/tor/torrc

# Set working directory
WORKDIR /var/lib/tor

# Expose SOCKS port
EXPOSE 9050

# Start Tor in foreground
CMD ["tor", "-f", "/etc/tor/torrc"]