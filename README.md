# 🎓 EduSphere

### Smarter Campus Management — One Platform for Students, Faculty & Administration

A full-stack college management system that brings **administration, faculty, and students** into one connected digital campus.

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)

---

## ✨ Features

| Module | Description |
|---|---|
| 🔐 Authentication | Role-based login for Admin, Faculty, and Student with JWT |
| 🏫 College Management | Manage colleges, departments, courses, faculty & students |
| 📚 Course Assignment | Assign faculty to courses & enroll students |
| 💰 Fee Management | Assign fees, track payments, mark paid, generate receipts |
| 💼 Opportunities | Placements, internships, scholarships & workshops with applications |
| 🎭 Clubs & Events | Create clubs, join/leave, create events, register/unregister |
| 🎓 Alumni Network | Alumni directory + self-enrollment with admin approval |
| 📊 Analytics Dashboard | Role-wise insights and statistics |

---

## 🛠️ Tech Stack

**Frontend**
- React 18 + Vite
- Tailwind CSS
- Framer Motion
- React Router DOM
- Axios
- Lucide React (icons)

**Backend**
- Node.js + Express
- PostgreSQL + Prisma ORM
- JWT Authentication + bcrypt
- Role-based middleware

---

## 📁 Project Structure
EduSphere/
├── client/ # React frontend
│ ├── src/
│ │ ├── components/ # Layouts & reusable UI
│ │ ├── context/ # Auth context
│ │ ├── lib/ # Axios instance
│ │ └── pages/ # All pages (admin/faculty/student)
│ └── package.json
│
└── server/ # Express backend
├── controllers/ # Business logic
├── middleware/ # Auth & role checks
├── prisma/
│ └── schema.prisma # Database schema
├── routes/ # API routes
├── lib/
│ └── prisma.js # Prisma client
└── package.json

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL
- npm / yarn

### 1️⃣ Clone the repository

```bash
git clone <your-repo-url>
cd EduSphere
2️⃣ Setup Backend
bash
cd server
npm install
Create .env file in server/:

env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/edusphere"
JWT_SECRET="your_super_secret_key"
PORT=5000
Run migrations & generate Prisma client:

bash
npx prisma migrate dev
npx prisma generate
Start backend:

bash
npm run dev
Backend runs at http://localhost:5000

3️⃣ Setup Frontend
bash
cd ../client
npm install
npm run dev
Frontend runs at http://localhost:5173

🔑 Default Routes
Role	URL
Landing Page	/
Login	/login
Admin Panel	/admin
Faculty Panel	/faculty
Student Panel	/student
Alumni Self-Enroll	/alumni/join
🔌 API Endpoints (Overview)
text
POST   /api/auth/login

# Core
GET/POST/PUT/DELETE  /api/colleges
GET/POST/PUT/DELETE  /api/departments
GET/POST/PUT/DELETE  /api/courses
GET/POST/PUT/DELETE  /api/faculty
GET/POST/PUT/DELETE  /api/students
GET/POST/PUT/DELETE  /api/assignments
GET/POST/PUT/DELETE  /api/enrollments

# Fees
GET/POST/PUT/DELETE  /api/fees
GET                  /api/fees/my
PUT                  /api/fees/:id/pay

# Opportunities
GET/POST/PUT/DELETE  /api/opportunities
POST                 /api/opportunities/:id/apply

# Clubs
GET/POST/PUT/DELETE  /api/clubs
POST                 /api/clubs/:id/join
DELETE               /api/clubs/:id/leave

# Events
GET/POST/PUT/DELETE  /api/events
POST                 /api/events/:id/register
DELETE               /api/events/:id/register

# Alumni
POST                 /api/alumni/request        (public)
GET                  /api/alumni/public-options  (public)
GET                  /api/alumni
GET                  /api/alumni/requests
PUT                  /api/alumni/requests/:id/approve
PUT                  /api/alumni/requests/:id/reject
🗄️ Database Models
Admin · College · Department · Student · Faculty · Course
FacultyCourse · StudentCourse · Fee · Opportunity · OpportunityApplication
Club · ClubMember · Event · EventRegistration · Alumni · AlumniRequest

🎨 Design System
Each role has a distinct color palette for a clear, role-based experience:

   Role	         Theme	            Gradient
🛡️ Admin	   Purple / Violet     	#312e81 → #7c3aed
🌱 Faculty	  Emerald / Teal	    #10b981 → #14b8a6
🍊 Student	  Orange / Amber     	#f97316 → #f59e0b
🌐 Public	  Amber / Orange    	#f59e0b → #f97316

✅ Completed Modules
☑ Authentication & Role-based Access
☑ Profile Management (Admin / Faculty / Student)
☑ Analytics & Insights Dashboards
☑ Fee Management (with receipts)
☑ Opportunities (placements, internships, scholarships)
☑ Clubs & Events
☑ Alumni Network (with approval workflow)
☑ UI Integration & Responsive Design

🧪 Testing Checklist
Manual E2E testing covered for:

Auth & protected routes

CRUD operations across all modules

Fee payment + receipt printing

Opportunity applications + status changes

Club join/leave + member viewing

Event registration + cancellation

Alumni request → approval → directory

Responsive UI across devices

🤝 Contributing
Contributions, issues, and feature requests are welcome!
Feel free to fork this project and submit a pull request.

📄 License
This project is open-source and available under the MIT License.

🌟 If you found this project helpful, give it a star!
EduSphere · Smarter Campus Management

