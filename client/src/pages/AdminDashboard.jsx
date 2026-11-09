
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
  ShieldCheck,
  Zap,
  ChevronRight,
} from "lucide-react";

const statCards = [
  { title: "Total Colleges", key: "colleges", icon: Building2, color: "from-purple-400 to-fuchsia-400", link: "/admin/colleges" },
  { title: "Departments", key: "departments", icon: BookOpen, color: "from-violet-400 to-indigo-400", link: "/admin/departments" },
  { title: "Courses", key: "courses", icon: GraduationCap, color: "from-orange-300 to-pink-400", link: "/admin/courses" },
  { title: "Faculty Members", key: "faculty", icon: BriefcaseBusiness, color: "from-emerald-400 to-teal-400", link: "/admin/faculty" },
  { title: "Students", key: "students", icon: Users, color: "from-pink-400 to-rose-400", link: "/admin/students" },
];

const quickActions = [
  { title: "Manage Colleges", description: "Add and manage registered colleges.", icon: Building2, link: "/admin/colleges", color: "from-purple-500 to-fuchsia-500" },
  { title: "Manage Departments", description: "Organize departments across colleges.", icon: BookOpen, link: "/admin/departments", color: "from-violet-500 to-indigo-500" },
  { title: "Manage Courses", description: "Create and update academic courses.", icon: GraduationCap, link: "/admin/courses", color: "from-orange-400 to-pink-500" },
  { title: "Manage Faculty", description: "Maintain faculty member records.", icon: BriefcaseBusiness, link: "/admin/faculty", color: "from-emerald-400 to-teal-500" },
  { title: "Manage Students", description: "Manage student profiles and enrollment.", icon: Users, link: "/admin/students", color: "from-pink-400 to-rose-500" },
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
      setError(err.response?.data?.message || "Unable to load dashboard statistics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="min-h-full bg-transparent p-4 pb-6 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-7">

        {/* Welcome Banner */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-pink-500 p-7 text-white shadow-xl shadow-indigo-200 md:p-9">
          <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-24 right-40 h-64 w-64 rounded-full bg-pink-300/15 blur-3xl" />
          <div className="absolute right-10 top-10 h-40 w-40 rounded-full border border-white/10" />
          <div className="absolute right-20 top-20 h-24 w-24 rounded-full border border-white/10" />

          <div className="relative z-10 flex flex-col justify-between gap-7 sm:flex-row sm:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-3.5 py-1.5 text-sm font-medium backdrop-blur-lg">
                <Sparkles size={15} className="text-amber-200" />
                EduSphere · Admin Control Center
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Welcome back, Admin!
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-indigo-100 sm:text-base">
                Everything your campus needs, beautifully organized in one centralized workspace.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-2 backdrop-blur">
                  <ShieldCheck size={15} />
                  Secure workspace
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-2 backdrop-blur">
                  <Zap size={15} className="text-amber-200" />
                  Academic management
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={fetchStats}
              disabled={loading}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-300 to-orange-300 px-5 py-3 text-sm font-bold text-orange-950 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-60"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh Dashboard
            </button>
          </div>
        </section>

        {/* Statistics */}
        <section>
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-purple-500">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                Dashboard Overview
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                Your platform at a glance
              </h2>
              <p className="mt-1.5 text-sm text-slate-500">
                A live snapshot of your education ecosystem.
              </p>
            </div>

            <div className="rounded-full border border-purple-100 bg-white/90 px-4 py-2 text-xs font-medium text-purple-600 shadow-sm">
              Live statistics
            </div>
          </div>

          {error && (
            <div className="mb-4 flex items-center justify-between rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              <span>{error}</span>
              <button type="button" onClick={fetchStats} className="font-semibold underline">
                Retry
              </button>
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {statCards.map((card, index) => {
              const Icon = card.icon;

              return (
                <Link
                  to={card.link}
                  key={card.key}
                  className="group relative overflow-hidden rounded-2xl border border-purple-100 bg-white/95 p-5 shadow-sm transition hover:-translate-y-1 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-100/60"
                >
                  {/* Departments-style gradient strip */}
                  <div
                    className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${
                      index % 3 === 0
                        ? "from-purple-400 to-fuchsia-400"
                        : index % 3 === 1
                        ? "from-orange-300 to-pink-400"
                        : "from-violet-400 to-indigo-400"
                    }`}
                  />

                  <div className="flex items-start justify-between">
                    {/* Departments-style gradient icon */}
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 text-white shadow-md shadow-purple-200">
                      <Icon size={23} />
                    </div>

                    <ArrowUpRight
                      size={19}
                      className="text-slate-300 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-purple-600"
                    />
                  </div>

                  <p className="mt-5 text-sm font-medium text-slate-500">
                    {card.title}
                  </p>

                  <div className="mt-2 flex items-end justify-between">
                    <p className="text-4xl font-extrabold tracking-tight text-slate-900">
                      {loading ? (
                        <span className="inline-block h-10 w-20 animate-pulse rounded-lg bg-purple-50" />
                      ) : (
                        stats[card.key] ?? 0
                      )}
                    </p>
                    <div
                      className={`h-1.5 w-20 rounded-full bg-gradient-to-r ${
                        index % 3 === 0
                          ? "from-purple-400 to-fuchsia-400"
                          : index % 3 === 1
                          ? "from-orange-300 to-pink-400"
                          : "from-violet-400 to-indigo-400"
                      }`}
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
            <div className="mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-purple-500">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
              Workspace
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Quick Management
            </h2>
            <p className="mt-1.5 text-sm text-slate-500">
              Jump straight into the tools you use most.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;

              return (
                <Link
                  to={action.link}
                  key={action.title}
                  className="group relative overflow-hidden rounded-2xl border border-purple-100 bg-white/95 shadow-sm transition hover:-translate-y-1 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-100/60"
                >
                  {/* Departments-style gradient strip */}
                  <div
                    className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${
                      index % 3 === 0
                        ? "from-purple-400 to-fuchsia-400"
                        : index % 3 === 1
                        ? "from-orange-300 to-pink-400"
                        : "from-violet-400 to-indigo-400"
                    }`}
                  />

                  <div className="flex items-start gap-4 p-5">
                    {/* Departments-style gradient icon */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 text-white shadow-md shadow-purple-200 transition group-hover:scale-105">
                      <Icon size={23} />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 transition group-hover:text-purple-600">
                        {action.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-5 text-slate-500">
                        {action.description}
                      </p>
                      <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-purple-500 opacity-0 transition group-hover:opacity-100">
                        Open module <ChevronRight size={14} />
                      </span>
                    </div>

                    <ArrowUpRight
                      size={17}
                      className="mt-1 text-slate-300 transition group-hover:text-purple-600"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
