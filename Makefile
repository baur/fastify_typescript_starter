# Load .env file if it exists
ifneq (,$(wildcard ./.env))
	include .env
	export
endif

.PHONY: help
## help: Display this help message
help:
	@echo "Usage:"
	@echo "  make <target> [variables]"
	@echo ""
	@echo "Available targets:"
	@sed -n 's/^##//p' $(MAKEFILE_LIST) | column -t -s ':' | sed -e 's/^/ /'

.PHONY: check-env
## check-env: Ensure .env exists; if not, copy from .env.example
check-env:
	@test -f .env || cp .env.example .env

.PHONY: jwt
## jwt: Generate JWT keys and write them into .env as base64 values
jwt:
	@echo "Generating JWT keys..."
	mkdir -p cert && \
	cd cert && \
	openssl ecparam -genkey -name prime256v1 -noout -out jwt-pvt.pem && \
	openssl ec -in jwt-pvt.pem -pubout -out jwt-pub.pem
	@echo "Updating .env with base64-encoded JWT keys"
	@grep -v -e '^JWT_PRIVATE_KEY=' -e '^JWT_PUBLIC_KEY=' .env > .env.tmp && mv .env.tmp .env
	@echo "" >> .env
	@echo JWT_PRIVATE_KEY="`openssl base64 -A -in cert/jwt-pvt.pem`" >> .env
	@echo JWT_PUBLIC_KEY="`openssl base64 -A -in cert/jwt-pub.pem`" >> .env

.PHONY: up down fresh init dev enter enter-db log log-db
## up: Start Docker containers
up:
	docker compose up -d

## down: Stop Docker containers
down:
	docker compose down

## fresh: Rebuild and restart Docker containers
fresh:
	$(MAKE) check-env
	docker compose down --remove-orphans
	COMPOSE_BAKE=true docker compose build --no-cache
	docker compose up -d --build -V
	$(MAKE) log

## init: Initialize environment and start containers
init:
	$(MAKE) check-env
	mkdir -p cert
	$(MAKE) jwt
	yarn install
	npx lefthook install
	docker compose down --remove-orphans
	COMPOSE_BAKE=true docker compose build --no-cache
	docker compose up -d --build -V
	$(MAKE) log

## dev: Development mode
dev: down up log

## enter: Open a shell inside the API container
enter:
	docker compose exec app sh

## enter-db: Open a shell inside the database container
enter-db:
	docker compose exec database sh

## log: Follow logs for API container
log:
	docker compose logs -f app

## log-db: Follow logs for database container
log-db:
	docker compose logs -f database

kysely_codegen := npx kysely-codegen
dbmate := npx dbmate --url "$(PG_CONNECTION_STRING)?sslmode=disable" --migrations-dir src/database/migrations --no-dump-schema

.PHONY: db-migrate db-migrate-up db-migrate-down db-status db-types db-query db-shell db-drop
## db-migrate: Run all pending Dbmate database migrations
db-migrate:
	@echo "Running all pending migrations..."
	@$(dbmate) up
	@$(MAKE) db-types

## db-migrate-up: Run all pending migrations
db-migrate-up:
	@echo "Running pending migrations..."
	@$(dbmate) up
	@$(MAKE) db-types

## db-migrate-down: Rollback last migration
db-migrate-down:
	@echo "Rolling back last migration..."
	@$(dbmate) rollback
	@$(MAKE) db-types

## db-status: Show database migration status
db-status:
	@echo "Checking migration status..."
	@$(dbmate) status

## db-types: Generate TypeScript database types
db-types:
	@echo "Generating Kysely DB types..."
	DATABASE_URL="$(PG_CONNECTION_STRING)?sslmode=disable" $(kysely_codegen) --out-file src/database/db.d.ts
	yarn exec biome format --write src/database/db.d.ts

## db-query: Execute SQL query inside the database container
db-query:
	@if [ -z "$(SQL)" ]; then \
		echo "Error: 'SQL' variable must be set. Usage: make db-query SQL=\"SELECT * FROM auth_users\""; \
		exit 1; \
	fi
	@docker compose exec -T database sh -c 'PGPASSWORD="$(DB_PASSWORD)" psql -U "$(DB_USER)" -d "$(DB_NAME)" -h localhost -p 5432 -c "$(SQL)"'

## db-shell: Open interactive psql session in container
db-shell:
	@docker compose exec database sh -c 'PGPASSWORD="$(DB_PASSWORD)" psql -U "$(DB_USER)" -d "$(DB_NAME)" -h localhost -p 5432'

## db-drop: Drop and recreate the development database
db-drop:
	@docker compose exec -T database sh -c 'PGPASSWORD="$(DB_PASSWORD)" dropdb -U "$(DB_USER)" -h localhost -p 5432 --if-exists --force "$(DB_NAME)"'
	@docker compose exec -T database sh -c 'PGPASSWORD="$(DB_PASSWORD)" createdb -U "$(DB_USER)" -h localhost -p 5432 "$(DB_NAME)"'
