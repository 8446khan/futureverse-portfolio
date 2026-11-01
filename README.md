# FUTUREVERSE — Full-Stack Portfolio (SQLite Edition)

A futuristic React portfolio with a Flask REST API, SQLite database, secure admin login, CRUD management, contact inbox, analytics, GitHub repository feed, interactive terminal, theme toggle and a lightweight portfolio assistant.

## Stack
- Frontend: React + Vite, Tailwind CSS v4, Framer Motion, Three.js / React Three Fiber, Recharts, Lucide
- Backend: Python + Flask, Flask-JWT-Extended, Flask-CORS
- Database: SQLite (built into Python; no separate database server required)

## Requirements
- Node.js 20+
- Python 3.10+
- No database server required. SQLite creates `backend/portfolio.db` automatically.

## 1. Configure backend
```bash
cd backend
python -m venv .venv
# Windows:
.venv\\Scripts\\activate
# macOS/Linux:
source .venv/bin/activate
pip install -r requirements.txt
```
Copy `.env.example` to `.env`, then set `DATABASE_PATH` (optional), `JWT_SECRET_KEY`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `FRONTEND_ORIGIN`. The default database path is `backend/portfolio.db`.

Create the first admin user and seed sample portfolio content:
```bash
python seed_admin.py
```
Start the API:
```bash
python run.py
```
API runs at http://localhost:5000. Health check: http://localhost:5000/api/health

## 2. Configure frontend
In another terminal:
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
Open http://localhost:5173. The admin page is at `/admin`.

## Database details
SQLite stores the portfolio data in a local file. The app creates its tables automatically on startup. Back up `backend/portfolio.db` regularly. To use a different location, set `DATABASE_PATH` in `backend/.env`. Keep the database file out of public web roots and do not commit it if it contains real contact messages or account information.

## Main functionality
### Public
- Responsive animated portfolio and 3D hero object
- About, skills, projects, experience, certifications, contact
- Project category filters and detail modal
- Contact form saved in SQLite
- Resume download tracking (put your file at `frontend/public/resume.pdf`)
- Anonymous page-view analytics (no IP address is stored)
- GitHub public repository feed (optional `GITHUB_USERNAME`)
- Interactive terminal (`help`, `about`, `skills`, `projects`, `contact`)
- Portfolio Q&A assistant with local answers from published profile data
- Dark/light mode

### Admin
- JWT-protected admin login
- Dashboard metrics and recent messages
- Create, update and delete projects, skills, experience and certifications
- View and mark contact messages as read; delete messages
- Analytics summary

## API overview
- `GET /api/health`
- `GET /api/profile`
- `GET /api/projects`, `GET /api/projects/<id>`
- `GET /api/skills`, `GET /api/experience`, `GET /api/certifications`
- `POST /api/contact`
- `POST /api/analytics/view`, `POST /api/analytics/resume`
- `GET /api/github`
- `POST /api/assistant`
- `POST /api/auth/login`, `GET /api/auth/me`
- Admin CRUD: `/api/admin/projects`, `/api/admin/skills`, `/api/admin/experience`, `/api/admin/certifications`
- Admin messages: `/api/admin/messages`, `/api/admin/messages/<id>`
- `GET /api/admin/analytics`

## Deployment
- Frontend: Vercel (set `VITE_API_URL` to your deployed API URL)
- Backend: Render (set all variables from `.env.example`; use `gunicorn run:app`)
- Database: SQLite requires persistent disk storage on hosting platforms. Configure a persistent disk and set `DATABASE_PATH` to a path on that disk; otherwise a redeploy may erase database data.
- Set `FRONTEND_ORIGIN` to your deployed frontend origin.
- Never commit `.env`, the SQLite database, credentials, JWT secrets, or real admin passwords.

## Production notes
This is a complete starter implementation. Before public launch, configure HTTPS, a strong unique secret, regular SQLite backups, a real domain, rate limiting/WAF, email delivery (optional), and a production-grade privacy notice. SQLite is ideal for a personal portfolio and modest write traffic; PostgreSQL is a good upgrade if concurrent write volume grows. The assistant is a local FAQ helper, not an external LLM integration. The GitHub feed uses the public GitHub API and works best when `GITHUB_USERNAME` is configured.
