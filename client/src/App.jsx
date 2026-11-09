
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import AdminLayout from "./components/AdminLayout";
import StudentLayout from "./components/StudentLayout";
import FacultyLayout from "./components/FacultyLayout";

import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import FacultyDashboard from "./pages/FacultyDashboard";
import StudentDashboard from "./pages/StudentDashboard";

import Colleges from "./pages/Colleges";
import Departments from "./pages/Departments";
import Courses from "./pages/Courses";
import Faculty from "./pages/Faculty";
import Students from "./pages/Students";

import StudentCourses from "./pages/StudentCourses";
import StudentProfile from "./pages/StudentProfile";
import FacultyCourses from "./pages/FacultyCourses";
import FacultyStudents from "./pages/FacultyStudents";
import FacultyProfile from "./pages/FacultyProfile";
import FacultyStudentDetails from "./pages/FacultyStudentDetails";
import FacultyCourseAssignments from "./pages/FacultyCourseAssignments";
import StudentEnrollment from "./pages/StudentEnrollment";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="colleges" element={<Colleges />} />
              <Route path="departments" element={<Departments />} />
              <Route path="courses" element={<Courses />} />
              <Route path="faculty" element={<Faculty />} />
              <Route path="students" element={<Students />} />
              <Route path="assignments" element={<FacultyCourseAssignments />} />
              <Route path="enrollments" element={<StudentEnrollment />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["FACULTY"]} />}>
            <Route path="/faculty" element={<FacultyLayout />}>
              <Route index element={<FacultyDashboard />} />
              <Route path="courses" element={<FacultyCourses />} />
              <Route path="students" element={<FacultyStudents />} />
              <Route path="students/:id" element={<FacultyStudentDetails />} />
              <Route path="profile" element={<FacultyProfile />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["STUDENT"]} />}>
            <Route path="/student" element={<StudentLayout />}>
              <Route index element={<StudentDashboard />} />
              <Route path="courses" element={<StudentCourses />} />
              <Route path="profile" element={<StudentProfile />} />
            </Route>
          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
