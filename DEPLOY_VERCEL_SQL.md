# Deploy on Vercel with MySQL

Your Vercel deployment cannot use MySQL Workbench on your laptop. Vercel needs a hosted MySQL database that is reachable from the internet.

## Required Vercel Environment Variables

Set these in the Vercel project settings:

```env
DATABASE_URL=mysql+pymysql://USER:PASSWORD@HOST:PORT/DATABASE_NAME
REQUIRE_SQL_DATABASE=true
MYSQL_SSL=true
MYSQL_SSL_CA=
SECRET_KEY=change-this-secret
JWT_SECRET_KEY=change-this-jwt-secret
GEMINI_API_KEYS=first_key,second_key
GEMINI_MODEL=gemini-2.5-flash
GEMINI_FALLBACK_MODELS=gemini-flash-latest,gemini-2.5-flash-lite,gemini-flash-lite-latest
GEMINI_TIMEOUT_SECONDS=180
GEMINI_VERIFY_SSL=true
FRONTEND_ORIGIN=https://ai-website-builder-g84h.vercel.app
```

If your MySQL provider gives you a CA certificate, paste the full certificate text into `MYSQL_SSL_CA` and keep `MYSQL_SSL=true`.

## After Updating Variables

Redeploy the Vercel project. On startup, the Flask backend creates these tables automatically:

- `users`
- `projects`
- `templates`
- `activity_logs`

## Important

Do not use `localhost` in `DATABASE_URL` on Vercel. `localhost` means Vercel's server, not your computer.
