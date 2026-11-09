
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Building2,
  GraduationCap,
  BookOpen,
  Users,
  UserRound,
  LogOut,
  Menu,
  X,
  ClipboardList,
  UserPlus,
} from "lucide-react";
import { useState } from "react";

const navigation = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { name: "Colleges", path: "/admin/colleges", icon: Building2 },
  { name: "Departments", path: "/admin/departments", icon: GraduationCap },
  { name: "Courses", path: "/admin/courses", icon: BookOpen },
  { name: "Faculty", path: "/admin/faculty", icon: Users },
  { name: "Students", path: "/admin/students", icon: UserRound },
  { name: "Course Assignments", path: "/admin/assignments", icon: ClipboardList },
  { name: "Student Enrollment", path: "/admin/enrollments", icon: UserPlus },
];

function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenu, setMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="lg:hidden flex items-center justify-between bg-white border-b px-5 py-4">
        <h1 className="text-xl font-bold text-indigo-600">EduSphere</h1>
        <button onClick={() => setMobileMenu(!mobileMenu)}>
          {mobileMenu ? <X /> : <Menu />}
        </button>
      </header>

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r flex flex-col transition-transform ${
          mobileMenu ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="hidden lg:block px-6 py-6 border-b">
          <h1 className="text-2xl font-bold text-indigo-600">EduSphere</h1>
          <p className="text-xs text-slate-500 mt-1">
            College Management System
          </p>
        </div>

        <div className="px-4 py-5">
          <p className="text-xs font-semibold text-slate-400 uppercase mb-3 px-3">
            Administration
          </p>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/admin"}
                  onClick={() => setMobileMenu(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition ${
                      isActive
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-slate-600 hover:bg-slate-50"
                    }`
                  }
                >
                  <Icon size={19} />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto border-t p-4">
          <div className="flex items-center gap-3 px-2 mb-4">
            <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate">
                {user?.name || "Admin"}
              </p>
              <p className="text-xs text-slate-500">Administrator</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {mobileMenu && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setMobileMenu(false)}
        />
      )}

      <main className="lg:ml-64 min-h-screen">
        <div className="hidden lg:flex items-center justify-between bg-white border-b px-8 py-5">
          <div>
            <p className="text-sm text-slate-500">Welcome back,</p>
            <h2 className="text-xl font-semibold">{user?.name || "Admin"}</h2>
          </div>
          <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">
            ADMIN PANEL
          </span>
        </div>

        <div className="p-5 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
