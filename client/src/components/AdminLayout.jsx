
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
  Sparkles,
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
    <div className="min-h-screen bg-[#faf9ff]">
      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between bg-[#f3efff] border-b border-purple-100 px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-purple-400 flex items-center justify-center text-white">
            <Sparkles size={18} />
          </div>
          <h1 className="text-xl font-bold text-violet-700">EduSphere</h1>
        </div>
        <button
          onClick={() => setMobileMenu(!mobileMenu)}
          className="p-2 rounded-xl text-violet-700 hover:bg-white/70"
        >
          {mobileMenu ? <X /> : <Menu />}
        </button>
      </header>

      {/* Colorful Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64
        bg-gradient-to-b from-[#f0eaff] via-[#f8f3ff] to-[#fff0e8]
        border-r border-purple-100/80 flex flex-col
        transition-transform duration-300 ${
          mobileMenu ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Brand */}
        <div className="hidden lg:block px-6 py-6 border-b border-purple-100/80">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-400 flex items-center justify-center text-white shadow-lg shadow-purple-200">
              <Sparkles size={21} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-violet-700">
                EduSphere
              </h1>
              <p className="text-xs text-violet-500 mt-0.5">
                College Management System
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="px-4 py-6">
          <p className="text-[11px] font-bold text-violet-400 uppercase tracking-[0.15em] mb-4 px-3">
            Administration
          </p>

          <nav className="space-y-1.5">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/admin"}
                  onClick={() => setMobileMenu(false)}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-violet-600 to-purple-500 text-white shadow-md shadow-purple-200/70"
                        : "text-slate-600 hover:bg-white/75 hover:text-violet-700 hover:translate-x-0.5"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={19}
                        strokeWidth={isActive ? 2.3 : 1.8}
                        className={
                          isActive
                            ? "text-white"
                            : "text-violet-500 group-hover:text-violet-700"
                        }
                      />
                      <span className="flex-1">{item.name}</span>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-300" />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile */}
        <div className="mt-auto p-4 border-t border-purple-100/80">
          <div className="rounded-2xl bg-white/70 backdrop-blur-sm border border-white p-3.5 mb-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 shrink-0 rounded-xl bg-gradient-to-br from-violet-200 to-orange-100 text-violet-700 flex items-center justify-center font-bold text-lg shadow-sm">
                {user?.name?.charAt(0)?.toUpperCase() || "A"}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm text-slate-800 truncate">
                  {user?.name || "Admin"}
                </p>
                <p className="text-xs text-violet-500 mt-0.5">Administrator</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-100/80 transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileMenu && (
        <div
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-[2px] z-30 lg:hidden"
          onClick={() => setMobileMenu(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        {/* Top Header */}
        <div className="hidden lg:flex items-center justify-between bg-white/90 backdrop-blur-sm border-b border-purple-100 px-8 py-5">
          <div>
            <p className="text-sm text-slate-500">Welcome back,</p>
            <h2 className="text-xl font-semibold text-slate-800">
              {user?.name || "Admin"}
            </h2>
          </div>
          <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 text-xs font-bold tracking-wide border border-purple-100">
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
