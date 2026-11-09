
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  UserCircle,
  LogOut,
  GraduationCap,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function StudentLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", path: "/student", icon: LayoutDashboard },
    { name: "My Courses", path: "/student/courses", icon: BookOpen },
    { name: "My Profile", path: "/student/profile", icon: UserCircle },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-5 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 hover:bg-slate-100 lg:hidden"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 p-2 text-white">
              <GraduationCap size={22} />
            </div>
            <span className="text-xl font-bold text-slate-800">EduSphere</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
            <p className="text-xs text-slate-500">Student</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 font-bold text-amber-700">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
        </div>
      </header>

      <div className="flex">
        {mobileOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        <aside
          className={`fixed top-16 z-20 flex h-[calc(100vh-4rem)] w-64 flex-col border-r bg-white p-4 transition-transform lg:sticky lg:top-16 lg:z-10 lg:translate-x-0 ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <p className="mb-4 px-3 text-xs font-bold uppercase tracking-wider text-slate-400">
            Student Portal
          </p>

          <nav className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/student"}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      isActive
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-orange-100"
                        : "text-slate-600 hover:bg-amber-50 hover:text-orange-700"
                    }`
                  }
                >
                  <Icon size={19} />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-auto border-t pt-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
            >
              <LogOut size={19} />
              Logout
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
