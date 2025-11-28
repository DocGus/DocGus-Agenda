# CHANGELOG

## [estable_4] - 2025-11-28
### Added
- JSON error handler for API endpoints to avoid frontend parsing HTML errors.
- `docker-compose.override.yml` with Postgres and Redis example for local development.
- GitHub Actions CI workflow running Python tests, `pip-audit`, `npm audit`, and frontend build.
- Rate limiting (per-endpoint in-memory limiter for dev) and `Flask-Limiter` integration.
- `.env.example` updated with `CORS_ORIGINS`, `VITE_BACKEND_URL`, `RATELIMIT_DEFAULT`, and `RATELIMIT_STORAGE_URL`.
- Vite upgraded to `^7.2.4` and frontend rebuilt.

### Changed
- Basic input validation added for `/api/register` and `/api/login`.
- Enforce `JWT_SECRET_KEY` in non-development environments.

### Fixed
- Applied Alembic stamp to align migrations with DB state.

