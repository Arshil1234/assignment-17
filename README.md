# Student Management System (CRUD)

A full-stack, responsive Student Management System built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **MongoDB with Mongoose**.

---

## 🚀 Features

- **Full CRUD Capabilities:**
  - **Create:** Add new students with field validation and immediate feedback.
  - **Read:** Organized, responsive table with real-time search, department filtering, and formatted dates.
  - **Update:** Edit existing students with pre-filled forms and conflict-free email updating.
  - **Delete:** Safe deletion with confirmation dialog and immediate UI updates.
- **Modern Dashboard UI:**
  - Professional light theme with white cards, subtle shadows, and clean typography.
  - Live statistics: Total Students, Departments Represented, and Latest Registered Student.
  - Responsive layout with desktop sidebar, mobile header, and horizontal scroll tables.
  - Animated loading skeletons, empty states, and dismissible toast notifications.
- **Robust Next.js Route Handlers:**
  - `GET /api/students` — Fetch all students
  - `POST /api/students` — Create new student
  - `GET /api/students/[id]` — Fetch student by ID
  - `PATCH /api/students/[id]` — Update student by ID
  - `DELETE /api/students/[id]` — Delete student by ID
- **Database Safety & Architecture:**
  - Reusable cached MongoDB connection pattern preventing connection exhaustion.
  - Fast failover and timeout guard (fails fast with HTTP 503 instead of hanging).
  - ObjectId validation on all dynamic routes (returns HTTP 400 for malformed IDs).
  - Unique email enforcement with HTTP 409 Conflict handling for duplicate keys.
  - Credentials kept strictly on the server (`.env.local`).

---

## 🛠️ Technology Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **Database:** MongoDB
- **ORM / ODM:** Mongoose 8
- **Backend:** Next.js Route Handlers (`src/app/api/...`)

---

## 📁 Project Structure

```
d:\Assignment-17\
├── src\
│   ├── app\
│   │   ├── api\
│   │   │   └── students\
│   │   │       ├── route.ts            # GET (all students), POST (create student)
│   │   │       └── [id]\
│   │   │           └── route.ts        # GET (one), PATCH (update), DELETE (delete)
│   │   ├── globals.css                 # Global styling & Tailwind directives
│   │   ├── layout.tsx                  # Root layout with fonts & metadata
│   │   └── page.tsx                    # Main Student Management Dashboard
│   ├── components\
│   │   ├── DeleteConfirmModal.tsx      # Modal dialog for delete confirmation
│   │   ├── Header.tsx                  # Dashboard header with action buttons
│   │   ├── Icons.tsx                   # Lightweight SVG icon collection
│   │   ├── Sidebar.tsx                 # Navigation sidebar & system status
│   │   ├── StatsOverview.tsx           # Stat cards (students, depts, latest)
│   │   ├── StudentFormModal.tsx        # Add / Edit student modal with validation
│   │   ├── StudentTable.tsx            # Data table with search, filters & actions
│   │   └── ToastNotification.tsx       # Toast notifications (success & error)
│   ├── lib\
│   │   ├── db.ts                       # Cached MongoDB connection utility
│   │   └── validations.ts              # Input & ObjectId validation helpers
│   ├── models\
│   │   └── Student.ts                  # Mongoose Schema & Model definition
│   └── types\
│       └── student.ts                  # TypeScript interfaces and API response types
├── .env.example                        # Template for environment configuration
├── .env.local                          # Local environment variables (MONGODB_URI)
├── package.json
└── tsconfig.json
```

---

## ⚙️ Environment Configuration

Create a `.env.local` file in the project root:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB_NAME=student_management
```

> **Note:** A `.env.example` file is included in the project for reference.

---

## 🏃 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to explore the dashboard.

### 3. Run Type Checking
```bash
npx tsc --noEmit
```

### 4. Build for Production
```bash
npm run build
```

### 5. Start Production Server
```bash
npm start
```

---

## 🧪 Testing CRUD Operations

### 1. Via the Web UI:
1. **Create:** Click the **"Add Student"** button in the header, fill out the form (Name, Email, Phone, Department), and click **"Add Student"**. A success toast will appear and the table will update.
2. **Read:** View all enrolled students in the directory table. Try searching by name or department in the search bar, or filtering by department.
3. **Update:** Click the **Edit** (pencil) icon on any student row. The modal will pre-populate with the current details. Modify any field and click **"Save Changes"**.
4. **Delete:** Click the **Delete** (trash) icon on any student row. A confirmation dialog will prompt you to confirm deletion. Click **"Delete Student"** to permanently remove the record.

### 2. Via REST API (cURL / PowerShell):

#### Create Student (POST):
```bash
curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john.doe@example.com","phone":"+1 555-0199","department":"Computer Science"}'
```

#### Fetch All Students (GET):
```bash
curl http://localhost:3000/api/students
```

#### Fetch Single Student (GET):
```bash
curl http://localhost:3000/api/students/<STUDENT_ID>
```

#### Update Student (PATCH):
```bash
curl -X PATCH http://localhost:3000/api/students/<STUDENT_ID> \
  -H "Content-Type: application/json" \
  -d '{"department":"Software Engineering"}'
```

#### Delete Student (DELETE):
```bash
curl -X DELETE http://localhost:3000/api/students/<STUDENT_ID>
```
