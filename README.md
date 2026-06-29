# HindiTypingPro

A full-stack Hindi typing practice platform for government exam preparation (SSC, HSSC, Court Typing).

## Tech Stack

**Backend:** Java 17, Spring Boot 3.3.5, Spring Security + JWT, Spring Data JPA, WebSocket, PostgreSQL, Swagger  
**Frontend:** React 18 + TypeScript, Tailwind CSS, React Router, Axios, Chart.js

## Features

- **3 Typing Layouts:** Krutidev 010, Remington Gail, Hindi InScript
- **Difficulty Levels:** Beginner, Intermediate, Advanced
- **Timer Options:** 1 min, 5 min, 10 min
- **Real-time Stats:** WPM, CPM, Accuracy, Mistakes
- **Test History** with performance charts
- **Leaderboard** by speed and accuracy
- **Admin Panel:** Manage passages and users
- **Dark/Light Mode**
- **JWT Authentication**

## Setup

### Prerequisites
- Java 17+
- Maven 3.8+
- Node.js 18+
- PostgreSQL 14+

### Database Setup
```sql
CREATE DATABASE hindi_typing_pro;
```

### Backend
```bash
cd backend
# Edit src/main/resources/application.properties — update DB credentials
mvn spring-boot:run
```
Server starts at: http://localhost:8080  
Swagger UI: http://localhost:8080/swagger-ui.html

### Frontend
```bash
cd frontend
npm install
npm run dev
```
App starts at: http://localhost:3000

## Default Admin Credentials
```
Email: admin@hinditypingpro.com
Password: admin123
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | No | Register |
| POST | /api/auth/login | No | Login |
| GET | /api/users/profile | Yes | User profile |
| GET | /api/tests | Yes | All tests |
| GET | /api/tests/random | Yes | Random test |
| POST | /api/results | Yes | Save result |
| GET | /api/results/history | Yes | Test history |
| GET | /api/leaderboard | Yes | Leaderboard |
| POST | /api/admin/tests | Admin | Create test |
| PUT | /api/admin/tests/{id} | Admin | Update test |
| DELETE | /api/admin/tests/{id} | Admin | Delete test |
| GET | /api/admin/users | Admin | All users |
| DELETE | /api/admin/users/{id} | Admin | Delete user |

## Project Structure

```
GovtTypingPrep/
├── backend/
│   └── src/main/java/com/hinditypingpro/
│       ├── controller/     # REST controllers
│       ├── service/        # Business logic
│       ├── repository/     # JPA repositories
│       ├── entity/         # JPA entities
│       ├── dto/            # Data transfer objects
│       ├── security/       # JWT filter & service
│       ├── config/         # Security, CORS, WebSocket, Swagger
│       └── exception/      # Global exception handler
└── frontend/
    └── src/
        ├── components/     # Reusable UI components
        ├── pages/          # Route pages
        ├── services/       # API service layer
        ├── hooks/          # Custom React hooks
        ├── utils/          # Keyboard mappings & helpers
        ├── context/        # Auth & Theme context
        └── types/          # TypeScript interfaces
```
