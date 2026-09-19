# ShopStack

A modern, production-structured full-stack e-commerce web application. Built as a learning project for AWS deployment and DevOps, featuring a "violently simple" Nike-inspired design system.

## Architecture

- **Frontend**: Next.js (App Router), React, Tailwind CSS, TypeScript
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Infrastructure**: Local Docker Compose (PostgreSQL), future deployment to AWS EC2

## Project Structure

```
shopstack/
├── frontend/           # Next.js frontend application
├── backend/            # Node.js Express backend API
├── docker-compose.yml  # Local PostgreSQL database
└── README.md
```

## Quick Start (Local Development)

### 1. Database Setup
Ensure you have Docker installed and running.
```bash
docker-compose up -d
```

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

*(More detailed instructions will be added as the project evolves through development phases.)*
