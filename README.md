# AIQMX

All-in-one real estate platform (scaffold). This repo has a **FastAPI** backend and a **React + Vite** frontend.

Auth uses **Firebase Authentication**. Registration profile data (including account type) is stored in **Cloud Firestore**.

```
AIQMX/
  backend/    FastAPI + Firebase Admin + Firestore
  frontend/   React + TypeScript + Vite
```

## Prerequisites

- Python 3.12+
- Node.js 20+
- Firebase project with:
  - Email/Password sign-in enabled
  - **Google** sign-in enabled
  - Cloud Firestore enabled
  - Admin service account JSON
  - Web API Key

## Quick start

### 1. Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

Place the service account at:

`backend/secrets/firebase-service-account.json`

Edit `.env`:

```env
FIREBASE_PROJECT_ID=aiqmx-realtor
FIREBASE_WEB_API_KEY=your-web-api-key
FIREBASE_CREDENTIALS_PATH=secrets/firebase-service-account.json
```

Run:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- API: http://127.0.0.1:8000
- Docs: http://127.0.0.1:8000/docs

More detail: [backend/README.md](backend/README.md)

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

App: http://localhost:5173

More detail: [frontend/README.md](frontend/README.md)

## How auth works

1. User picks an account type on signup: **homeowner**, **tenant**, **professional**, or **agent**
2. They either submit email/password, or click **Continue with Google** / **Sign up with Google**
3. Google sign-in uses the Firebase web SDK (popup). The frontend then `POST`s the Google ID token to `/auth/google/login` or `/auth/google/signup`
4. Email/password still goes to `/auth/login` and `/auth/signup`
5. Backend verifies the Firebase ID token, sets Auth custom claims (`role`, `status`), and writes `users/{uid}` in Firestore
6. Frontend stores the Firebase ID token in `sessionStorage` and redirects to `/`

Google login requires an existing AIQMX profile. New Google users must complete a registration form (role + profile fields) first.

## Account types stored in Firestore

| `role` / `account_type` | Registration path        |
| ----------------------- | ------------------------ |
| `homeowner`             | `/register/homeowner`    |
| `tenant`                | `/register/tenant`       |
| `professional`          | `/register/professional` |
| `agent`                 | `/register/agent`        |

Example document shape:

```json
{
  "uid": "...",
  "email": "user@example.com",
  "role": "homeowner",
  "account_type": "homeowner",
  "status": "pending_approval",
  "display_name": "Jane Doe",
  "profile": { "phone": "555-0100" }
}
```

## Layout (enforced in CI)

Keep new work inside this tree. The structure check fails the PR if extra top-level folders, secrets, or generated artifacts are committed.

```
AIQMX/
  backend/     FastAPI app + pytest
  frontend/    React + Vite app + Vitest
  scripts/     CI helpers
  .github/     workflows and PR template
```

## Checks

GitHub Actions runs lint, unit tests, the production frontend build, and a repository-structure check on every push and pull request.

```bash
python3 scripts/check_repo_structure.py

# backend
cd backend
pip install -r requirements-dev.txt
ruff check .
ruff format --check .
pytest

# frontend
cd frontend
npm run lint
npm run format:check
npm test
npm run build
```

## Notes

- Service account JSON and `.env` are gitignored — do not commit secrets
- Listing/agent product pages are still placeholders
- AWS RDS session storage is not wired yet; Firestore holds registration reference data for now
