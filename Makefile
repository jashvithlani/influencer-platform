.PHONY: dev dev-db dev-api migrate seed test clean

# Start everything
dev: dev-db dev-api

# Start just Postgres
dev-db:
	docker compose up -d db
	@echo "Waiting for Postgres..."
	@sleep 3
	@echo "Postgres ready on port 5432"

# Start API (assumes Postgres is running)
dev-api:
	cd backend && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Run Alembic migrations
migrate:
	cd backend && alembic upgrade head

# Seed the database
seed:
	cd backend && python -m app.seed

# Run backend tests
test:
	cd backend && python -m pytest tests/ -v

# Docker compose up (full stack)
up:
	docker compose up --build -d

# Docker compose down
down:
	docker compose down

# Clean everything
clean:
	docker compose down -v
	find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true

# Start mobile app
mobile:
	cd mobile && npx expo start

# Install all dependencies
install:
	cd backend && pip install -e ".[dev]"
	cd mobile && npm install
