
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import {
  BookOpen,
  Users,
  GraduationCap,
  RefreshCw,
  Sparkles,
  ArrowRight,
  CalendarDays,
  ClipboardList,
} from "lucide-react";

export default function FacultyDashboard() {
  const { user } = useAuth();

  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/dashboard/faculty");
      setData(response.data.stats || response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load faculty dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const stats = [
    {
      title: "My Courses",
      value: data.courses ?? 0,
      icon: BookOpen,
      color: "from-teal-500 to-emerald-500",
      link: "/faculty/courses",
    },
    {
      title: "Total Students",
      value: data.students ?? 0,
      icon: Users,
      color: "from-indigo-500 to-violet-500",
      link: "/faculty/students",
    },
    {
      title: "Department",
      value:
        typeof data.department === "object"
          ? data.department?.name || "Assigned"
          : data.department || "Assigned",
      icon: GraduationCap,
      color: "from-amber-500 to-orange-500",
      link: "/faculty/profile",
    },
  ];

  const quickLinks = [
    {
      title: "Manage Courses",
      description: "Explore your department courses.",
      icon: BookOpen,
      link: "/faculty/courses",
      color: "bg-teal-100 text-teal-700",
    },
    {
      title: "View Students",
      description: "See students in your department.",
      icon: Users,
      link: "/faculty/students",
      color: "bg-indigo-100 text-indigo-700",
    },
    {
      title: "My Profile",
      description: "View your faculty information.",
      icon: ClipboardList,
      link: "/faculty/profile",
      color: "bg-amber-100 text-amber-700",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/50 p-6">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Welcome */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-500 p-8 text-white shadow-xl shadow-teal-200/50">
          <div className="relative z-10">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur">
              <Sparkles size={16} />
              Faculty Workspace
            </div>

            <h1 className="text-3xl font-bold sm:text-4xl">
              Welcome back, {user?.name || "Faculty"}!
            </h1>

            <p className="mt-3 max-w-xl text-teal-50">
              Manage your courses, explore your students, and stay connected
              with your academic department.
            </p>

            <Link
              to="/faculty/courses"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-teal-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-teal-50"
            >
              Explore My Courses
              <ArrowRight size={18} />
            </Link>
          </div>

          <GraduationCap
            size={180}
            className="absolute -right-8 -bottom-10 text-white/10"
          />
        </div>

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Academic Overview
            </h2>
            <p className="mt-1 text-slate-500">
              Your academic workspace at a glance.
            </p>
          </div>

          <button
            onClick={loadDashboard}
            className="flex items-center gap-2 rounded-xl border border-teal-100 bg-white px-4 py-3 font-semibold text-teal-700 shadow-sm transition hover:bg-teal-50"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-teal-100 bg-white p-12 text-center text-teal-600">
            Loading dashboard...
          </div>
        ) : error ? (
          <div className="rounded-2xl bg-red-50 p-6 text-red-600">
            {error}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {stats.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  to={item.link}
                  key={item.title}
                  className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`rounded-2xl bg-gradient-to-br ${item.color} p-4 text-white shadow-lg`}
                    >
                      <Icon size={25} />
                    </div>
                    <ArrowRight
                      size={20}
                      className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-teal-600"
                    />
                  </div>

                  <p className="mt-6 text-sm font-medium text-slate-500">
                    {item.title}
                  </p>

                  <h3 className="mt-2 break-words text-2xl font-bold text-slate-800">
                    {item.value}
                  </h3>
                </Link>
              );
            })}
          </div>
        )}

        {/* Quick Access */}
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Quick Access
          </h2>
          <p className="mt-1 text-slate-500">
            Jump directly to your academic workspace.
          </p>

          <div className="mt-5 grid gap-5 md:grid-cols-3">
            {quickLinks.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  to={item.link}
                  key={item.title}
                  className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className={`rounded-xl p-3 ${item.color}`}>
                      <Icon size={24} />
                    </div>
                    <ArrowRight
                      size={20}
                      className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-teal-600"
                    />
                  </div>

                  <h3 className="mt-5 font-bold text-slate-800">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    {item.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Academic Activity */}
        <div className="rounded-2xl border border-teal-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-teal-100 p-3 text-teal-700">
              <CalendarDays size={24} />
            </div>
            <div>
              <h2 className="font-bold text-slate-800">
                Academic Workspace
              </h2>
              <p className="text-sm text-slate-500">
                Your teaching and academic management space.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
