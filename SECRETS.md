SECRETS.md

Short guidelines for handling secrets in this project

- Do NOT commit real secrets to the repository. Use `.env` locally and add `.env` to `.gitignore` (the repo already uses environment variables pattern).
- Development: use `.env.example` as a template and copy to `.env`. Example:
  cp .env.example .env
  # then edit JWT_SECRET_KEY and DATABASE_URL for your environment

- Production: use a secrets manager (AWS Secrets Manager, Azure Key Vault, HashiCorp Vault, GitHub Secrets for CI, Render/Heroku environment variables, etc.).

- JWT secret rotation: when you rotate `JWT_SECRET_KEY`, all existing tokens will be invalidated. Plan a rotation window accordingly.

- Database credentials: prefer managed databases and provide separate credentials for CI, staging and production. Store them in the platform's secret storage.

- Do not store secrets in logs or in UI/console output.

- For CI: configure environment variables in repository settings (GitHub Actions secrets). Avoid writing secrets into files checked into the repo.

