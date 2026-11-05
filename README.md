# FoodBridge – Online Food Donation and Surplus Redistribution Platform

FoodBridge is a full-stack web application that connects food donors, NGOs, and volunteers to reduce food waste and redistribute surplus food to people in need.

The platform provides role-based dashboards, donation management, NGO approval, volunteer assignment, pickup and delivery tracking, notifications, and administrative reports.

## Table of Contents

- [Project Objectives](#project-objectives)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [User Roles](#user-roles)
- [Donation Workflow](#donation-workflow)
- [Project Structure](#project-structure)
- [Database Models](#database-models)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Docker Deployment](#docker-deployment)
- [Kubernetes Deployment](#kubernetes-deployment)
- [Demonstration Workflow](#demonstration-workflow)
- [Security](#security)
- [Future Enhancements](#future-enhancements)

## Project Objectives

- Reduce food wastage by connecting food donors with organizations that can redistribute surplus food.
- Provide a centralized platform for managing food donations.
- Enable NGOs to discover and accept available donations.
- Coordinate volunteers for food pickup and delivery.
- Track donation and redistribution status.
- Provide administrators with reports and platform management tools.

## Features

### Public and Authentication
- Public home page.
- User registration and login.
- Role-based access to application features.
- Protected frontend routes.

### Food Donor
- Donor dashboard.
- Create food donations.
- View personal donation history.
- Track donation status.

### NGO
- NGO registration and profile management.
- View available food donations.
- Accept donations.
- Assign available volunteers.
- Schedule pickups and manage pickup activities.

### Volunteer
- Volunteer profile registration.
- View assigned pickups.
- Update pickup and delivery status.
- Submit delivery notes.

### Administrator
- Administrative dashboard and statistics.
- View registered users.
- Approve or reject NGO registrations.
- Verify volunteers.
- Manage platform users.
- Access administrative reports.

### Reports
The reports dashboard provides:
1. Donation Listings
2. Pickup Status
3. Food Quantity Redistributed
4. Donor Activity

Reports support CSV export and printing.

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React 19, Vite |
| Routing | React Router |
| UI and charts | Lucide React, Recharts |
| Forms and validation | React Hook Form, Zod |
| HTTP client | Axios |
| Backend | Node.js, Express 5 |
| Database | MongoDB 8, Mongoose |
| Authentication | JSON Web Tokens (JWT), bcryptjs |
| Security | Helmet, CORS, Express Rate Limit |
| Containerization | Docker, Docker Compose |
| Orchestration | Kubernetes, Minikube |
| Web server | Nginx |
| Version control | Git and GitHub |

## System Architecture

The FoodBridge application uses a React and Vite frontend served through Nginx. Nginx forwards API requests to the Express backend, which uses JWT authentication and Mongoose to access MongoDB.

## User Roles

| Role | Responsibilities |
|---|---|
| Admin | Manage users, approve NGOs, verify volunteers, and view reports |
| Donor | Create food donations and track donation status |
| NGO | Browse and accept donations, assign volunteers |
| Volunteer | View assigned pickups and update delivery status |

## Donation Workflow

1. `AVAILABLE` – Donation is created by a donor.
2. `ACCEPTED` – An NGO accepts the donation.
3. `PICKUP_ASSIGNED` – An NGO assigns a volunteer.
4. `PICKED_UP` – The volunteer collects the food.
5. `DELIVERED` – The volunteer completes delivery and submits notes.


## Project Structure

- `backend/` – Express server, API routes, controllers, models, and middleware.
- `frontend/` – React application, pages, components, and API services.
- `k8s/` – Kubernetes manifests for MongoDB, backend, and frontend.
- `docker-compose.yml` – Docker Compose configuration.
- `README.md` – Project documentation.

## Database Models

The application uses MongoDB with Mongoose schemas:

- **User:** Account details, roles, and authentication information.
- **Donation:** Food details, quantity, expiry, pickup deadline, and status.
- **NGO:** Organization profile and approval status.
- **Volunteer:** Volunteer profile and verification status.
- **Pickup:** Volunteer assignment, pickup schedule, and delivery information.
- **Notification:** User notifications and read status.


## Getting Started

### Prerequisites

- Node.js and npm
- MongoDB 8
- Git
- Docker Desktop
- kubectl
- Minikube

### Clone the Repository

Clone the project from GitHub:

`git clone https://github.com/Hemavathi0611/FoodBridge.git`

Then open the `FoodBridge` directory.


### Backend Setup

Open a terminal in the `backend` directory:

`npm install`

Configure `backend/.env` using `backend/.env.example`.

Start the backend:

`npm run dev`

The backend uses port `5000` by default.

### Frontend Setup

Open another terminal in the `frontend` directory:

`npm install`

Create `frontend/.env.local` with:

`VITE_API_BASE_URL=http://localhost:5000/api`

Start the frontend:

`npm run dev`

Vite displays the frontend URL in the terminal.

## Environment Variables

Configure these variables in `backend/.env`:

| Variable | Description |
|---|---|
| `PORT` | Backend server port |
| `NODE_ENV` | Application environment |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used for signing authentication tokens |
| `CLIENT_URL` | Allowed frontend origin |

Use `backend/.env.example` as a reference. Never commit real credentials or secrets.


## API Documentation

Base URL: `/api`

| Method | Endpoint | Access |
|---|---|---|
| GET | `/health` | Public |
| POST | `/auth/register` | Public |
| POST | `/auth/login` | Public |
| GET | `/users/me` | Authenticated |
| POST | `/donations` | Donor |
| GET | `/donations/my` | Donor |
| GET | `/donations/available` | NGO |
| GET | `/donations/accepted` | NGO |
| PATCH | `/donations/:id/accept` | NGO |
| POST | `/ngos/register` | NGO |
| POST | `/volunteers/register` | Volunteer |
| GET | `/volunteers/me` | Volunteer |
| GET | `/volunteers/available` | NGO |
| GET | `/pickups/my` | Volunteer |
| POST | `/pickups/donations/:donationId/assign` | NGO |
| PATCH | `/pickups/:id/status` | Volunteer |
| GET | `/notifications` | Authenticated |
| PATCH | `/notifications/:id/read` | Authenticated |
| GET | `/admin/users` | Admin |
| GET | `/admin/ngos/pending` | Admin |
| PATCH | `/admin/ngos/:id/approval` | Admin |
| GET | `/admin/dashboard` | Admin |
| GET | `/admin/volunteers` | Admin |
| PATCH | `/admin/volunteers/:id/verification` | Admin |
| GET | `/reports/donations` | Admin |
| GET | `/reports/pickups` | Admin |
| GET | `/reports/food-redistributed` | Admin |
| GET | `/reports/donor-activity` | Admin |

Protected endpoints require authentication. Role-specific endpoints also enforce authorization.


## Docker Deployment

FoodBridge includes Dockerfiles for the backend and frontend, along with a Docker Compose configuration for the backend and MongoDB services.

### Build Backend Image

From the project root:

`docker build -t foodbridge-backend:latest ./backend`

### Build Frontend Image

`docker build -t foodbridge-frontend:latest ./frontend`

### Start MongoDB and Backend

Configure `JWT_SECRET` in the root `.env` file, then run:

`docker compose up -d --build`

### Verify Containers

`docker ps`

### View Logs

`docker compose logs -f`

### Stop Services

`docker compose down`

MongoDB data is stored in the named Docker volume `foodbridge-mongo-data`.


## Kubernetes Deployment

FoodBridge is deployed on a local Kubernetes cluster using Minikube.

### Start Minikube

`minikube start --driver=docker`

### Build and Load Images

Build the backend and frontend images:

`docker build -t foodbridge-backend:latest ./backend`

`docker build -t foodbridge-frontend:latest ./frontend`

Load them into Minikube:

`minikube image load foodbridge-backend:latest`

`minikube image load foodbridge-frontend:latest`

### Create Kubernetes Secret

Create the `foodbridge-secret` Kubernetes Secret containing the JWT secret. Do not commit secret values to GitHub.

### Apply Kubernetes Manifests

`kubectl apply -f k8s/mongodb/mongodb.yaml`

`kubectl apply -f k8s/backend/backend.yaml`

`kubectl apply -f k8s/frontend/frontend.yaml`

### Verify Deployment

`kubectl get pods`

`kubectl get services`

`kubectl get deployments`

### Access the Application

`minikube service foodbridge-frontend`

The command provides access to the frontend service.

The Kubernetes manifests define deployments and services for MongoDB, the backend API, and the frontend.


## Demonstration Workflow

The application can be demonstrated through the following end-to-end workflow:

1. Register and log in as a food donor.
2. Create a food donation with quantity, expiry, and pickup details.
3. Log in as an approved NGO.
4. Browse available donations and accept one.
5. Assign an available volunteer to the accepted donation.
6. Log in as the assigned volunteer.
7. Update the pickup status to `PICKED_UP`.
8. Complete delivery and submit delivery notes.
9. Log in as an administrator.
10. Review dashboard statistics and administrative reports.

## Security

The application incorporates the following security measures:

- Password hashing using bcryptjs.
- JWT-based authentication.
- Role-based authorization for protected APIs.
- Helmet security headers.
- CORS configuration.
- Express rate limiting.
- Protected frontend routes.
- Environment variables for sensitive configuration.
- Git ignore rules to prevent committing local secrets.

## Future Enhancements

Potential improvements include:

- Location-based donation matching.
- Automated expiry and pickup reminders.
- Real-time notifications.
- Advanced analytics and reporting.
- Mobile application support.
- Integration with mapping and route optimization services.
