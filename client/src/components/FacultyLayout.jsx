
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  UserCircle,
  LogOut,
  GraduationCap,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const FacultyLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", path: "/faculty", icon: LayoutDashboard },
    { name: "My Courses", path: "/faculty/courses", icon: BookOpen },
    { name: "My Students", path: "/faculty/students", icon: Users },
    { name: "My Profile", path: "/faculty/profile", icon: UserCircle },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const sidebar = (
    <>
      <div className="flex h-20 items-center gap-3 border-b border-teal-100 px-6">
        <div className="rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 p-2 text-white">
          <GraduationCap size={25} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800">EduSphere</h1>
          <p className="text-xs font-medium text-teal-600">Faculty Portal</p>
        </div>
      </div>

      <div className="border-b border-slate-100 p-5">
        <div className="flex items-center gap-3 rounded-xl bg-teal-50 p-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 font-bold text-white">
            {user?.name?.charAt(0)?.toUpperCase() || "F"}
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-800">
              {user?.name || "Faculty"}
            </p>
            <p className="text-xs text-teal-600">Faculty Member</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/faculty"}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition ${
                  isActive
                    ? "bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-md shadow-teal-100"
                    : "text-slate-600 hover:bg-teal-50 hover:text-teal-700"
                }`
              }
            >
              <Icon size={20} />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-slate-100 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 font-medium text-red-600 transition hover:bg-red-50"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col border-r border-teal-100 bg-white lg:flex">
        {sidebar}
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-teal-100 bg-white transition-transform lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-end p-3">
          <button onClick={() => setMobileOpen(false)}>
            <X size={22} />
          </button>
        </div>
        {sidebar}
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-100 bg-white/90 px-5 backdrop-blur">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-slate-600 hover:bg-teal-50 lg:hidden"
          >
            <Menu size={22} />
          </button>

          <p className="font-semibold text-slate-700">Faculty Workspace</p>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-100 font-bold text-teal-700">
            {user?.name?.charAt(0)?.toUpperCase() || "F"}
          </div>
        </header>

        <main className="min-h-[calc(100vh-64px)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default FacultyLayout;
