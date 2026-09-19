Build a modern, production-structured but beginner-friendly **full-stack e-commerce web application** that I will use primarily as a learning project for **AWS deployment and DevOps**.

The application should be small and manageable, NOT an enterprise-scale project. The main goal is to understand how a complete web application works from frontend → backend → database → authentication → deployment → CI/CD.

## 1. Technology Stack

### Frontend

* Next.js (latest stable version)
* TypeScript
* React
* Tailwind CSS
* Next.js App Router
* Responsive modern UI
* Use clean reusable components

### Backend

* Node.js
* Express.js
* TypeScript
* REST API architecture
* JWT-based authentication
* bcrypt for password hashing
* dotenv for environment variables
* Proper error handling
* Request validation

### Database

* PostgreSQL
* Prisma ORM
* Database migrations using Prisma
* Seed data for development

### Authentication

Implement:

* User registration
* User login
* Logout
* JWT authentication
* Password hashing using bcrypt
* Protected backend routes
* Current-user/profile endpoint

Keep authentication simple and easy to understand.

## 2. Application Concept

Create a small modern e-commerce application called:

**ShopStack**

The application sells a small catalog of products such as:

* Electronics
* Accessories
* Clothing
* Books

Do not build a huge marketplace.

The application should demonstrate the complete flow:

User → Next.js Frontend → Node.js REST API → PostgreSQL

## 3. Core Features

### Public pages

Create:

1. Home page

   * Modern hero section
   * Featured products
   * Categories
   * Navigation bar
   * Footer

2. Products page

   * Product grid
   * Product image
   * Product name
   * Price
   * Category
   * Stock status
   * Search
   * Basic category filtering

3. Product details page

   * Product image
   * Name
   * Description
   * Price
   * Stock
   * Category
   * Add to cart button

### Authentication pages

Create:

* `/login`
* `/register`

After login:

* Store authentication securely
* Display logged-in user's name
* Provide logout functionality

### User account

Create:

* `/profile`

Display:

* Name
* Email
* Account creation date

### Shopping cart

Implement:

* Add product to cart
* Remove product
* Increase quantity
* Decrease quantity
* Cart total
* Empty cart

For this learning project, the cart can be stored in PostgreSQL for authenticated users.

### Checkout

Do NOT integrate a real payment gateway.

Instead create a simple demo checkout:

1. User opens cart
2. Clicks Checkout
3. Enters/selects shipping address
4. Reviews order
5. Places order
6. Order is stored in PostgreSQL
7. Cart is cleared
8. User sees order confirmation

### Orders

Create:

* `/orders`
* `/orders/[id]`

Users should be able to see:

* Order ID
* Order date
* Products
* Quantities
* Total amount
* Order status

Use simple order statuses:

* PENDING
* CONFIRMED
* SHIPPED
* DELIVERED
* CANCELLED

## 4. Database Design

Use PostgreSQL with Prisma.

Create approximately these models:

### User

* id
* name
* email
* passwordHash
* createdAt
* updatedAt

### Product

* id
* name
* slug
* description
* price
* imageUrl
* stock
* category
* createdAt
* updatedAt

### Cart

* id
* userId
* createdAt
* updatedAt

### CartItem

* id
* cartId
* productId
* quantity

### Order

* id
* userId
* totalAmount
* status
* shippingAddress
* createdAt
* updatedAt

### OrderItem

* id
* orderId
* productId
* quantity
* price

Use proper:

* Primary keys
* Foreign keys
* Unique constraints
* Indexes where useful
* Cascade behavior where appropriate

Explain the database relationships in the README.

## 5. Backend API

Create a clean REST API.

Example structure:

### Authentication

POST `/api/auth/register`

POST `/api/auth/login`

POST `/api/auth/logout`

GET `/api/auth/me`

### Products

GET `/api/products`

GET `/api/products/:id`

POST `/api/products`

PUT `/api/products/:id`

DELETE `/api/products/:id`

For product creation/update/delete, create simple protected/admin functionality.

### Cart

GET `/api/cart`

POST `/api/cart/items`

PUT `/api/cart/items/:id`

DELETE `/api/cart/items/:id`

DELETE `/api/cart`

### Orders

POST `/api/orders`

GET `/api/orders`

GET `/api/orders/:id`

The frontend must consume these APIs rather than directly accessing PostgreSQL.

IMPORTANT:

The architecture must remain:

Next.js → REST API → PostgreSQL

The frontend should NEVER directly connect to PostgreSQL.

## 6. Project Structure

Use a monorepo-style structure:

shopstack/

├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── services/
│   ├── types/
│   └── public/

├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── config/
│   │   └── server.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── package.json

├── README.md
├── .gitignore
└── docker-compose.yml

Keep frontend and backend clearly separated.

## 7. Environment Variables

Create `.env.example` files.

Frontend:

NEXT_PUBLIC_API_URL=

Backend:

DATABASE_URL=
JWT_SECRET=
PORT=
FRONTEND_URL=

Never commit real secrets.

Explain every environment variable in the README.

## 8. Local PostgreSQL Development

The application must work completely on my local Windows machine.

Provide two options:

Option 1:
Use PostgreSQL installed locally.

Option 2:
Use Docker Compose for PostgreSQL.

Create a `docker-compose.yml` containing PostgreSQL.

Example concept:

PostgreSQL container
↓
Backend
↓
Next.js frontend

Make it easy to start the database with Docker.

## 9. Prisma

Configure Prisma properly.

Provide commands for:

Install dependencies

Generate Prisma client

Create migration

Run migration

Seed database

Reset database

Start development server

Document all commands in README.

Create realistic seed data with approximately:

* 4 categories
* 15–20 products
* 2 demo users

Include one demo/admin account for testing.

Do not hard-code production credentials.

## 10. Frontend Design

Make the UI modern and clean.

Design style:

* Minimal
* Professional
* Modern SaaS/e-commerce style
* Responsive
* Good spacing
* Cards
* Navbar
* Product grid
* Shopping cart drawer/page
* Toast notifications
* Loading states
* Empty states
* Error states

Use Tailwind CSS.

Do not overcomplicate the UI with animations.

The purpose is to learn full-stack development and deployment.

## 11. Error Handling

Implement proper error handling.

Backend:

* Centralized error middleware
* HTTP status codes
* Consistent JSON responses

Example:

{
"success": false,
"message": "Product not found"
}

Frontend:

* API error handling
* Loading indicators
* Error messages
* Empty states

## 12. Security Basics

Implement basic security practices:

* Password hashing using bcrypt
* JWT authentication
* Protected routes
* Environment variables
* CORS configuration
* Input validation
* Do not expose password hashes
* Do not expose secrets
* Basic rate-limit protection if straightforward

Do not over-engineer security for this learning project.

## 13. Development Experience

The project should be beginner-friendly.

Whenever you create an important architectural decision, explain it in the README.

For example:

Why Next.js?

Why Node.js?

Why Express?

Why PostgreSQL?

Why Prisma?

Why REST API?

Why JWT?

Why Docker?

Why separate frontend and backend?

Explain the request flow:

Browser
↓
Next.js
↓
REST API
↓
Express
↓
Prisma
↓
PostgreSQL

Also explain:

Login flow

Product retrieval flow

Add-to-cart flow

Checkout flow

Order creation flow

## 14. Health Check

Create:

GET `/api/health`

Return something like:

{
"status": "ok",
"service": "shopstack-backend"
}

This will later be useful when deploying to AWS and testing whether the EC2 backend is running.

## 15. API Documentation

Create a simple API documentation section in README.

For every endpoint document:

* HTTP method
* URL
* Authentication required?
* Request body
* Response
* Example

Do not introduce Swagger unless it is very easy to configure.

## 16. Docker Preparation

Prepare the project so it can later be containerized.

Create:

* frontend/Dockerfile
* backend/Dockerfile
* docker-compose.yml

Initially, I may run the application without Docker.

But the architecture should make it easy to later run:

Frontend container
+
Backend container
+
PostgreSQL container

Do not force Docker into every development step.

## 17. Git/GitHub

Prepare the project for GitHub.

Create a good `.gitignore`.

Do NOT commit:

.env
node_modules
.next
dist
Prisma generated files if unnecessary
secrets
passwords
API keys

Create a README with:

Project overview

Architecture

Tech stack

Features

Folder structure

Database schema

Local setup

Environment variables

Database setup

Running frontend

Running backend

API documentation

Docker setup

Future AWS deployment plan

## 18. AWS Deployment Preparation

IMPORTANT:

Do NOT deploy to AWS yet.

First make the entire application work locally.

However, structure the project so that it can later be deployed to AWS.

The eventual architecture should be:

Internet
↓
AWS EC2
↓
Nginx
↓
Next.js frontend
↓
Node.js backend
↓
Amazon RDS PostgreSQL

Later we may add:

S3 → product images/files

CloudFront → CDN

Route 53 → domain

AWS IAM → permissions

CloudWatch → monitoring

GitHub → source control

Jenkins → CI/CD

Docker → application containers

## 19. Future CI/CD Plan

Do not implement Jenkins yet.

But prepare the repository for a future pipeline:

Developer
↓
Git push
↓
GitHub
↓
Jenkins
↓
Run tests
↓
Build frontend
↓
Build backend
↓
Build Docker images
↓
Deploy to AWS EC2
↓
Restart/update application
↓
Health check

We will implement this in a later phase.

## 20. Development Phases

Build this project in phases.

### Phase 1

Create project structure.

### Phase 2

Create PostgreSQL + Prisma database.

### Phase 3

Create backend REST APIs.

### Phase 4

Create authentication.

### Phase 5

Create frontend UI.

### Phase 6

Connect frontend to backend.

### Phase 7

Implement cart.

### Phase 8

Implement checkout/orders.

### Phase 9

Testing and error handling.

### Phase 10

Dockerize the application.

### Phase 11

Deploy to AWS EC2.

### Phase 12

Move PostgreSQL from local machine to Amazon RDS.

### Phase 13

Configure Nginx and domain.

### Phase 14

Configure GitHub + Jenkins CI/CD.

### Phase 15

Add AWS monitoring and logging.

## IMPORTANT DEVELOPMENT RULE

Do NOT generate the entire project blindly in one step.

Build it incrementally.

After each major phase:

1. Explain what was created.
2. Show the important files.
3. Explain why they exist.
4. Give the commands to run.
5. Tell me how to test it.
6. Fix any errors before moving to the next phase.

I am using this project specifically to learn:

* Full-stack architecture
* REST APIs
* PostgreSQL
* Authentication
* Prisma
* Docker
* Linux/server deployment
* AWS EC2
* AWS RDS
* Nginx
* Git/GitHub
* Jenkins
* CI/CD
* Environment variables
* Production deployment

Therefore, prioritize **clarity and understanding over complexity**.

Start with **Phase 1 only**.

Do not proceed to Phase 2 until Phase 1 is working.
