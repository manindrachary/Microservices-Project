🛒 Distributed E-Commerce Backend System
📖 Project Summary

This project implements a distributed backend system for an E-Commerce platform using a microservices architecture.
Instead of building one large monolithic application, the system is divided into independent services that communicate through an API Gateway.

The system demonstrates authentication, authorization, service routing, API documentation, and containerized deployment.

 System Architecture

The backend consists of three independent services:

1️⃣ Authentication Service (Port 5001)

Handles user registration and login

Encrypts passwords using bcrypt

Generates JWT tokens for authenticated users

Stores user data in MongoDB

2️⃣ Product Management Service (Port 5002)

Performs CRUD operations on products

Associates products with the user who created them

Stores product data in MongoDB

3️⃣ API Gateway (Port 5000)

Serves as the single entry point for all client requests

Routes requests to appropriate services

Validates JWT tokens

Enforces role-based access control

Clients are not allowed to access internal services directly.

🔐 Security Implementation

JWT-based authentication

Token verification handled at API Gateway level

Role-based authorization:

Authenticated users can create and update products

Only ADMIN users can delete products

This ensures centralized security and better control of service access.

📊 API Documentation

Swagger (OpenAPI) documentation is integrated at the API Gateway.

Access documentation at:

http://localhost:5000/api-docs


All available endpoints and request formats can be tested from this interface.

🐳 Containerized Deployment

Each service runs in an isolated Docker container.

The project uses:

Docker for containerization

Docker Compose for multi-container orchestration

All services can be started with a single command:

docker compose up --build


This simplifies deployment and ensures environment consistency.

🛠 Technologies Used

Node.js

Express.js

MongoDB

JWT (jsonwebtoken)

bcryptjs

http-proxy-middleware

Swagger (OpenAPI)

Docker

Docker Compose

📁 Directory Structure
microservices-project/
│
├── auth-service/
├── product-service/
├── api-gateway/
└── docker-compose.yml


Each service is independently structured and deployable.

🎯 Key Concepts Demonstrated

Microservices architecture design

API Gateway pattern

Stateless authentication using JWT

Role-based access control (RBAC)

RESTful service communication

Containerized application deployment

Multi-service orchestration using Docker Compose

📌 Learning Outcome

This project helped in understanding how distributed backend systems are structured in real-world applications, and how authentication and routing can be centralized using an API Gateway.