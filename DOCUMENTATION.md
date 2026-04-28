# OLTP Admin System — Project Documentation

---

## Document Information

| Field       | Details                              |
|-------------|--------------------------------------|
| **Title**   | OLTP Admin System                    |
| **Version** | 1.0.0                                |
| **Date**    | 2026-04-29                           |
| **Author(s)** | Preet Taparia, Jheel Toshniwal     |

---

## Overview

### Purpose

The **OLTP Admin System** is a full-stack web application designed to manage an Online Test Learning Platform (OLTP). It provides tools for administering student registrations, batch management, question paper creation, test scheduling, and result analysis — all through a controlled, role-based interface.

### Scope

This system serves as the complete administrative and student-facing platform for an educational testing environment. It covers:

- Admin and student authentication
- Student lifecycle management (registration, profile, verification)
- Batch and category management
- Question paper composition and question bank management
- Test scheduling and publishing
- Automated score recording and leaderboard generation
- Email verification and password reset workflows
- Public-facing pages (landing, news/articles, subject information)
- Legal and informational pages (about, contact, privacy policy, refund policy, terms & conditions)

### Key Features

- **Role-Based Access Control** — Separate Admin and Student roles with different permissions
- **Three Question Types** — MCQ (Multiple Choice), MSQ (Multi-Select), NAT (Numerical Answer Type)
- **Live Test Status** — Real-time visibility into ongoing tests
- **Leaderboard** — Per-test ranked leaderboard for students and admins
- **Email Workflows** — Account verification and password reset via email (Nodemailer)
- **Image Uploads** — Profile images via Multer; answer key PDFs stored server-side
- **Security Hardening** — Helmet, CORS, Mongo sanitization, rate limiting on login routes
- **Responsive Frontend** — React admin and student dashboards with Ant Design, Tailwind CSS, and ApexCharts for analytics
- **Auto-Generated Student IDs** — Student IDs are generated server-side on registration (`STU-<timestamp>-<random>`)
- **Public Content Pages** — Landing page, news/articles, subject detail pages, and full legal/informational page suite

### Target Users

| Role    | Description                                                   |
|---------|---------------------------------------------------------------|
| Admin   | Platform staff who manage students, tests, papers, and scores |
| Student | Enrolled learners who take tests and view their results       |
| Visitor | Unauthenticated users who view public landing, subject, legal, and news pages |

---

## System Architecture

### High-Level Design

```
┌──────────────────────────────────────────────────────┐
│                    Browser (React SPA)                │
│   Admin Dashboard     │     Student Dashboard         │
└─────────────┬──────────────────────┬─────────────────┘
              │  REST API (HTTP/JSON) │
              ▼                      ▼
┌─────────────────────────────────────────────────────┐
│            Express.js API Server (Node.js)           │
│  Routes/v1  →  Middleware  →  Controllers            │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│                   MongoDB (Mongoose)                 │
│  Admin  Student  Batch  Category  QuestionPaper      │
│  Question  Test  Score                               │
└─────────────────────────────────────────────────────┘
```

### Components and Modules

| Layer      | Responsibility                                           |
|------------|----------------------------------------------------------|
| Frontend   | React SPA with routing, auth state, views, components    |
| Backend    | Express REST API — routing, validation, business logic   |
| Database   | MongoDB via Mongoose ODM — schema-enforced persistence   |
| Middleware | Auth (JWT), rate limiting, sanitization, file uploads    |
| Utils      | Email sending, email normalization, phone validation     |

### Data Flow Overview

1. Client makes HTTP request with `Authorization: Bearer <JWT>` header
2. Express routes delegate to `checkAuth` middleware (JWT verification + DB existence check)
3. Role check is applied via `checkAdminPermissions` or inline role arrays
4. `express-validator` validates request body/params
5. Controller executes business logic against MongoDB via Mongoose models
6. Response is returned as JSON; errors are caught by global error handler

---

## Technology Stack

### Programming Languages

| Layer    | Language   |
|----------|------------|
| Backend  | JavaScript (Node.js 18+) |
| Frontend | JavaScript (JSX/React)   |

### Frameworks and Libraries

**Backend**

| Package                 | Version    | Purpose                            |
|-------------------------|------------|------------------------------------|
| express                 | ^4.18.2    | HTTP server and routing            |
| mongoose                | ^7.5.3     | MongoDB ODM                        |
| jsonwebtoken            | ^9.0.2     | JWT authentication                 |
| bcryptjs                | ^2.4.3     | Password hashing                   |
| express-validator       | ^7.0.1     | Input validation                   |
| helmet                  | ^8.1.0     | HTTP security headers              |
| cors                    | ^2.8.6     | Cross-origin resource sharing      |
| express-mongo-sanitize  | ^2.2.0     | NoSQL injection prevention         |
| express-rate-limit      | ^8.2.1     | Login rate limiting                |
| multer                  | ^1.4.3     | Multipart file uploads             |
| nodemailer              | ^8.0.1     | Email sending (SMTP)               |
| morgan                  | ^1.10.1    | HTTP request logging               |
| dotenv                  | ^17.3.1    | Environment variable loading       |
| libphonenumber-js       | ^1.12.37   | Phone number validation            |
| uuid                    | ^9.0.1     | UUID generation                    |
| mongoose-unique-validator| ^4.0.0   | Better unique constraint errors    |
| axios                   | ^1.6.3     | HTTP client for outbound requests  |
| body-parser             | ^1.20.2    | Request body parsing               |
| nodemon                 | ^3.0.2     | Dev: auto-restarts server          |

**Frontend**

| Package              | Version    | Purpose                            |
|----------------------|------------|------------------------------------|
| react                | ^18.2.0    | UI library                         |
| react-dom            | ^18.2.0    | DOM rendering                      |
| react-router-dom     | ^6.4.0     | Client-side routing                |
| antd                 | ^5.14.1    | Ant Design component library       |
| tailwindcss          | ^3.1.8     | Utility-first CSS framework        |
| @chakra-ui/*         | ^2.x       | Additional UI primitives           |
| apexcharts           | 3.35.5     | Chart rendering engine             |
| react-apexcharts     | 1.4.0      | React wrapper for ApexCharts       |
| framer-motion        | ^7.10.2    | Animations                         |
| jwt-decode           | ^4.0.0     | JWT decoding on the client         |
| react-spinners       | ^0.13.8    | Loading spinners                   |
| react-table          | ^7.8.0     | Data table management              |
| react-phone-number-input | ^3.4.16| Phone input component             |
| react-icons          | ^4.4.0     | Icon library                       |
| react-calendar       | ^3.9.0     | Calendar picker                    |

### Tools and Platforms

| Tool       | Purpose                          |
|------------|----------------------------------|
| MongoDB Atlas / Local MongoDB | Primary database     |
| Nodemon    | Development server hot-reload    |
| Prettier   | Frontend code formatting         |
| PostCSS    | CSS transformations (Tailwind)   |
| npm        | Package management (both layers) |

---

## Project Structure

```
oltp-admin/
├── backend/
│   ├── app.js                      # Entry point: Express setup, DB connection, global middleware
│   ├── package.json
│   ├── .env                        # Environment variables (not committed)
│   ├── Controllers/
│   │   └── v1/
│   │       ├── Admin-Controllers.js
│   │       ├── Student-Controllers.js
│   │       ├── Batch-Controllers.js
│   │       ├── Category-Controllers.js
│   │       ├── Question-Controllers.js
│   │       ├── QuestionPaper-Controllers.js
│   │       ├── Test-Controllers.js
│   │       └── Score-Controllers.js
│   ├── Models/
│   │   ├── Admin.js
│   │   ├── Student.js
│   │   ├── Batch.js
│   │   ├── Category.js
│   │   ├── Question.js
│   │   ├── QuestionPaper.js
│   │   ├── Test.js
│   │   └── Score.js
│   ├── Routes/
│   │   └── v1/
│   │       ├── Admin-Routes.js
│   │       ├── Student-Routes.js
│   │       ├── Batch-Routes.js
│   │       ├── Category-Routes.js
│   │       ├── Question-Routes.js
│   │       ├── QuestionPaper-Routes.js
│   │       ├── Test-Routes.js
│   │       └── Score-Routes.js
│   ├── Middleware/
│   │   ├── check-auth.js           # JWT verification + role enforcement
│   │   ├── check-admin-permissions.js # Update/delete permission guard
│   │   ├── http-error.js           # Custom error class
│   │   ├── image-upload.js         # Multer config for profile images
│   │   ├── upload.js               # Multer config for answer key PDFs
│   │   ├── duplicate-key.js        # MongoDB duplicate key error parser
│   │   └── rate-limiter.js         # express-rate-limit for login routes
│   ├── Utils/
│   │   ├── email.js                # Email sending utility (Nodemailer)
│   │   ├── emailNormalization.js   # Email normalizer (lowercase, alias stripping)
│   │   └── phoneValidation.js      # Phone number format validator
│   ├── scripts/                    # Utility/seed scripts
│   └── uploads/
│       ├── images/                 # Stored profile images (runtime-created)
│       └── answer-keys/            # Uploaded answer key PDFs
│
└── oltp-frontend/
    ├── package.json
    ├── tailwind.config.js
    ├── src/
    │   ├── App.jsx                 # Root component with role-based routing
    │   ├── index.js                # React entry point
    │   ├── index.css               # Global styles
    │   ├── routes.js               # Admin route definitions
    │   ├── studentRoutes.js        # Student route definitions
    │   ├── components/             # Shared/reusable components
    │   │   ├── auth-hook.js        # useAuth custom hook
    │   │   ├── Auth-context.js     # AuthContext provider
    │   │   ├── FetchInterceptor.js # Global 401 fetch interceptor
    │   │   └── ...
    │   ├── layouts/
    │   │   ├── admin/              # Admin dashboard shell layout
    │   │   └── student/            # Student dashboard shell layout
    │   ├── views/
    │   │   ├── auth/               # SignIn, Register, Verify, ForgotPassword, ResetPassword
    │   │   ├── admin/              # Admin-facing feature views
    │   │   ├── student/            # Student-facing feature views (tests, results)
    │   │   ├── legal/              # AboutUs, Contact, PrivacyPolicy, RefundPolicy, TermsAndConditions
    │   │   ├── subjects/           # MechanicalSubjectPage, CommunicationAptitudePage, subjectData
    │   │   ├── LandingPage.jsx     # Public landing page
    │   │   └── NewsArticlesPage.jsx # News and articles listing page
    │   └── assets/                 # Static assets (images, icons)
    └── public/                     # Public static files
```

---

## Setup and Configuration

### Prerequisites

#### Required Software

| Requirement | Version    |
|-------------|------------|
| Node.js     | >= 18.x    |
| npm         | >= 9.x     |
| MongoDB     | >= 6.x (local or Atlas) |

#### System Requirements

- Minimum 512 MB RAM for development
- Network access to MongoDB instance
- SMTP credentials for email features

---

### Installation

#### 1. Clone the repository

```bash
git clone <repository-url>
cd oltp-admin
```

#### 2. Install backend dependencies

```bash
cd backend
npm install
```

#### 3. Install frontend dependencies

```bash
cd ../oltp-frontend
npm install
```

---

### Configuration

#### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGOURL=mongodb://localhost:27017/oltp-admin
JWT_KEY=your_jwt_secret_key
CORS_ORIGIN=http://localhost:3000
BACKEND_URL=http://localhost:5000

# Email (Nodemailer SMTP)
EMAIL_HOST=smtp.yourmailprovider.com
EMAIL_PORT=587
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
EMAIL_FROM=no-reply@example.com
```

#### Frontend Environment Variables

Create a `.env` file in the `oltp-frontend/` directory:

```env
REACT_APP_BACKEND_URL=http://localhost:5000
```

#### Running the Application

```bash
# Start backend (from /backend)
npm start

# Start frontend (from /oltp-frontend)
npm start
```

The backend runs on `http://localhost:5000` and the frontend on `http://localhost:3000` by default.

---

## Functional Requirements

### Core Features

| Feature                      | Description                                                        |
|------------------------------|--------------------------------------------------------------------|
| Admin Authentication         | Login with rate-limited endpoint, JWT-based session               |
| Student Authentication       | Login, self-registration, email verification, password reset       |
| Student Management           | CRUD for students; image upload; batch assignment                  |
| Batch Management             | Create, update, delete batches; unique name enforcement            |
| Category Management          | Create exam categories with associated subject lists              |
| Question Paper Management    | Create question papers with scoring config, answer key upload      |
| Question Bank                | MCQ, MSQ, NAT questions with images, marks, difficulty            |
| Test Scheduling              | Create tests linked to papers and batches; permanent or timed      |
| Score Recording              | Students submit answers; scores auto-calculated and persisted      |
| Leaderboard                  | Ranked score view accessible to admin and students                 |
| Live Test Status             | Admin can view who has submitted a live test                       |
| Performance Analytics        | Score charts and result breakdowns on the frontend                 |
| Public Content Pages         | Landing page, news/articles, subject information pages             |
| Legal Pages                  | About us, contact, privacy policy, refund policy, terms & conditions |

### Use Cases

| Actor   | Use Case                                              |
|---------|-------------------------------------------------------|
| Admin   | Register and manage other admins                      |
| Admin   | Onboard students and assign to batches                |
| Admin   | Create question papers with scoring rules             |
| Admin   | Add MCQ/MSQ/NAT questions to a paper                  |
| Admin   | Schedule a test and publish it                        |
| Admin   | View live test participation and download results     |
| Student | Self-register and verify email                        |
| Student | Reset forgotten password                              |
| Student | Attempt a published test                              |
| Student | View personal results and leaderboard                 |
| Visitor | Browse landing page, subject pages, news, and legal content |

---

## Non-Functional Requirements

### Performance
- Login endpoints are rate-limited to prevent brute-force attacks
- MongoDB queries use field-level indexes (`email`, `normalizedEmail`, `paperId`, `testId`, `studentId`) for fast lookups
- Static files (images, answer keys) are served via `express.static` with CORS headers

### Security
- Passwords are hashed with **bcryptjs** before storage; plaintext passwords are never stored
- All protected routes require a valid JWT (`Authorization: Bearer <token>`)
- MongoDB injection is prevented via **express-mongo-sanitize**
- HTTP headers are hardened with **Helmet** (CSP, CORP, etc.)
- File uploads are strictly typed; orphaned files are cleaned up on errors
- Email addresses are normalized before storage to prevent duplicate accounts

### Scalability
- API is versioned under `/api/v1/` to allow future non-breaking upgrades
- Module-based controller structure makes it straightforward to add new domains
- MongoDB horizontal scaling (sharding) can be applied with minimal application changes

### Reliability
- Global error handler captures all unhandled errors and returns structured JSON responses
- Uploaded files are cleaned up if the associated request fails
- JWT expiry and revocation (account deletion) are checked on every authenticated request

---

## API and Interfaces

> **Base URL:** `http://localhost:5000/api/v1`
> **Auth Header:** `Authorization: Bearer <JWT>`

---

### Admin Endpoints (`/admin`)

| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| GET | `/get/all/admins` | Admin | List all admins |
| GET | `/get/admin/byid/:id` | Admin | Get admin by MongoDB ID |
| POST | `/create/admin` | Public | Create new admin account |
| POST | `/login` | Public | Admin login (rate-limited) |
| PATCH | `/update/admin/byid/:id` | Admin | Update admin profile |
| PATCH | `/update/image/byid/:id` | Admin | Update admin profile image |
| PATCH | `/update/password/byemail/:email` | Admin | Change admin password |
| DELETE | `/delete/admin/byid/:id` | Admin | Delete an admin |

**Login Request Example**
```json
POST /api/v1/admin/login
{
  "email": "admin@example.com",
  "password": "securepassword"
}
```

**Login Response Example**
```json
{
  "userId": "64fa...",
  "email": "admin@example.com",
  "token": "eyJhbGci...",
  "role": "Admin"
}
```

---

### Student Endpoints (`/student`)

| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| GET | `/get/all/students` | Admin | List all students |
| GET | `/get/student/byid/:id` | Admin / Student | Get student by ID |
| POST | `/signup` | Public | Student self-registration |
| POST | `/create/student` | Admin | Admin creates a student |
| POST | `/login` | Public | Student login (rate-limited) |
| GET | `/verify/:token` | Public | Email verification |
| POST | `/resend-verification` | Public | Resend verification email |
| POST | `/forgot-password` | Public | Initiate password reset |
| POST | `/reset-password` | Public | Submit new password with token |
| PATCH | `/update/student/byid/:id` | Admin | Admin updates student |
| PATCH | `/update/student/student/byid/:id` | Student | Student updates own profile |
| PATCH | `/update/image/byid/:id` | Student | Update student profile image |
| PATCH | `/update/password/byemail/:email` | Admin / Student | Change student password |
| DELETE | `/delete/student/byid/:id` | Admin | Delete student |

**Student Registration Request Example**
```json
POST /api/v1/student/signup
Content-Type: multipart/form-data

{
  "firstName": "Ravi",
  "lastName": "Sharma",
  "email": "ravi@example.com",
  "password": "pass123",
  "phoneNumber": "+919876543210",
  "admissionDate": "2026-01-01",
  "batch": "Batch A",
  "city": "Mumbai",
  "pincode": "400001",
  "state": "Maharashtra",
  "country": "India",
  "image": <file>
}
```

**Response Example**
```json
{
  "message": "Registration successful. Please verify your email."
}
```

---

### Batch Endpoints (`/batch`)

| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| GET | `/get/all/batches` | Public | List all batches |
| POST | `/create/batch` | Admin | Create a new batch |
| PATCH | `/update/batch/byid/:id` | Admin | Rename a batch |
| DELETE | `/delete/batch/byid/:id` | Admin | Delete a batch |

---

### Category Endpoints (`/category`)

| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| GET | `/get/all` | Public | List all categories |
| GET | `/get/:id` | Public | Get category by ID |
| POST | `/create` | Admin | Create category |
| PATCH | `/update/:id` | Admin | Update category name/description |
| PATCH | `/add-subject/:id` | Admin | Add a subject to category |
| DELETE | `/remove-subject/:id/:subject` | Admin | Remove a subject from category |
| DELETE | `/delete/:id` | Admin | Delete category |

---

### Question Paper Endpoints (`/questionpaper`)

| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| GET | `/get/all/questionpapers` | Public | List all papers |
| GET | `/get/questionpaper/byid/:id` | Public | Get paper by MongoDB ID |
| GET | `/get/questionpaper/bypaperid/:paperId` | Public | Get paper by paperId |
| GET | `/get/questionpaper/summary/:paperId` | Public | Get paper totals summary |
| POST | `/create/questionpaper` | Admin | Create new question paper |
| PATCH | `/update/questionpaper/byid/:id` | Admin | Update paper |
| PATCH | `/sync/questionpaper/totals/:id` | Admin | Recalculate question totals |
| DELETE | `/delete/questionpaper/byid/:id` | Admin | Delete question paper |

---

### Question Endpoints (`/question`)

| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| GET | `/get/all/questions` | Admin / Student | List all questions |
| GET | `/get/questions/bypaperid/:paperId` | Admin / Student | Questions for a paper |
| GET | `/get/question/byid/:id` | Admin / Student | Single question |
| POST | `/create/question` | Admin | Create question (supports image upload) |
| PATCH | `/update/question/byid/:id` | Admin | Update question |
| DELETE | `/delete/question/byid/:id` | Admin | Delete question |

---

### Test Endpoints (`/test`)

| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| GET | `/get/all/tests` | Public | List all tests |
| GET | `/get/test/bytestid/:testId` | Public | Get test by testId string |
| GET | `/get/test/byid/:id` | Public | Get test by MongoDB ID |
| POST | `/create/test` | Admin | Create a new test |
| PATCH | `/update/test/byid/:id` | Admin | Update test |
| DELETE | `/delete/test/byid/:id` | Admin | Delete test |

---

### Score Endpoints (`/score`)

| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| GET | `/get/all/scores` | Admin | List all scores |
| GET | `/get/score/byid/:scoreId` | Public | Get score by ID |
| GET | `/get/scores/bystudentid/:studentId` | Public | Scores for a student |
| GET | `/get/scores/bytestid/:testId` | Public | All scores for a test |
| GET | `/get/score/bytestid/:testId/studentid/:studentId` | Public | Specific student score on a test |
| GET | `/get/attempted/tests/bystudentid/:studentId` | Public | List of tests a student attempted |
| GET | `/get/leaderboard/bytestid/:testId` | Admin / Student | Test leaderboard |
| GET | `/get/live/status/:testId` | Admin | Live test participation status |
| POST | `/create/score` | Student | Submit test score |
| PATCH | `/update/:scoreId` | Admin | Update score metadata |
| PATCH | `/update/:scoreId/questions` | Admin | Update question-level answers in a score |
| DELETE | `/delete/scores/bytestid/:testId` | Admin | Delete all scores for a test |
| DELETE | `/delete/single/:scoreId` | Admin | Delete single score |

---

### External Integrations

| Service    | Purpose                        | Library     |
|------------|--------------------------------|-------------|
| SMTP Email | Account verification and password reset | Nodemailer |
| ui-avatars.com | Fallback avatar generation | CSP whitelist |

### Internal Interfaces

- `AuthContext` / `useAuth` hook — manages token, userId, email, role in React context
- `FetchInterceptor` — wraps fetch globally to handle 401 responses (auto-logout)
- Controllers communicate with Mongoose models; no direct DB calls in routes

---

## Data Design

### Database: MongoDB

All collections use Mongoose schemas with strict validation.

### Collections and Models

#### `admins`

| Field           | Type    | Constraints              |
|-----------------|---------|--------------------------|
| firstName       | String  | Required                 |
| lastName        | String  | Required                 |
| mobile          | String  | Required                 |
| email           | String  | Required, Unique         |
| normalizedEmail | String  | Required, Unique, Indexed|
| password        | String  | Required (bcrypt hash)   |
| image           | String  | Default: null            |
| role            | String  | Required (`"Admin"`)     |

#### `students`

| Field                  | Type    | Constraints                  |
|------------------------|---------|------------------------------|
| firstName              | String  | Required                     |
| lastName               | String  | Required                     |
| fatherName             | String  | Optional                     |
| motherName             | String  | Optional                     |
| phoneNumber            | String  | Required                     |
| alternateNumber        | String  | Optional                     |
| role                   | String  | Required (`"Student"`)       |
| image                  | String  | Required                     |
| email                  | String  | Required, Unique             |
| normalizedEmail        | String  | Required, Unique, Indexed    |
| password               | String  | Required (bcrypt hash)       |
| studentId              | String  | Required                     |
| admissionDate          | String  | Required                     |
| batch                  | String  | Required                     |
| address                | String  | **REMOVED** (replaced by `city`)   |
| city                   | String  | Required                     |
| pincode                | String  | Required                     |
| state                  | String  | Required                     |
| country                | String  | Required                     |
| isVerified             | Boolean | Default: false               |
| verificationToken      | String  | Optional                     |
| verificationTokenExpiry| Date    | Optional                     |
| resetPasswordToken     | String  | Optional                     |
| resetPasswordExpiry    | Date    | Optional                     |

#### `batches`

| Field     | Type   | Constraints      |
|-----------|--------|------------------|
| batchName | String | Required, Unique |

#### `categories`

| Field       | Type     | Constraints      |
|-------------|----------|------------------|
| name        | String   | Required, Unique |
| subjects    | [String] | —                |
| description | String   | Default: `""`    |
| createdAt   | Date     | Default: now     |

#### `questionpapers`

| Field              | Type     | Constraints              |
|--------------------|----------|--------------------------|
| paperId            | String   | Required, Unique         |
| category           | String   | Required                 |
| subjects           | [String] | —                        |
| batch              | String   | Default: `""`            |
| difficulty         | String   | Enum: Easy/Medium/Hard   |
| totalQuestions     | Number   | Default: 0               |
| totalMarks         | Number   | Default: 0               |
| marksPerQuestion   | Number   | Default: 4               |
| negativeMarking    | Boolean  | Default: false           |
| negativeFraction   | Number   | Default: 0.25            |
| passingPercentage  | Number   | Default: 35              |
| isActive           | Boolean  | Default: true            |
| description        | String   | Default: `""`            |
| answerKeyFile      | String   | Default: `""`            |

#### `questions`

| Field          | Type   | Constraints                    |
|----------------|--------|--------------------------------|
| paperId        | String | Required, Indexed              |
| text           | String | Required                       |
| questionImage  | String | Optional                       |
| type           | String | Enum: MCQ / MSQ / NAT          |
| options        | [{text, image}] | —                   |
| correctOption  | Mixed  | For MCQ                        |
| correctOptions | [Number] | For MSQ                      |
| natMin         | Number | For NAT (min accepted value)   |
| natMax         | Number | For NAT (max accepted value)   |
| marksPositive  | Number | —                              |
| marksNegative  | Number | —                              |
| topic          | String | Default: `""`                  |
| difficulty     | String | Enum: Easy/Medium/Hard         |

#### `tests`

| Field              | Type     | Constraints              |
|--------------------|----------|--------------------------|
| testId             | String   | Required, Unique         |
| testName           | String   | Required                 |
| paperId            | String   | Required                 |
| batchName          | String   | Default: `""`            |
| category           | String   | Default: `""`            |
| subjects           | [String] | —                        |
| totalMarks         | Number   | Default: 0               |
| totalQuestions     | Number   | Default: 0               |
| isPermanent        | Boolean  | Default: false           |
| date               | String   | Required if not permanent|
| startTime          | String   | Required if not permanent|
| endTime            | String   | Required if not permanent|
| duration           | Number   | Required                 |
| passingPercentage  | Number   | Default: 35              |
| isPublished        | Boolean  | Default: false           |
| allowCalculator    | Boolean  | Default: true            |
| allowWatermark     | Boolean  | Default: true            |
| description        | String   | Default: `""`            |

#### `scores`

| Field          | Type        | Constraints       |
|----------------|-------------|-------------------|
| testId         | String      | Required, Indexed |
| testName       | String      | Default: `""`     |
| studentId      | String      | Required, Indexed |
| studentName    | String      | Default: `""`     |
| paperId        | String      | Required          |
| batch          | String      | Default: `""`     |
| category       | String      | Default: `""`     |
| subjects       | [String]    | —                 |
| marksObtained  | Number      | Required          |
| totalMarks     | Number      | Required          |
| percentage     | Number      | Default: 0        |
| passed         | Boolean     | Default: false    |
| questions      | [QuestionAttempt] | Embedded  |

**QuestionAttempt sub-document:**

| Field         | Type   |
|---------------|--------|
| questionId    | String |
| questionText  | String |
| questionType  | String |
| correctAnswer | Mixed  |
| chosenAnswer  | Mixed  |
| marksAwarded  | Number |

### Relationships

```
Category ──(1:N)──> QuestionPaper (by category name)
QuestionPaper ──(1:N)──> Question (by paperId)
QuestionPaper ──(1:N)──> Test (by paperId)
Batch ──(1:N)──> Student (by batch name)
Batch ──(1:N)──> Test (by batchName)
Test ──(1:N)──> Score (by testId)
Student ──(1:N)──> Score (by studentId)
```

> **Note:** Relationships are enforced through application logic (string keys), not MongoDB foreign key references (`ObjectId` refs), for flexibility in lookup patterns.

---

## Core Modules / Components

### Backend Modules

#### `Admin-Controllers`
- **Responsibility:** Admin CRUD, login, password management, profile image update
- **Key Functions:** `getAllAdmins`, `getAdminById`, `createAdmin`, `login`, `updateAdminById`, `updateImageById`, `updatePasswordByEmail`, `deleteAdmin`

#### `Student-Controllers`
- **Responsibility:** Student CRUD, email verification flow, password reset flow, auto-generated student IDs
- **Key Functions:** `getAllStudents`, `getStudentById`, `createStudent`, `login`, `verifyEmail`, `resendVerificationEmail`, `forgotPassword`, `resetPassword`, `updateStudentById`, `updateImageById`, `updatePasswordByEmail`, `deleteStudentById`
- **Notable:** `studentId` is auto-generated via `generateStudentId()` on creation. The `address` field has been replaced by `city`.

#### `Batch-Controllers`
- **Responsibility:** Batch management (no default batch; deleting a batch unassigns its students)
- **Key Functions:** `getAllBatches`, `createBatch`, `updateBatchById`, `deleteBatchById`

#### `Category-Controllers`
- **Responsibility:** Exam category and subject list management
- **Key Functions:** `getAllCategories`, `getCategoryById`, `createCategory`, `updateCategoryById`, `addSubjectToCategory`, `removeSubjectFromCategory`, `deleteCategoryById`

#### `QuestionPaper-Controllers`
- **Responsibility:** Question paper lifecycle and scoring configuration
- **Key Functions:** `getAllQuestionPapers`, `getQuestionPaperById`, `getQuestionPaperByPaperId`, `getQuestionPaperSummary`, `createQuestionPaper`, `updateQuestionPaperById`, `syncPaperTotals`, `deleteQuestionPaperById`

#### `Question-Controllers`
- **Responsibility:** Per-question CRUD with image upload support
- **Key Functions:** `getAllQuestions`, `getQuestionsByPaperId`, `getQuestionById`, `createQuestion`, `updateQuestionById`, `deleteQuestionById`

#### `Test-Controllers`
- **Responsibility:** Test creation, scheduling, publishing
- **Key Functions:** `getAllTests`, `getTestByTestId`, `getTestById`, `createTest`, `updateTestById`, `deleteTestById`

#### `Score-Controllers`
- **Responsibility:** Score submission, retrieval, analytics, leaderboard
- **Key Functions:** `getAllScores`, `getScoreById`, `getScoresByStudentId`, `getScoresByTestId`, `getScoreByTestAndStudent`, `getAttemptedTestsByStudentId`, `getLeaderboardByTestId`, `getLiveTestStatus`, `createScore`, `updateScore`, `updateScoreQuestions`, `deleteScoresByTestId`, `deleteSingleScore`

### Frontend Modules

#### `useAuth` / `AuthContext`
- Custom hook that reads JWT from localStorage, decodes role, expiry
- Provides `login`, `logout`, `userId`, `token`, `email`, `role` to all components

#### `FetchInterceptor`
- Globally intercepts fetch responses; on `401`, triggers auto-logout

#### `AdminLayout` / `StudentLayout`
- Shell layouts with sidebar navigation, header, and `<Outlet>` for sub-views

#### Test Taking (`views/student/test/TestingPlatform`)
- `testingScreen` — renders questions, handles timer, submits answers
- `feedbackScreen` — displays result summary after submission

#### Legal Pages (`views/legal/`)
- `AboutUsPage` — Organization information
- `ContactPage` — Contact form and details
- `PrivacyPolicyPage` — Privacy policy content
- `RefundPolicyPage` — Refund policy content
- `TermsAndConditionsPage` — Terms and conditions content

#### Subject Pages (`views/subjects/`)
- `MechanicalSubjectPage` — Mechanical engineering subject details and syllabus
- `CommunicationAptitudePage` — Communication and aptitude subject details
- `subjectData.js` — Centralized subject content data

#### News and Articles (`views/NewsArticlesPage.jsx`)
- Public-facing news and articles listing page

---

## Process Flow

### Student Registration Flow

```
Student → POST /student/signup (with image)
  → express-validator validates fields
  → bcrypt hashes password
  → Unique email check
  → studentId auto-generated (STU-<timestamp>-<random>)
  → Student record created (isVerified: false)
  → Verification email sent (Nodemailer) with token link
  → Student clicks link → GET /student/verify/:token
  → Token + expiry checked → isVerified set to true
```

### Test Attempt Flow

```
Student logs in → JWT issued
Student opens test → GET /test/get/test/bytestid/:testId
Questions fetched → GET /question/get/questions/bypaperid/:paperId
Student submits answers → POST /score/create/score
  → Score calculated server-side (marksObtained, percentage, passed)
  → Score document saved to DB
Student views result → GET /score/get/score/bytestid/:testId/studentid/:studentId
```

### Password Reset Flow

```
Student → POST /student/forgot-password (email)
  → Reset token generated (UUID), saved with 1hr expiry
  → Reset email sent with link containing token
Student → POST /student/reset-password { token, newPassword }
  → Token looked up, expiry checked
  → Password updated (bcrypt), token cleared
```

---

## Security

### Authentication
- JWT tokens are signed with `process.env.JWT_KEY` using `jsonwebtoken`
- Tokens carry `userId`, `email`, and `role` claims
- `checkAuth` middleware verifies token signature and confirms the user still exists in the DB

### Authorization
- Routes declare allowed roles: `checkAuth("Admin")`, `checkAuth("Student")`, or `checkAuth(["Admin", "Student"])`
- Admin-specific operations (delete, update others) use `checkAdminPermissions` middleware

### Data Protection
- Passwords hashed with **bcryptjs** (cost factor: default 12)
- Email normalization prevents duplicate accounts via different casing or Gmail aliases
- `express-mongo-sanitize` removes `$` and `.` characters from request body/query to prevent NoSQL injection
- File uploads restricted by MIME type and size in Multer configuration
- Helmet sets strict HTTP security headers including a Content Security Policy

---

## Error Handling and Logging

### Error Types

| HTTP Code | Scenario                                |
|-----------|-----------------------------------------|
| 400       | Validation failure, bad request format  |
| 401       | Missing or invalid JWT token            |
| 403       | Valid token but insufficient role       |
| 404       | Resource or route not found             |
| 409       | Duplicate key (email, studentId, etc.)  |
| 500       | Unhandled server-side error             |

All errors are returned in a uniform JSON format:
```json
{ "message": "Human-readable error description" }
```

### Error Handling Strategy
- Custom `HttpError` class extends `Error` with an HTTP `code` property
- Global error handler in `app.js` catches all errors passed via `next(error)`
- On errors, orphaned uploaded files are deleted via `fs.unlink`
- Mongoose duplicate key errors (code `11000`) are parsed into `409 Conflict` responses

### Logging Strategy
- **Morgan** (`combined` format) logs all incoming HTTP requests to stdout
- `console.error` is used for critical internal errors (JWT failures, file deletion failures, DB connection errors)
- No persistent log files in development; recommend wiring Morgan to a file transport or log aggregator in production

---

## Testing

### Testing Strategy
- **Manual API testing** is the primary approach (Postman/Insomnia recommended)
- **Frontend component testing** via React Testing Library (available via `react-scripts test`)

### Tools Used

| Tool              | Purpose                    |
|-------------------|----------------------------|
| Postman / Insomnia | API endpoint testing      |
| React Testing Library | Frontend unit tests   |
| Jest (via react-scripts) | Test runner          |

### How to Run Tests

```bash
# Frontend unit tests
cd oltp-frontend
npm test

# Backend (no automated tests configured — manual testing recommended)
cd backend
npm test  # prints: "Error: no test specified"
```

---

## Performance Considerations

### Optimization Techniques
- **Database indexes** on high-query fields: `normalizedEmail`, `paperId`, `testId`, `studentId`
- **Static file serving** via Express `express.static` middleware (no controller overhead for images/PDFs)
- **Body size limit** capped at 10 MB to prevent abuse
- **Rate limiting** on `/login` endpoints to reduce server load from brute-force attempts

### Load Handling
- Express is single-threaded; for high-load production deployments, use **PM2** in cluster mode or container orchestration (e.g., Kubernetes)
- MongoDB connection pooling is handled automatically by Mongoose
- Frontend is a static SPA build — serve via CDN or Nginx for best performance

---

## Deployment

### Build Process

```bash
# Build the frontend production bundle
cd oltp-frontend
npm run build
# Output: oltp-frontend/build/
```

### Deployment Steps

#### Development

```bash
# Terminal 1 — Backend
cd backend && npm start   # nodemon watches for changes

# Terminal 2 — Frontend
cd oltp-frontend && npm start
```

#### Production

1. Build the frontend: `npm run build` (inside `oltp-frontend/`)
2. Serve `build/` with Nginx or a static hosting service (Vercel, Netlify, S3+CloudFront)
3. Start the backend with PM2:

```bash
npm install -g pm2
pm2 start backend/app.js --name oltp-backend
pm2 save
pm2 startup
```

### Environments

| Environment | Frontend URL | Backend URL | DB |
|-------------|-------------|-------------|-----|
| Development | http://localhost:3000 | http://localhost:5000 | Local MongoDB |
| Production  | https://your-domain.com | https://api.your-domain.com | MongoDB Atlas |

### Infrastructure Details
- Backend: Node.js server (bare metal, VPS, or container)
- Frontend: Static SPA build (Nginx / CDN)
- Database: MongoDB Atlas (recommended) or self-hosted MongoDB
- File storage: Local `uploads/` directory (consider migrating to S3/GCS for production)

---

## Maintenance and Monitoring

### Monitoring Tools (Recommended)
- **PM2 Monitor** — process uptime and restart counts
- **MongoDB Atlas Monitoring** — query performance, index usage, slow queries
- **Sentry / LogRocket** — frontend error tracking
- **UptimeRobot / Pingdom** — endpoint availability checks

### Update Process
1. Pull latest changes from the repository
2. Run `npm install` in both `backend/` and `oltp-frontend/`
3. Rebuild the frontend: `cd oltp-frontend && npm run build`
4. Restart the backend: `pm2 restart oltp-backend`

### Backup Strategy
- Enable **MongoDB Atlas automated backups** (recommended: daily snapshots, 7-day retention)
- Backup the `uploads/` directory regularly (images and answer key PDFs are not stored in MongoDB)
- Store backups in an off-site location (S3, Google Drive, etc.)

---

## Coding Guidelines

### Naming Conventions

| Item | Convention | Example |
|------|------------|---------|
| Files (backend) | PascalCase, hyphen-separated | `Admin-Controllers.js` |
| Files (frontend) | camelCase or PascalCase `.jsx` | `AuthContext.jsx` |
| Variables/functions | camelCase | `getAllStudents` |
| Constants | camelCase | `allowedOrigin` |
| Mongoose models | PascalCase | `Student`, `QuestionPaper` |
| API routes | kebab-case segments | `/get/all/students` |
| Environment variables | SCREAMING_SNAKE_CASE | `JWT_KEY`, `MONGOURL` |

### Code Structure
- **Controllers** contain all business logic; routes are kept thin
- **Models** define schema only; no business logic in models
- **Middleware** is reusable and stateless
- **Utils** are pure utility functions (no Express req/res)
- Express-validator rules are co-located with route definitions for traceability

### Best Practices
- Always use `async/await` with `try/catch` in controllers
- Pass errors to Express via `next(new HttpError(message, code))` — never `res.status().json()` directly in error paths
- Normalize and trim all user string inputs before storage
- Never log sensitive data (passwords, tokens) to stdout
- Use `process.env` for all secrets — never hardcode credentials

---

## Troubleshooting

### Common Issues

| Problem | Likely Cause | Solution |
|---------|-------------|----------|
| `Authentication failed: Token missing` | No `Authorization` header sent | Ensure frontend sends `Bearer <token>` |
| `401 Authentication failed` | Expired or malformed JWT | Re-login to get a fresh token |
| `403 Unauthorized: Role mismatch` | Student accessing Admin-only route | Use correct role credentials |
| `409 Conflict` on registration | Duplicate email or studentId | Use a unique email/ID |
| `Invalid inputs passed` | Request body fails express-validator | Check required fields and formats |
| Images not loading | CORS misconfiguration | Ensure `CORS_ORIGIN` matches frontend URL |
| MongoDB connection refused | Wrong `MONGOURL` or MongoDB not running | Verify connection string and DB status |
| Email not sent | Invalid SMTP credentials or blocked port | Check `.env` email config; try port 465/587 |
| `uploads/images` directory missing | First-time run without the directory | The app auto-creates it on startup |

---

## Contribution Guide

### Branching Strategy

```
main              ← Production-ready code
  └─ develop      ← Integration branch
       ├─ feature/student-bulk-import
       ├─ fix/login-rate-limit
       └─ chore/update-dependencies
```

- All feature work branches off `develop`
- Use `feature/`, `fix/`, `chore/` prefixes
- Never commit directly to `main`

### Pull Request Workflow

1. **Branch** off `develop` with a descriptive name
2. **Implement** changes with focused, atomic commits
3. **Format** code: `cd oltp-frontend && npm run pretty`
4. **Test** locally (manual API + `npm test`)
5. **Open PR** against `develop` with:
   - Description of what was changed and why
   - Steps to test
   - Screenshots (for UI changes)
6. **Request review** from at least one team member
7. **Merge** after approval — squash merge to keep history clean

---

## Glossary

| Term | Definition |
|------|------------|
| **OLTP** | Online Test Learning Platform — the overall system |
| **Admin** | Privileged user role with full system management access |
| **Student** | Learner role; can take tests and view results |
| **JWT** | JSON Web Token — stateless authentication credential |
| **Batch** | A cohort/group of students (e.g., "Batch 2026") |
| **Category** | Exam category (e.g., "UPSC", "GATE") with associated subjects |
| **Question Paper** | A set of questions with scoring configuration |
| **paperId** | Human-readable string ID for a question paper |
| **Test** | A scheduled instance of a question paper for a batch |
| **testId** | Human-readable string ID for a test |
| **MCQ** | Multiple Choice Question — one correct option |
| **MSQ** | Multi-Select Question — multiple correct options |
| **NAT** | Numerical Answer Type — numeric range answer |
| **Score** | A student's complete recorded attempt for one test |
| **Leaderboard** | Ranked list of students by score for a given test |
| **Normalized Email** | Lowercase + alias-stripped email for duplicate detection |
| **Rate Limiter** | Middleware that caps requests per IP to prevent abuse |
| **bcryptjs** | Password hashing library with cost-factor salt rounds |
| **Multer** | Node.js middleware for handling multipart/form-data (file uploads) |
| **Helmet** | Express middleware that sets secure HTTP response headers |
| **Mongoose** | MongoDB ODM — provides schema, validation, and querying |

---

## Appendix

### Additional References

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [JSON Web Tokens (JWT)](https://jwt.io/introduction)
- [React Router v6 Docs](https://reactrouter.com/en/main)
- [Ant Design Component Library](https://ant.design/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [ApexCharts React](https://apexcharts.com/docs/react-charts/)
- [Nodemailer Documentation](https://nodemailer.com/)
- [express-validator Documentation](https://express-validator.github.io/docs/)
- [Multer Documentation](https://github.com/expressjs/multer)
- [Helmet.js Documentation](https://helmetjs.github.io/)

### Supporting Documents

- `backend/.env.store` — example environment variable template (do not commit real secrets)
- `backend/scripts/` — utility/seed scripts for database initialization
- `oltp-frontend/tailwind.config.js` — Tailwind CSS configuration and theme extensions
- `oltp-frontend/prettier.config.js` — Prettier formatting rules
