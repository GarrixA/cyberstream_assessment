#!/bin/bash
set -e

if [ -f /app/.env ]; then
	set -a
	# shellcheck source=/dev/null
	source /app/.env
	set +a
fi

run_local_migrations() {
	wait_for_postgres() {
		echo "Waiting for PostgreSQL to be ready..."
		while ! nc -z postgresdb 5432; do
			sleep 1
		done
		echo "PostgreSQL is ready."
	}

	wait_for_postgres

	# shellcheck source=docker/db-url.sh
	source /app/docker/db-url.sh
	dockerize_db_urls

	create_database_if_missing() {
		local url="$1"

		parse_postgres_url "$url" || return 0

		PGPASSWORD="$PARSED_PASS" psql -v ON_ERROR_STOP=0 --username "$PARSED_USER" --host postgresdb -tc \
			"SELECT 1 FROM pg_database WHERE datname = '$PARSED_DB'" | grep -q 1 && return 0

		PGPASSWORD="$PARSED_PASS" psql -v ON_ERROR_STOP=1 --username "$PARSED_USER" --host postgresdb <<-EOSQL
			CREATE DATABASE "$PARSED_DB" WITH OWNER "$PARSED_USER" TEMPLATE template0;
EOSQL
	}

	echo "Ensuring databases exist..."
	create_database_if_missing "$DB_DEV_URL" || echo "Dev database already exists or creation failed."
	create_database_if_missing "$DB_TEST_URL" || echo "Test database already exists or creation failed."

	npm run migrate:reset
}

run_production_migrations() {
	if [ -z "$DB_PROD_URL" ]; then
		echo "DB_PROD_URL is not set; skipping production migrations."
		return 0
	fi

	echo "Running production migrations against DB_PROD_URL..."
	NODE_ENV=production npm run migrate
}

if [ "${DB_HOSTED_MODE:-local}" = "local" ]; then
	run_local_migrations
else
	run_production_migrations
fi

exec "$@"
