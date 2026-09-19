# AIQMX Backend

FastAPI API for AIQMX with **Firebase Authentication** and **Cloud Firestore**.

## What it does

- Email/password **login** and **signup** via Firebase Identity Toolkit
- Verifies Firebase ID tokens with the Admin SDK (service account)
- Sets Auth custom claims: `role`, `status`
- Saves registration / reference data to Firestore at `users/{uid}`
- Returns the signed-in profile from Firestore on `GET /auth/me`

## Requirements

- Python 3.12+
- Firebase project with:
  - **Email/Password** sign-in enabled
  - **Cloud Firestore** enabled
- Service account JSON at `secrets/firebase-service-account.json`
- Web API Key in `.env` (`FIREBASE_WEB_API_KEY`)

## Setup

```bash
python3 -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

1. Copy your Firebase Admin service account JSON to:

   `secrets/firebase-service-account.json`

2. Firebase Console → Project settings → General → copy **Web API Key**

3. Fill `.env`:

```env
APP_NAME=AIQMX
API_HOST=0.0.0.0
API_PORT=8000
FIREBASE_PROJECT_ID=aiqmx-realtor
FIREBASE_WEB_API_KEY=your-web-api-key
FIREBASE_CREDENTIALS_PATH=secrets/firebase-service-account.json
```

4. Firebase Console → Authentication → Sign-in method → enable **Email/Password**

5. Firebase Console → Firestore → create a database if you have not already

## Run

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

| URL | Purpose |
| --- | --- |
| http://127.0.0.1:8000 | API |
| http://127.0.0.1:8000/docs | OpenAPI docs |
| http://127.0.0.1:8000/health | Health check |

## Auth endpoints

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/auth/signup` | Create Firebase user, set claims, write Firestore profile |
| `POST` | `/auth/login` | Email/password → Firebase ID token |
| `POST` | `/auth/session` | Verify an existing Firebase ID token |
| `GET` | `/auth/me` | Current user + Firestore profile (`Authorization: Bearer <token>`) |
| `POST` | `/auth/logout` | Client logout helper |

### Signup body

```json
{
  "email": "user@example.com",
  "password": "secret12",
  "role": "homeowner",
  "display_name": "Jane Doe",
  "profile": { "phone": "555-0100" }
}
```

Allowed `role` values: `homeowner`, `tenant`, `professional`, `agent`.

### Firestore document (`users/{uid}`)

| Field | Meaning |
| --- | --- |
| `email` | Account email |
| `role` | Selected account type |
| `account_type` | Same as `role` (explicit copy for queries) |
| `status` | Starts as `pending_approval` |
| `display_name` | Full name from the form |
| `profile` | Role-specific fields (phone, trade, license, brokerage, etc.) |
| `created_at` / `updated_at` | Server timestamps |

## Dependencies

See `requirements.txt` (FastAPI, Uvicorn, firebase-admin, httpx, pydantic-settings).

## Layout

```
backend/
  app/
    main.py
    config.py
    firebase_app.py             # Admin SDK + Firestore client
    deps.py                     # Bearer token dependency
    services/firebase_auth.py   # Identity Toolkit login/signup
    services/firestore_users.py # users/{uid} reads/writes
    routers/auth.py
    schemas/auth.py
  secrets/firebase-service-account.json   # gitignored
  requirements.txt
  .env.example
  README.md
```
