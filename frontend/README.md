# AIQMX Frontend

React + TypeScript + Vite UI for AIQMX.

Auth goes through the FastAPI backend (Firebase under the hood). The Vite dev server proxies `/auth` and `/health` to `http://127.0.0.1:8000`.

## Requirements

- Node.js 20+
- Backend running and configured (see [../backend/README.md](../backend/README.md))

## Setup

```bash
npm install
```

## Run

Start the backend first, then:

```bash
npm run dev
```

App: http://localhost:5173

## Auth flow

1. User opens **Sign up** and picks an account type, or opens **Log in**
2. Form posts to `/auth/signup` or `/auth/login`
3. Backend returns a Firebase ID token (+ role)
4. Token, email, uid, and role are stored in `sessionStorage`
5. Browser redirects to the home page (`/`)
6. Nav shows email + **Sign out** when signed in
7. Already-signed-in users hitting `/login` or `/signup` are redirected home

## Account types

| Role | Path | Typical profile fields |
| --- | --- | --- |
| Homeowner | `/register/homeowner` | name, phone |
| Tenant | `/register/tenant` | name, phone |
| Professional | `/register/professional` | name, trade, company, license |
| Agent | `/register/agent` | name, side (buyer/seller), brokerage, license, markets |

The selected role is sent as `role` on signup and stored by the backend in Firebase claims and Firestore.

## Routes

| Path | Page |
| --- | --- |
| `/` | Landing / home |
| `/login` | Sign in |
| `/signup` | Account-type picker |
| `/register/homeowner` | Homeowner registration |
| `/register/tenant` | Tenant registration |
| `/register/professional` | Professional registration |
| `/register/agent` | Agent registration |
| `/listings`, `/agents`, `/products`, `/news`, `/about`, `/glossary` | Placeholders |
| `/app` | Signed-in status page (optional) |

## Scripts

```bash
npm run dev       # local development
npm run build     # typecheck + production build
npm run preview   # serve the production build
```

## Layout

```
frontend/
  src/
    App.tsx                 # Routes
    auth.ts                 # Session helpers + login/signup API
    pages/                  # Landing, login, register, home
    components/             # SiteNav, SiteFooter
  vite.config.ts            # Dev server + API proxy
  package.json
  README.md
```
