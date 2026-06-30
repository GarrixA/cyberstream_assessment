#!/bin/bash
set -e

# shellcheck source=/usr/local/bin/db-url.sh
source /usr/local/bin/db-url.sh

if [ -n "$DB_DEV_URL" ] && parse_postgres_url "$DB_DEV_URL"; then
	export POSTGRES_USER="$PARSED_USER"
	export POSTGRES_PASSWORD="$PARSED_PASS"
	export POSTGRES_DB="$PARSED_DB"
fi

exec /usr/local/bin/docker-entrypoint.sh "$@"
