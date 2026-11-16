# PetPal

A social platform for pet owners: add your pets, find friends nearby, chat in real time and organise play dates.

> Status: working web app (PWA). Mobile apps are out of scope; the web app is responsive and installable on phones.

## Features

- **Accounts:** register and log in with JWT authentication
- **Profiles and pets:** edit your profile and manage your pets (add, edit, delete)
- **Friends:** search users, send, accept and reject friend requests
- **Real-time chat:** private messaging with typing indicators (Socket.io)
- **Pet matching:** request play dates with nearby pets
- **Location:** geocoding with OpenCage and distance-based search
- **UI:** dark mode, loading skeletons, toast notifications, responsive layout, installable PWA

## Tech stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Vite, React Router, Axios, Socket.io client |
| Backend | Node.js, Express, Socket.io, JWT, bcrypt |
| Database | PostgreSQL |
| Deployment | Render (API and database), Netlify (web app) |

## Project structure

## Getting started

### Prerequisites

- Node.js 18 or newer
- PostgreSQL 14 or newer

### 1. Clone

```bash
git clone https://github.com/Dansonjr/PetPal.git
cd PetPal
```

### 2. Database

```bash
createdb petpal
psql petpal -f backend/config/schema.sql
```

### 3. Backend

```bash
cd backend
cp .env.example .env     # then edit the values
npm install
npm run dev              # http://localhost:5000
```

### 4. Frontend

```bash
cd webapp
cp .env.example .env
npm install
npm run dev              # http://localhost:5173
```

## Environment variables

**backend/.env**

| Variable | Description |
|----------|-------------|
| `DB_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Long random string used to sign tokens |
| `PORT` | API port (default 5000) |
| `OPENCAGE_API_KEY` | API key for address geocoding |

**webapp/.env**

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | API base URL, e.g. `http://localhost:5000/api` |
| `VITE_SOCKET_URL` | Socket.io server URL, e.g. `http://localhost:5000` |

## API

The REST API is described in [`docs/api/openapi.yaml`](docs/api/openapi.yaml). Main route groups: `/api/auth`, `/api/users`, `/api/pets`, `/api/friends`, `/api/pet-matches`, `/api/messages`, `/api/location`.

## Roadmap

- [ ] Automated tests (Jest and Supertest) and GitHub Actions CI
- [ ] Rate limiting, `helmet` and input validation
- [ ] Friendship check before delivering chat messages
- [ ] Hide other users' email and exact coordinates in nearby results
- [ ] Screenshots and a live demo link

## Author

Rabindra Khadka: [LinkedIn](https://linkedin.com/in/rabindra01) · [GitHub](https://github.com/Dansonjr)
