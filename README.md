# CyberStream Backend

Express + TypeScript API backend for CyberStream.

## Getting started

### 1. Clone the repository

```bash
git clone https://github.com/GarrixA/cyberstream_assessment.git
cd cyberstream_assessment
```

### 2. Configure environment

```bash
cp .env-example .env
```

Edit `.env` and set your PostgreSQL connection strings (`DB_DEV_URL`, `DB_TEST_URL`) and secrets (`SESSION_SECRET`, `ACCESS_TOKEN_SECRET`). The default `PORT` is `8000`.

### 3. Install dependencies

```bash
npm install
```

### 4. Prepare the database (local development)

Make sure PostgreSQL is running, then migrate and seed demo data:

```bash
npm run migrate:reset
```

### 5. Start the server

```bash
npm run dev
```

The API will be available at `http://localhost:8000` (or whatever `PORT` you set in `.env`).

## Testing the API

Follow the steps below to verify the backend is running and responding correctly.

### Option A — Run with Docker (recommended)

Docker starts PostgreSQL, runs migrations, seeds demo data, and launches the API.

```bash
cp .env-example .env
# Update DB_DEV_URL and DB_TEST_URL in .env (localhost is rewritten to the postgresdb service automatically)
docker compose up --build
```

Once the containers are healthy, use the `PORT` from your `.env` file (for example `http://localhost:8000`).

### Option B — Run locally

Use the [Getting started](#getting-started) steps above, then continue with the requests below.

### 1. Health check

Confirm the server is up:

```bash
curl http://localhost:8000/health
```

Expected response:

```json
{
  "status": "ok",
  "message": "CyberStream is running"
}
```

### 2. API welcome endpoint

```bash
curl http://localhost:8000/api/v1
```

Expected response:

```json
{
  "message": "Welcome to CyberStream Employee Management API"
}
```

### 3. Login and get a token

Demo users are created by the database seed. All seeded accounts share the password `Password@123`.

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.admin@cyberstream.com",
    "password": "Password@123"
  }'
```

Expected response (truncated):

```json
{
  "status": "SUCCESS",
  "message": "Login successful",
  "data": {
    "token": "<jwt-token>",
    "user": {
      "email": "john.admin@cyberstream.com"
    }
  }
}
```

Save the `token` from the response for authenticated requests.

### 4. Call a protected endpoint

Replace `<token>` with the JWT from the login response:

```bash
curl http://localhost:8000/api/v1/auth/users/me \
  -H "Authorization: Bearer <token>"
```

### 5. Explore the API (recommended: Swagger)

**Swagger UI is the recommended way to test this API.** It lists every endpoint, request body schema, and required headers. After logging in, click **Authorize**, paste your JWT as `Bearer <token>`, and try protected routes directly from the browser.

```
http://localhost:8000/api/v1/docs
```

**Postman** works too. Create a collection, set the `Authorization` header to `Bearer <token>` on protected requests, and use the same URLs and JSON bodies shown in Swagger or in the examples below. You can also import the OpenAPI definition from the docs page if your Postman version supports it.

### JavaScript example

```javascript
const BASE_URL = "http://localhost:8000/api/v1";

async function testCyberStreamApi() {
  const health = await fetch("http://localhost:8000/health");
  console.log("Health:", await health.json());

  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "john.admin@cyberstream.com",
      password: "Password@123",
    }),
  });
  const login = await loginRes.json();
  console.log("Login:", login);

  const meRes = await fetch(`${BASE_URL}/auth/users/me`, {
    headers: { Authorization: `Bearer ${login.data.token}` },
  });
  console.log("Current user:", await meRes.json());
}

testCyberStreamApi();
```

### Demo credentials

| Role     | Email                            | Password       |
|----------|------------------------------------|----------------|
| Admin    | `john.admin@cyberstream.com`     | `Password@123` |
| HR       | `mary.hr@cyberstream.com`        | `Password@123` |
| Manager  | `alex.manager@cyberstream.com`   | `Password@123` |
| Employee | `jane.doe@cyberstream.com`       | `Password@123` |

## How authentication and authorization work

1. **Login** — `POST /api/v1/auth/login` returns a JWT access token. The token is stored server-side and must be sent on every protected request:

   ```
   Authorization: Bearer <token>
   ```

2. **Role** — Each user has one role: `Admin`, `HR`, `Manager`, or `Employee`.

3. **Permissions** — Roles are linked to permission codes (for example `employee.create`, `department.manage`). Route handlers check either:
   - a **permission** (`requirePermission`) — user must hold at least one of the listed permissions, or
   - a **role gate** (`requireAdmin`, `requireAdminOrHr`) — only specific roles may access the route, regardless of other permissions.

4. **Scoped data** — Some roles see only their own records (`employee.read.own`, `attendance.read.own`, `leave.read.own`) or their team (`employee.read.team`), while Admin and HR typically see organization-wide data.

If a user lacks access, the API responds with `403 Forbidden` (`FORBIDDEN` or `PERMISSION_DENIED`).

## API modules

All business routes live under `/api/v1`. Below is what each module does and who can **create** resources.

| Module | Base path | Purpose |
|--------|-----------|---------|
| **Auth** | `/auth` | Login, logout, password reset, profile, user activation |
| **Employees** | `/employees` | Employee records and assignments (role, department, position, manager) |
| **Departments** | `/departments` | Organizational departments |
| **Roles** | `/roles` | Application roles and their permissions |
| **Permissions** | `/permissions` | Permission definitions |
| **Statuses** | `/statuses` | Shared status values (Active, Inactive, etc.) |
| **Positions** | `/positions` | Job positions |
| **Employment types** | `/employment-types` | Full-time, part-time, contract, etc. |
| **Attendance** | `/attendance` | Attendance sessions (auto-started on login) |
| **Leaves** | `/leaves` | Leave requests, approval, and rejection |
| **Payroll** | `/payroll` | Payroll records |
| **Audit logs** | `/audit-logs` | System activity trail |

### Auth (`/api/v1/auth`)

| Action | Who is allowed |
|--------|----------------|
| Login, forgot/reset password | Anyone (no token) |
| Logout, view own profile (`GET /users/me`) | Any authenticated user |
| Update own profile (`PATCH /users/me`) | Users with `employee.update.own` (Employee, and others with that permission) |
| List all users, activate/deactivate users | **Admin only** |
| List managers | **Admin** or **HR** |
| Change password | Any authenticated user |

**Login request:**

```json
{
  "email": "john.admin@cyberstream.com",
  "password": "Password@123"
}
```

**Login response:**

```json
{
  "status": "SUCCESS",
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "attendanceId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "user": {
      "id": "928d59d2-045d-4063-852f-bd7bfc617ca0",
      "email": "john.admin@cyberstream.com",
      "firstName": "John",
      "lastName": "Admin",
      "roleName": "Admin",
      "permissions": ["employee.create", "employee.read.all", "department.manage", "..."]
    }
  }
}
```

### Employees (`/api/v1/employees`)

| Action | Who is allowed |
|--------|----------------|
| **Create** employee | **Admin**, **HR** (`employee.create`) |
| List / view employees | Admin & HR (all), Manager (team), Employee (own profile) |
| Update employee details | Admin & HR (full), Manager (limited team fields), Employee (own limited fields) |
| Assign role, department, position, manager, employment type, status | Admin & HR (`employee.update`) |
| Deactivate employee | Admin & HR (`employee.deactivate`) |

**Not allowed:** Managers and Employees cannot create employees. Employees cannot view or edit other people's records.

**Create employee request** (Admin or HR token):

```json
{
  "firstName": "Test",
  "lastName": "Employee",
  "email": "test.employee@cyberstream.com",
  "phone": "+1234567890",
  "salary": 70000,
  "dateJoined": "2026-01-15"
}
```

**Create employee response:**

```json
{
  "status": "CREATED",
  "message": "Employee created",
  "data": {
    "id": "f8e2a1b0-1234-5678-9abc-def012345678",
    "firstName": "Test",
    "lastName": "Employee",
    "email": "test.employee@cyberstream.com",
    "employeeCode": "EMP-0007",
    "role": null,
    "department": null,
    "position": null
  }
}
```

After creation, use the assign endpoints (`PATCH /employees/:id/assign-role`, `assign-department`, etc.) to link the employee to a role, department, and position.

### Departments (`/api/v1/departments`)

| Action | Who is allowed |
|--------|----------------|
| **Create** / update / assign manager | **Admin**, **HR** (`department.manage`) |
| List / view departments | Admin, HR, and anyone with `employee.read.all` |
| Deactivate department | **Admin only** |

**Not allowed:** Managers and Employees cannot create or manage departments.

**Create department request** (Admin or HR token):

```json
{
  "name": "Product",
  "description": "Product and design team"
}
```

**Create department response:**

```json
{
  "status": "CREATED",
  "message": "Department created",
  "data": {
    "id": "78d7400c-438f-40eb-af8b-b2a56e2fbe43",
    "name": "Product",
    "description": "Product and design team",
    "status": { "name": "Active" },
    "manager": null
  }
}
```

### Roles & permissions (`/api/v1/roles`, `/api/v1/permissions`)

| Action | Who is allowed |
|--------|----------------|
| **Create** / update / delete role | **Admin only** |
| Assign permissions to a role | **Admin only** |
| List roles | Admin (`role.manage`) or users with `employee.read.all` |
| **Create** / update / delete permission | **Admin only** |
| List permissions | Admin (`permission.manage` or `role.manage`) |

**Not allowed:** HR, Manager, and Employee cannot create roles or permissions. HR can still assign an existing role to an employee via `PATCH /employees/:id/assign-role` when they have `employee.update`.

**Create role request** (Admin token):

```json
{
  "name": "Auditor",
  "description": "Read-only access to audit logs"
}
```

### Positions & employment types

| Resource | Create | Who is allowed |
|----------|--------|----------------|
| **Positions** (`/positions`) | `POST /positions` | **Admin** or **HR** |
| Deactivate position | `PATCH /positions/:id/deactivate` | **Admin only** |
| **Employment types** (`/employment-types`) | `POST /employment-types` | **Admin**, **HR** (`department.manage`) |

**Not allowed:** Managers and Employees cannot create positions or employment types.

### Statuses (`/api/v1/statuses`)

| Action | Who is allowed |
|--------|----------------|
| List / view statuses | Any authenticated user |
| **Create** / update / delete status | **Admin only** |

Statuses are shared across employees, departments, roles, and leave workflows.

### Attendance (`/api/v1/attendance`)

| Action | Who is allowed |
|--------|----------------|
| List attendance | Admin, HR, Manager (all records), Employee (own only) |

Attendance is created automatically when a user logs in. There is no manual create endpoint.

### Leaves (`/api/v1/leaves`)

| Action | Who is allowed |
|--------|----------------|
| **Create** leave request | **Admin**, **HR**, **Manager**, **Employee** |
| View leaves | Managers/HR/Admin see broader lists; Employees see their own |
| Approve / reject leave | **Admin**, **HR**, **Manager** (`leave.manage`) |
| Cancel leave | Owner or users with `leave.manage` |

**Not allowed:** Employees cannot approve or reject other people's leave requests.

**Create leave request** (any authenticated user with `leave.read.own` or `leave.manage`):

```json
{
  "leave_name": "Annual Leave",
  "start_date": "2026-07-01",
  "end_date": "2026-07-05",
  "reason": "Family vacation"
}
```

**Create leave response:**

```json
{
  "status": "CREATED",
  "message": "Leave request created",
  "data": {
    "id": "c3d4e5f6-7890-1234-5678-90abcdef1234",
    "leave_name": "Annual Leave",
    "start_date": "2026-07-01",
    "end_date": "2026-07-05",
    "reason": "Family vacation",
    "status": { "name": "Pending" }
  }
}
```

### Payroll (`/api/v1/payroll`)

| Action | Who is allowed |
|--------|----------------|
| **Create** / list / update / delete payroll | **Admin**, **HR** (`payroll.manage`) |

**Not allowed:** Managers and Employees have no payroll access.

### Audit logs (`/api/v1/audit-logs`)

| Action | Who is allowed |
|--------|----------------|
| List audit logs | **Admin only** (`audit.read`) |

Login, profile changes, and other sensitive actions are recorded here.

## Role summary — who can create what

| Resource | Admin | HR | Manager | Employee |
|----------|:-----:|:--:|:-------:|:--------:|
| Employee | Yes | Yes | No | No |
| Department | Yes | Yes | No | No |
| Role | Yes | No | No | No |
| Permission | Yes | No | No | No |
| Status | Yes | No | No | No |
| Position | Yes | Yes | No | No |
| Employment type | Yes | Yes | No | No |
| Leave request | Yes | Yes | Yes | Yes |
| Approve / reject leave | Yes | Yes | Yes | No |
| Payroll record | Yes | Yes | No | No |
| Attendance (manual) | — | — | — | — |

Attendance is started automatically on login; payroll and audit logs are restricted as shown above.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run production build |
| `npm test` | Run tests with coverage |
| `npm run lint` | Run ESLint |
| `npm run migrate` | Run database migrations |
| `npm run seed` | Seed demo data |
| `npm run migrate:reset` | Reset migrations and re-seed |

## Routes

| Route prefix | Description |
|--------------|-------------|
| `GET /` | HTML welcome page |
| `GET /health` | Health check |
| `GET /api/v1` | JSON welcome message |
| `/api/v1/docs` | **Swagger UI (recommended for testing)** |
| `/api/v1/auth` | Authentication and user management |
| `/api/v1/employees` | Employee CRUD and assignments |
| `/api/v1/departments` | Department management |
| `/api/v1/roles` | Role management |
| `/api/v1/permissions` | Permission management |
| `/api/v1/statuses` | Status values |
| `/api/v1/positions` | Position management |
| `/api/v1/employment-types` | Employment type management |
| `/api/v1/attendance` | Attendance records |
| `/api/v1/leaves` | Leave requests |
| `/api/v1/payroll` | Payroll records |
| `/api/v1/audit-logs` | Audit trail (Admin only) |

See [API modules](#api-modules) for permissions and JSON examples.

## Docker

Docker reads your existing `DB_DEV_URL` and `DB_TEST_URL` values. Inside containers, `localhost` is rewritten to the `postgresdb` service automatically.

```bash
docker compose up --build
```
