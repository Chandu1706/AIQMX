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
2. Email/password posts to `/auth/signup` or `/auth/login`
3. **Continue with Google** opens a Firebase Google popup, then posts the ID token to `/auth/google/login` or `/auth/google/signup`
4. Backend returns a Firebase ID token (+ role)
5. Token, email, uid, and role are stored in `sessionStorage`
6. Browser redirects to the home page (`/`)
7. Nav shows email + **Sign out** when signed in
8. Already-signed-in users hitting `/login` or `/signup` are redirected home

Google login only works after the user has registered (chosen a role and saved a profile). New Google users should use **Sign up with Google** on a registration page.

## Account types

| Role         | Path                     | Typical profile fields                                 |
| ------------ | ------------------------ | ------------------------------------------------------ |
| Homeowner    | `/register/homeowner`    | name, phone                                            |
| Tenant       | `/register/tenant`       | name, phone                                            |
| Professional | `/register/professional` | name, trade, company, license                          |
| Agent        | `/register/agent`        | name, side (buyer/seller), brokerage, license, markets |

The selected role is sent as `role` on signup and stored by the backend in Firebase claims and Firestore.

## Routes

| Path                                                                | Page                             |
| ------------------------------------------------------------------- | -------------------------------- |
| `/`                                                                 | Landing / home                   |
| `/login`                                                            | Sign in                          |
| `/signup`                                                           | Account-type picker              |
| `/register/homeowner`                                               | Homeowner registration           |
| `/register/tenant`                                                  | Tenant registration              |
| `/register/professional`                                            | Professional registration        |
| `/register/agent`                                                   | Agent registration               |
| `/listings`, `/agents`, `/products`, `/news`, `/about`, `/glossary` | Placeholders                     |
| `/app`                                                              | Signed-in status page (optional) |

## Scripts

```bash
npm run dev            # local development
npm run lint           # ESLint
npm run format         # Prettier write
npm run format:check   # Prettier check
npm test               # Vitest
npm run build          # typecheck + production build
npm run preview        # serve the production build
```

## Layout

```
frontend/
  src/
    App.tsx                 # Routes
    auth.ts                 # Session helpers + login/signup API
    pages/                  # Landing, login, register, home
    components/             # SiteNav, SiteFooter
  eslint.config.js
  vite.config.ts            # Dev server + API proxy + Vitest
  package.json
  README.md
```
