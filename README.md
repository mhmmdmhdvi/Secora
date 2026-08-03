# Secora

Secora is a bilingual, interactive web-security learning application with a
React frontend and a Django REST backend.

## Backend setup

The backend requires Python 3.14 and PostgreSQL. SQLite is not supported.

1. Create the PostgreSQL role and database named in your connection URL.
2. Create and activate one virtual environment at `backend/.venv`.
3. Run `python -m pip install -r backend/requirements.txt` from the repository root.
4. Copy `backend/.env.example` to `backend/.env` and replace the placeholder values.
5. Run `python backend/manage.py migrate`.
6. Run `python backend/manage.py runserver`.

`DATABASE_URL` must use a PostgreSQL URL, for example:

```text
postgresql://secora:password@127.0.0.1:5432/secora
```

Production must set `DJANGO_SETTINGS_MODULE=config.settings.production`, use a
new secret key, and provide explicit hosts and allowed origins.

## Frontend setup

From `frontend`, run `npm install`, set the API base URL, then start React:

```powershell
$env:REACT_APP_API_BASE_URL='http://127.0.0.1:8000'
npm start
```

Without `REACT_APP_API_BASE_URL`, frontend API calls are relative to the current
host. That is useful for same-origin production deployments.
