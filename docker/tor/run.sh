#!/bin/sh

# Tor service startup script for runit

set -e

echo "Starting Tor hidden service for OnionForge..."

# Ensure directories exist with correct permissions
if [ ! -d "/var/lib/tor/hidden_service" ]; then
    echo "Creating hidden_service directory..."
    mkdir -p /var/lib/tor/hidden_service
    chmod 700 /var/lib/tor/hidden_service
fi

# Set proper ownership
chown -R toruser:torgroup /var/lib/tor

# Start Tor with the configuration file
exec tor -f /etc/tor/torrc