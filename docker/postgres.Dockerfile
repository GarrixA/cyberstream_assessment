FROM postgres:16

RUN apt-get update && apt-get install -y dos2unix

COPY docker/db-url.sh /usr/local/bin/db-url.sh
COPY docker/postgres-entrypoint.sh /usr/local/bin/cyberstream-postgres-entrypoint.sh

RUN dos2unix /usr/local/bin/db-url.sh /usr/local/bin/cyberstream-postgres-entrypoint.sh \
	&& chmod +x /usr/local/bin/db-url.sh /usr/local/bin/cyberstream-postgres-entrypoint.sh

ENTRYPOINT ["cyberstream-postgres-entrypoint.sh"]
CMD ["postgres"]
