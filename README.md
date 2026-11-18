# EduSphere — Smarter Campus Management

EduSphere is a full-stack college management system designed to bring administration, faculty, and students into one connected digital campus. It simplifies academic operations, fee tracking, campus events, and alumni networking in a single unified platform.

🔗 **Live Demo:** [Open EduSphere](https://edu-sphere-six.vercel.app/)  
💻 **GitHub Repository:** [View Source Code](https://github.com/Anchal-Gola/EduSphere)  
🎥 **Demo Video:** [Watch the Walkthrough](https://drive.google.com/file/d/1RuKImY4MIDjJjoejiNrIxbE7Sa9dU1Zo/view?usp=drive_link)

---

## ✨ Features

- **Role-Based Authentication** — Secure JWT login for Admin, Faculty, and Student portals.
- **Admin Dashboard** — Centralized control to manage colleges, departments, courses, faculty, and students.
- **Student Management** — Complete student profiles, enrollment tracking, and academic records.
- **Fee Management** — Assign fees, track payments, mark as paid, and generate printable receipts.
- **Opportunities Board** — Post and apply for placements, internships, scholarships, and workshops.
- **Clubs & Events** — Create clubs, join/leave memberships, and manage event registrations.
- **Alumni Network** — Directory to view alumni, plus a public self-enrollment form with an admin approval workflow.
- **Analytics & Insights** — Role-specific dashboards providing quick campus statistics.
- **Responsive UI** — Distinct and modern color themes for each portal (Purple for Admin, Emerald for Faculty, Orange for Students).

---

## 🛠️ Tech Stack

### Frontend
- React 18
- JavaScript
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Framer Motion
- Lucide React

### Backend
- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- JWT Authentication
- bcrypt

### Deployment
- **Frontend:** Vercel
- **Backend:** Render
- **Database:** Prisma Postgres (Cloud)

---

## 🏗️ Architecture

EduSphere follows a clean separation of concerns, routing requests through a structured backend.

**Request Flow:**

`Client → Route → Controller → Prisma Client → PostgreSQL`

- **Routes:** Define API endpoints and attach role-based middleware.
- **Controllers:** Handle incoming requests, business logic, and responses.
- **Prisma Client:** Manages database queries and relations.
- **Database:** PostgreSQL schema modeling all entities, including Users, Fees, Events, Alumni, and more.

---

## 🚀 Run Locally

### Prerequisites

- Node.js and npm
- PostgreSQL database (local or cloud)
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Anchal-Gola/EduSphere.git
cd EduSphere
```

### 2. Set Up the Backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/edusphere"
JWT_SECRET="your_secure_jwt_secret"
PORT=5000
```

Run database migrations and generate the Prisma Client:

```bash
npx prisma migrate dev
npx prisma generate
```

Start the backend:

```bash
npm run dev
```

### 3. Set Up the Frontend

Open another terminal from the project root:

```bash
cd client
npm install
```

Create a `.env` file inside the `client` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔐 Environment Variables

Keep credentials and secrets private.

- Never commit `.env` files.
- Never expose `JWT_SECRET` or `DATABASE_URL` in frontend code.
- Configure environment variables in Vercel and Render for production.
- Ensure backend CORS settings allow requests from your deployed frontend URL.

---

## 🎥 Project Demo

Watch the complete walkthrough to explore EduSphere's features and functionality.

[▶ Watch EduSphere Demo Video](https://drive.google.com/file/d/1RuKImY4MIDjJjoejiNrIxbE7Sa9dU1Zo/view?usp=drive_link)

---

## 📸 Screenshots

### 1. Landing Page
The entry point for all users, featuring a modern design and quick access to different portals.

![EduSphere Landing Page](./screenshots/landingPage.png)

### 2. Login Portal
Unified login page with role-based access for Admin, Faculty, and Student.

![EduSphere Login Portal](./screenshots/login.png)

### 3. Admin Dashboard
Complete overview of campus analytics, departments, and growth metrics.

![EduSphere Admin Dashboard](./screenshots/adminDashboard.png)

### 4. Faculty Dashboard
Faculty workspace to manage courses, view students, and track credits.

![EduSphere Faculty Dashboard](./screenshots/facultyDashboard.png)

### 5. Student Dashboard
Student portal to access enrolled courses, fees, opportunities, and events.

![EduSphere Student Dashboard](./screenshots/studentDashboard.png)

---

## 🎯 Project Goal

EduSphere aims to provide a unified digital workspace where educational institutions can streamline operations, faculty can manage their courses, and students can easily access their academic information, events, and opportunities.

---

## 👩‍💻 Developer

**Anchal Gola**

- **GitHub:** [Anchal-Gola](https://github.com/Anchal-Gola)
- **Project Repository:** [EduSphere](https://github.com/Anchal-Gola/EduSphere)

Built as a hands-on full-stack development project.
