
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
      link: "/faculty/courses",
      strip: "from-purple-500 to-violet-500",
      iconColor: "from-purple-500 to-violet-600",
      shadow: "shadow-purple-200",
      hover: "hover:border-purple-200 hover:shadow-purple-100/60",
      arrow: "group-hover:text-purple-600",
    },
    {
      title: "Total Students",
      value: data.students ?? 0,
      icon: Users,
      link: "/faculty/students",
      strip: "from-orange-400 to-pink-500",
      iconColor: "from-orange-500 to-pink-500",
      shadow: "shadow-orange-200",
      hover: "hover:border-orange-200 hover:shadow-orange-100/60",
      arrow: "group-hover:text-orange-600",
    },
    {
      title: "Department",
      value:
        typeof data.department === "object"
          ? data.department?.name || "Assigned"
          : data.department || "Assigned",
      icon: GraduationCap,
      link: "/faculty/profile",
      strip: "from-indigo-500 to-blue-500",
      iconColor: "from-indigo-500 to-blue-600",
      shadow: "shadow-indigo-200",
      hover: "hover:border-indigo-200 hover:shadow-indigo-100/60",
      arrow: "group-hover:text-indigo-600",
    },
  ];

  const quickLinks = [
    {
      title: "Manage Courses",
      description: "Explore and manage your department courses.",
      icon: BookOpen,
      link: "/faculty/courses",
      strip: "from-purple-500 to-violet-500",
      iconColor: "from-purple-500 to-violet-600",
      shadow: "shadow-purple-200",
      hover: "hover:border-purple-200 hover:shadow-purple-100/60",
      arrow: "group-hover:text-purple-600",
    },
    {
      title: "View Students",
      description: "See students enrolled in your department.",
      icon: Users,
      link: "/faculty/students",
      strip: "from-orange-400 to-pink-500",
      iconColor: "from-orange-500 to-pink-500",
      shadow: "shadow-orange-200",
      hover: "hover:border-orange-200 hover:shadow-orange-100/60",
      arrow: "group-hover:text-orange-600",
    },
    {
      title: "My Profile",
      description: "View your faculty information.",
      icon: ClipboardList,
      link: "/faculty/profile",
      strip: "from-emerald-500 to-teal-500",
      iconColor: "from-emerald-500 to-teal-600",
      shadow: "shadow-emerald-200",
      hover: "hover:border-emerald-200 hover:shadow-emerald-100/60",
      arrow: "group-hover:text-emerald-600",
    },
  ];

  return (
    <div className="min-h-full bg-transparent p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-7">

        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-600 p-7 text-white shadow-xl shadow-emerald-200 md:p-9">
          <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-lime-300/20 blur-3xl" />

          <div className="relative z-10">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur-md">
              <Sparkles size={16} />
              Faculty Workspace
            </div>

            <h1 className="text-3xl font-bold sm:text-4xl">
              Welcome back, {user?.name || "Faculty"}!
            </h1>

            <p className="mt-3 max-w-xl text-emerald-50">
              Manage your courses, explore your students, and stay connected
              with your academic department.
            </p>

            <Link
              to="/faculty/courses"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-emerald-800 shadow-lg transition hover:-translate-y-0.5 hover:bg-emerald-50"
            >
              Explore My Courses
              <ArrowRight size={18} />
            </Link>
          </div>

          <GraduationCap
            size={190}
            className="absolute -bottom-10 -right-8 text-white/10"
          />
        </div>

        {/* Academic Overview */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Academic Overview
            </h2>
            <p className="mt-1 text-slate-500">
              Your academic workspace at a glance.
            </p>
          </div>

          <button
            onClick={loadDashboard}
            className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-white px-4 py-3 font-semibold text-emerald-700 shadow-sm transition hover:bg-emerald-50"
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        {loading ? (
          <div className="rounded-2xl border border-emerald-100 bg-white py-20 text-center text-emerald-600 shadow-sm">
            <RefreshCw size={28} className="mx-auto mb-3 animate-spin" />
            Loading dashboard...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-600">
            {error}
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-3">
            {stats.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  to={item.link}
                  key={item.title}
                  className={`group relative overflow-hidden rounded-2xl border border-purple-100 bg-white/95 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl ${item.hover}`}
                >
                  <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${item.strip}`} />

                  <div className="flex items-center justify-between">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${item.iconColor} text-white shadow-md ${item.shadow}`}>
                      <Icon size={24} />
                    </div>

                    <ArrowRight
                      size={20}
                      className={`text-slate-300 transition group-hover:translate-x-1 ${item.arrow}`}
                    />
                  </div>

                  <p className="mt-5 text-sm font-medium text-slate-500">
                    {item.title}
                  </p>

                  <h3 className="mt-2 break-words text-2xl font-bold text-slate-900">
                    {item.value}
                  </h3>

                  <p className="mt-2 text-xs text-slate-400">
                    View details →
                  </p>
                </Link>
              );
            })}
          </div>
        )}

        {/* Quick Access */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
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
                  className={`group relative overflow-hidden rounded-2xl border border-purple-100 bg-white/95 p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl ${item.hover}`}
                >
                  <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${item.strip}`} />

                  <div className="flex items-center justify-between">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${item.iconColor} text-white shadow-md ${item.shadow}`}>
                      <Icon size={23} />
                    </div>

                    <ArrowRight
                      size={20}
                      className={`text-slate-300 transition group-hover:translate-x-1 ${item.arrow}`}
                    />
                  </div>

                  <h3 className="mt-5 font-bold text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    {item.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Academic Workspace */}
        <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-50 blur-2xl" />

          <div className="relative flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-200">
              <CalendarDays size={23} />
            </div>

            <div>
              <h2 className="font-bold text-slate-900">
                Academic Workspace
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Your teaching and academic management space.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
