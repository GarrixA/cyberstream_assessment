#!/bin/bash

# Rewrite localhost to the compose service name for in-container networking.
dockerize_db_urls() {
	export DB_DEV_URL="${DB_DEV_URL//localhost/postgresdb}"
	export DB_TEST_URL="${DB_TEST_URL//localhost/postgresdb}"
}

# Parse postgres://user:pass@host:port/dbname into PARSED_USER, PARSED_PASS, PARSED_DB.
parse_postgres_url() {
	local url="$1"

	if [[ $url =~ ^postgres://([^:]+):([^@]+)@[^/]+/([^?]+) ]]; then
		PARSED_USER="${BASH_REMATCH[1]}"
		PARSED_PASS="${BASH_REMATCH[2]}"
		PARSED_DB="${BASH_REMATCH[3]}"
		return 0
	fi

	return 1
}
