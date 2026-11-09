
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  UserCircle,
  LogOut,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const navigation = [
  { name: "Dashboard", path: "/student", icon: LayoutDashboard },
  { name: "My Courses", path: "/student/courses", icon: BookOpen },
  { name: "My Profile", path: "/student/profile", icon: UserCircle },
];

export default function StudentLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#fffaf6]">
      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100 px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-sm">
            <Sparkles size={18} />
          </div>
          <h1 className="text-xl font-bold text-orange-700">EduSphere</h1>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl text-orange-700 hover:bg-white/80 transition"
        >
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </header>

      {/* Student Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64
        bg-gradient-to-b from-[#fff1e6] via-[#fff8f1] to-[#fffdf8]
        border-r border-orange-100/80 flex flex-col
        transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Brand */}
        <div className="hidden lg:block px-6 py-6 border-b border-orange-100/80">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-white shadow-lg shadow-orange-200/70">
              <Sparkles size={21} />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-orange-700">
                EduSphere
              </h1>
              <p className="text-xs text-orange-500 mt-0.5">
                College Management System
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="px-4 py-6">
          <p className="text-[11px] font-bold text-orange-400 uppercase tracking-[0.15em] mb-4 px-3">
            Student Portal
          </p>

          <nav className="space-y-1.5">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/student"}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-200/70"
                        : "text-slate-600 hover:bg-white/80 hover:text-orange-700 hover:translate-x-0.5"
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
                            : "text-orange-400 group-hover:text-orange-700"
                        }
                      />

                      <span className="flex-1">{item.name}</span>

                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-200" />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile */}
        <div className="mt-auto p-4 border-t border-orange-100/80">
          <div className="rounded-2xl bg-white/75 backdrop-blur-sm border border-orange-100/70 p-3.5 mb-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 shrink-0 rounded-xl bg-gradient-to-br from-orange-200 to-amber-100 text-orange-700 flex items-center justify-center font-bold text-lg shadow-sm">
                {user?.name?.charAt(0)?.toUpperCase() || "S"}
              </div>

              <div className="min-w-0">
                <p className="font-semibold text-sm text-slate-800 truncate">
                  {user?.name || "Student"}
                </p>
                <p className="text-xs text-orange-500 mt-0.5">Student</p>
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
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-[2px] z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        {/* Top Header */}
        <div className="hidden lg:flex items-center justify-between bg-gradient-to-r from-orange-50/80 via-white to-amber-50/80 backdrop-blur-sm border-b border-orange-100 px-8 py-5">
          <div>
            <p className="text-sm text-slate-500">Welcome back,</p>
            <h2 className="text-xl font-semibold text-slate-800">
              {user?.name || "Student"}
            </h2>
          </div>

          <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 text-xs font-bold tracking-wide border border-orange-100">
            STUDENT PORTAL
          </span>
        </div>

        <div className="p-5 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
