# Prodana RBAC Dashboard

Full-stack RBAC dashboard application built for a junior full-stack developer technical assessment. The project uses a monorepo layout with a Node.js/Express/MySQL backend and a React/Vite/Tailwind CSS frontend.

## Tech Stack

### Backend

- Node.js
- Express.js
- Prisma ORM
- MySQL
- JWT Authentication
- bcryptjs

### Frontend

- React.js with Vite
- React Router DOM
- Axios
- Tailwind CSS
- lucide-react

## Features

- JWT authentication with protected backend and frontend routes
- Role-based access control for Admin, Editor, and Viewer
- Dynamic sidebar navigation based on authenticated role
- AI-style database query assistant on the Dashboard
- Dashboard statistics and recent activity tables
- User management with role-aware create, update, delete, and read-only behavior
- Product management restricted to Admin users
- Reusable Button, Table, Modal, Input, Badge, Alert, EmptyState, and LoadingState components
- Consistent API response format
- Environment-based configuration
- Prisma schema, migration, and seed data
- Automated backend unit tests with Node.js test runner

## Role Matrix

| Role | Dashboard | Users | Products |
| --- | --- | --- | --- |
| Admin | Full access | CRUD | CRUD |
| Editor | Full access | CRUD | No access |
| Viewer | Full access | Read-only | No access |

## Project Structure

```text
prodana-rbac-dashboard/
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── seeders/
│   │   └── schema.prisma
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middlewares/
│       ├── routes/
│       ├── services/
│       └── utils/
└── frontend/
    └── src/
        ├── components/
        ├── contexts/
        ├── pages/
        ├── routes/
        ├── services/
        └── utils/
```

## Getting Started

### 1. Configure Backend Environment

```bash
cd backend
cp .env.example .env
```

Update `DATABASE_URL` with your MySQL credentials.

```env
DATABASE_URL="mysql://root:password@localhost:3306/rbac_dashboard"
PORT=5000
NODE_ENV=development
JWT_SECRET="replace-with-a-strong-secret-key"
JWT_EXPIRES_IN="1d"
CORS_ORIGIN="http://localhost:5173"
```

### 2. Configure Frontend Environment

```bash
cd frontend
cp .env.example .env
```

```env
VITE_API_BASE_URL="http://localhost:5000/api"
```

### 3. Install Dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 4. Run Database Migration and Seed

Create the MySQL database first:

```sql
CREATE DATABASE rbac_dashboard;
```

Then run:

```bash
cd backend
npm run prisma:migrate
npm run db:seed
```

### 5. Start Development Servers

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

Backend health check:

```text
http://localhost:5000/health
```

## Demo Accounts

| Role | Email | Password |
| --- | --- | --- |
| Admin | admin@prodana.test | AdminPass123 |
| Editor | editor@prodana.test | EditorPass123 |
| Viewer | viewer@prodana.test | ViewerPass123 |

## API Overview

All protected endpoints require:

```http
Authorization: Bearer <token>
```

### Auth

- `POST /api/auth/login`
- `GET /api/auth/me`

### Dashboard

- `GET /api/dashboard`

### AI Data Query

- `POST /api/ai/query`

### Users

- `GET /api/users`
- `GET /api/users/:id`
- `GET /api/users/roles`
- `POST /api/users`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`

### Products

- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

## Verification Commands

```bash
cd backend
npm run prisma:generate
npm test

cd ../frontend
npm run build
```

## Notes

- Backend authorization is enforced through JWT authentication and role middleware.
- Frontend role checks are used for user experience only; backend authorization remains the security boundary.
- Passwords are hashed with bcrypt before persistence.
- API errors use a consistent JSON response shape.
- The Dashboard query assistant supports assessment-style questions about role counts, recent users, system totals, and low-stock products.
