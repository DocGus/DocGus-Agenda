SHELL := /bin/bash

.PHONY: start seed test front build-backend build-front lint

start:
	@echo "Start backend (pipenv): pipenv run start"
	pipenv run start

seed:
	@echo "Seed development DB (tools/seed_dev.py)"
	pipenv run python tools/seed_dev.py

test:
	@echo "Run backend tests"
	pipenv run pytest -q

front:
	@echo "Start frontend dev server (src/front)"
	cd src/front && npm ci && npm run dev -- --host

build-front:
	@echo "Build frontend for production"
	cd src/front && npm ci && npm run build

lint:
	@echo "Run frontend lint"
	cd src/front && npm run lint
