#!/bin/sh

CERT_PATH="/etc/letsencrypt/live/$DOMAIN/fullchain.pem"

if [ -f "$CERT_PATH" ]; then
  echo "Certificate found for $DOMAIN. Starting Nginx with HTTPS configuration."
  envsubst "\$DOMAIN" < /etc/nginx/nginx.https.conf > /etc/nginx/nginx.conf
else
  echo "Certificate not found for $DOMAIN. Starting Nginx with HTTP-only configuration."
  envsubst "\$DOMAIN" < /etc/nginx/nginx.http.conf > /etc/nginx/nginx.conf
fi

exec nginx -g 'daemon off;'