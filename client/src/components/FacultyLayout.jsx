
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  UserCircle,
  LogOut,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const navigation = [
  { name: "Dashboard", path: "/faculty", icon: LayoutDashboard },
  { name: "My Courses", path: "/faculty/courses", icon: BookOpen },
  { name: "My Students", path: "/faculty/students", icon: Users },
  { name: "My Profile", path: "/faculty/profile", icon: UserCircle },
];

const FacultyLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#f7fcfa]">
      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100 px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-sm">
            <Sparkles size={18} />
          </div>
          <h1 className="text-xl font-bold text-emerald-700">EduSphere</h1>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl text-emerald-700 hover:bg-white/80 transition"
        >
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </header>

      {/* Faculty Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64
        bg-gradient-to-b from-[#e8faf3] via-[#f3fcf8] to-[#f8fffb]
        border-r border-emerald-100/80 flex flex-col
        transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Brand */}
        <div className="hidden lg:block px-6 py-6 border-b border-emerald-100/80">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-200/70">
              <Sparkles size={21} />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-emerald-700">
                EduSphere
              </h1>
              <p className="text-xs text-emerald-500 mt-0.5">
                College Management System
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="px-4 py-6">
          <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-[0.15em] mb-4 px-3">
            Faculty Portal
          </p>

          <nav className="space-y-1.5">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/faculty"}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-200/70"
                        : "text-slate-600 hover:bg-white/80 hover:text-emerald-700 hover:translate-x-0.5"
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
                            : "text-emerald-500 group-hover:text-emerald-700"
                        }
                      />

                      <span className="flex-1">{item.name}</span>

                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-200" />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile */}
        <div className="mt-auto p-4 border-t border-emerald-100/80">
          <div className="rounded-2xl bg-white/75 backdrop-blur-sm border border-emerald-100/70 p-3.5 mb-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 shrink-0 rounded-xl bg-gradient-to-br from-emerald-200 to-teal-100 text-emerald-700 flex items-center justify-center font-bold text-lg shadow-sm">
                {user?.name?.charAt(0)?.toUpperCase() || "F"}
              </div>

              <div className="min-w-0">
                <p className="font-semibold text-sm text-slate-800 truncate">
                  {user?.name || "Faculty"}
                </p>
                <p className="text-xs text-emerald-500 mt-0.5">
                  Faculty Member
                </p>
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
        <div className="hidden lg:flex items-center justify-between bg-gradient-to-r from-emerald-50/80 via-white to-teal-50/80 backdrop-blur-sm border-b border-emerald-100 px-8 py-5">
          <div>
            <p className="text-sm text-slate-500">Welcome back,</p>
            <h2 className="text-xl font-semibold text-slate-800">
              {user?.name || "Faculty"}
            </h2>
          </div>

          <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 text-xs font-bold tracking-wide border border-emerald-100">
            FACULTY PORTAL
          </span>
        </div>

        <div className="p-5 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default FacultyLayout;
