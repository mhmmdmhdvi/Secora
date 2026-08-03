# Secora

Secora is a bilingual, interactive web-security learning platform built to make real hacking techniques easier to understand.

The idea is simple: instead of only reading about vulnerabilities, users watch attacks unfold step by step, read a practical defense guide, and then test themselves with a short quiz. The project started as a passion project to help people see how hacking works in a safe, visual, and beginner-friendly way.

## What Secora teaches

Secora focuses on practical secure-coding lessons, including:

- SQL Injection
- Cross-site Script Inclusion
- Cross-Site Scripting
- Reflected XSS
- DOM-based XSS
- XML External Entities

More lessons are planned. The catalog, paths, achievements, XP, bookmarks, guides, quizzes, and translations are designed so the project can grow without turning into one giant hardcoded frontend file.

## Main features

- Interactive step-by-step attack simulations
- Database-backed lesson, guide, quiz, translation, revision, and block content
- Persian and English language support
- Light and dark themes
- User accounts with JWT authentication
- Lesson bookmarks
- Learning paths
- XP, levels, achievements, and reward popups
- Responsive UI for desktop and mobile
- Django admin support for lesson authoring

## Tech stack

### Backend

- Python
- Django
- Django REST Framework
- PostgreSQL
- Simple JWT
- django-environ
- django-cors-headers

### Frontend

- React
- React Router
- i18next / react-i18next
- Tailwind CSS
- Heroicons

## Project structure

```text
Secora/
  backend/
    accounts/
    config/
    learning/
    lessons/
    manage.py
    requirements.txt

  frontend/
    public/
    src/
    package.json
```

## Backend setup

The backend is built for PostgreSQL. SQLite is not used for this project.

From the repository root:

```powershell
cd C:\Users\Raya-Bit\Desktop\SecureLearn
```

Create or activate the backend virtual environment:

```powershell
backend\.venv\Scripts\Activate.ps1
```

Install dependencies:

```powershell
python -m pip install -r backend\requirements.txt
```

Create `backend\.env` and set your local development values:

```env
DJANGO_SECRET_KEY=change-this-dev-key
DJANGO_DEBUG=true
ALLOWED_HOSTS=127.0.0.1,localhost
CORS_ALLOWED_ORIGINS=http://127.0.0.1:3000,http://localhost:3000
DATABASE_URL=postgresql://securelearn:securelearn_dev_password@127.0.0.1:5432/securelearn
DB_CONN_MAX_AGE=60
LESSON_PUBLISHED_CACHE_SECONDS=900
LESSON_REQUIRED_LOCALES=fa,en
```

If you create a fresh database for the rebrand, you can use a `secora` role/database instead. Just make sure `DATABASE_URL` matches the PostgreSQL role and database you actually created.

Run migrations:

```powershell
backend\.venv\Scripts\python.exe backend\manage.py migrate
```

Seed the current finished lessons:

```powershell
backend\.venv\Scripts\python.exe backend\manage.py seed_sql_injection_lesson --publish
backend\.venv\Scripts\python.exe backend\manage.py seed_xssi_lesson --publish
backend\.venv\Scripts\python.exe backend\manage.py seed_xss_lesson --publish
backend\.venv\Scripts\python.exe backend\manage.py seed_reflected_xss_lesson --publish
backend\.venv\Scripts\python.exe backend\manage.py seed_dom_based_xss_lesson --publish
backend\.venv\Scripts\python.exe backend\manage.py seed_xml_external_entities_lesson --publish
```

Start Django:

```powershell
backend\.venv\Scripts\python.exe backend\manage.py runserver 127.0.0.1:8000
```

## Frontend setup

Open a second terminal:

```powershell
cd C:\Users\Raya-Bit\Desktop\SecureLearn\frontend
npm install
```

For local development, set the backend API URL:

```powershell
$env:REACT_APP_API_BASE_URL='http://127.0.0.1:8000'
npm start
```

Then open:

```text
http://localhost:3000
```

## Useful commands

Run backend tests:

```powershell
backend\.venv\Scripts\python.exe backend\manage.py test
```

Build the frontend:

```powershell
cd frontend
npm run build
```

Create a Django admin user:

```powershell
backend\.venv\Scripts\python.exe backend\manage.py createsuperuser
```

Then visit:

```text
http://127.0.0.1:8000/admin/
```

## About the creator

Secora began as a personal passion project by Mohammad Mahdavi. The goal is to show people how hacking techniques work in a clear, safe, and practical way, then help them turn that understanding into better defensive habits.

Contact:

- Instagram: [@mhmmd_mhdvii](https://instagram.com/mhmmd_mhdvii)
- LinkedIn: [mohammad-mahdavi-devops](https://www.linkedin.com/in/mohammad-mahdavi-devops)
- Phone: `09392360398`

## Production notes

Before deploying:

- Use a strong `DJANGO_SECRET_KEY`
- Set `DJANGO_DEBUG=false`
- Configure real `ALLOWED_HOSTS`
- Configure real `CORS_ALLOWED_ORIGINS`
- Use PostgreSQL
- Do not commit `.env`, database dumps, secrets, or private keys
- Build the React frontend with `npm run build`

Secora is still growing. Feedback, corrections, and lesson ideas are welcome.
