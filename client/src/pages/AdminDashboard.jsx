
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";
import {
  Building2,
  GraduationCap,
  Users,
  BookOpen,
  BriefcaseBusiness,
  ArrowUpRight,
  RefreshCw,
  Sparkles,
} from "lucide-react";

const statCards = [
  {
    title: "Total Colleges",
    key: "colleges",
    icon: Building2,
    color: "from-indigo-500 to-indigo-700",
    bg: "bg-indigo-50",
    text: "text-indigo-600",
    link: "/admin/colleges",
  },
  {
    title: "Departments",
    key: "departments",
    icon: BookOpen,
    color: "from-violet-500 to-purple-700",
    bg: "bg-violet-50",
    text: "text-violet-600",
    link: "/admin/departments",
  },
  {
    title: "Courses",
    key: "courses",
    icon: GraduationCap,
    color: "from-amber-400 to-orange-500",
    bg: "bg-amber-50",
    text: "text-amber-600",
    link: "/admin/courses",
  },
  {
    title: "Faculty Members",
    key: "faculty",
    icon: BriefcaseBusiness,
    color: "from-emerald-400 to-teal-600",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    link: "/admin/faculty",
  },
  {
    title: "Students",
    key: "students",
    icon: Users,
    color: "from-pink-500 to-rose-600",
    bg: "bg-pink-50",
    text: "text-pink-600",
    link: "/admin/students",
  },
];

const quickActions = [
  {
    title: "Manage Colleges",
    description: "Add and manage registered colleges.",
    icon: Building2,
    link: "/admin/colleges",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    title: "Manage Departments",
    description: "Organize departments across colleges.",
    icon: BookOpen,
    link: "/admin/departments",
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    title: "Manage Courses",
    description: "Create and update academic courses.",
    icon: GraduationCap,
    link: "/admin/courses",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    title: "Manage Faculty",
    description: "Maintain faculty member records.",
    icon: BriefcaseBusiness,
    link: "/admin/faculty",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    title: "Manage Students",
    description: "Manage student profiles and enrollment.",
    icon: Users,
    link: "/admin/students",
    color: "text-pink-600",
    bg: "bg-pink-50",
  },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/dashboard/stats");
      setStats(response.data.stats || response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load dashboard statistics."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-7 text-white shadow-xl shadow-indigo-200 sm:p-10">
        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-24 right-32 h-48 w-48 rounded-full bg-pink-400/20 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-medium backdrop-blur">
              <Sparkles size={15} />
              Admin Control Center
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Welcome back, Admin!
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-indigo-100 sm:text-base">
              Manage colleges, academics, faculty, and students from one
              centralized dashboard.
            </p>
          </div>

          <button
            onClick={fetchStats}
            disabled={loading}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-indigo-700 shadow-lg transition hover:bg-indigo-50 disabled:opacity-60"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh Dashboard
          </button>
        </div>
      </section>

      {/* Statistics */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Platform Overview
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Live summary of your education platform
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            <span>{error}</span>
            <button
              onClick={fetchStats}
              className="font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {statCards.map((card) => {
            const Icon = card.icon;

            return (
              <Link
                to={card.link}
                key={card.key}
                className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-100/60"
              >
                <div className="flex items-start justify-between">
                  <div className={`rounded-xl p-3 ${card.bg}`}>
                    <Icon size={23} className={card.text} />
                  </div>

                  <ArrowUpRight
                    size={18}
                    className="text-slate-300 transition group-hover:text-indigo-600"
                  />
                </div>

                <p className="mt-5 text-sm font-medium text-slate-500">
                  {card.title}
                </p>

                <div className="mt-2 flex items-end justify-between">
                  <p className="text-3xl font-bold tracking-tight text-slate-800">
                    {loading ? (
                      <span className="inline-block h-9 w-16 animate-pulse rounded-lg bg-slate-100" />
                    ) : (
                      stats[card.key] ?? 0
                    )}
                  </p>

                  <div
                    className={`h-1.5 w-20 rounded-full bg-gradient-to-r ${card.color}`}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <div className="mb-5">
          <h2 className="text-xl font-bold text-slate-800">Quick Management</h2>
          <p className="mt-1 text-sm text-slate-500">
            Access important management modules quickly
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                to={action.link}
                key={action.title}
                className="group flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100/50"
              >
                <div className={`rounded-xl p-3 ${action.bg}`}>
                  <Icon size={22} className={action.color} />
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800 transition group-hover:text-indigo-600">
                    {action.title}
                  </h3>
                  <p className="mt-1 text-sm leading-5 text-slate-500">
                    {action.description}
                  </p>
                </div>

                <ArrowUpRight
                  size={17}
                  className="mt-1 text-slate-300 transition group-hover:text-indigo-600"
                />
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
