#!/bin/sh
set -e

if [ -n "$CADDY_DOMAIN" ]; then
  sed -i "s|__CADDY_DOMAIN__|$CADDY_DOMAIN|g" ./standalone/server.js
fi

exec "$@"
