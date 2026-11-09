
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";
import {
  BookOpen,
  GraduationCap,
  Building2,
  RefreshCw,
  Sparkles,
  CalendarDays,
  ArrowRight,
  UserCircle,
  Award,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function StudentDashboard() {
  const { user } = useAuth();

  const [data, setData] = useState({});
  const [courseCount, setCourseCount] = useState(0);
  const [totalCredits, setTotalCredits] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [dashboardResponse, coursesResponse] = await Promise.all([
        api.get("/dashboard/student"),
        api.get("/courses"),
      ]);

      const dashboardData =
        dashboardResponse.data.stats || dashboardResponse.data;

      setData(dashboardData);

      const departmentCourses = coursesResponse.data.filter(
        (course) => course.departmentId === user?.departmentId
      );

      setCourseCount(departmentCourses.length);

      setTotalCredits(
        departmentCourses.reduce(
          (total, course) => total + (Number(course.credits) || 0),
          0
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load student dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const cards = [
    {
      title: "My Courses",
      value: courseCount,
      icon: BookOpen,
      color: "bg-amber-50 text-amber-700",
    },
    {
      title: "Total Credits",
      value: totalCredits,
      icon: Award,
      color: "bg-emerald-50 text-emerald-700",
    },
    {
      title: "Department",
      value: data.department?.name || "Not assigned",
      icon: GraduationCap,
      color: "bg-orange-50 text-orange-700",
    },
    {
      title: "My College",
      value: data.college?.name || "Not assigned",
      icon: Building2,
      color: "bg-indigo-50 text-indigo-700",
    },
  ];

  return (
    <div className="space-y-8 bg-slate-50 p-6 sm:p-8">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 p-8 text-white shadow-xl shadow-orange-100">
        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/15 blur-2xl" />

        <div className="relative">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-sm">
            <Sparkles size={15} />
            Student Portal
          </div>

          <h1 className="text-3xl font-bold sm:text-4xl">
            Welcome, {user?.name || "Student"}!
          </h1>

          <p className="mt-3 max-w-xl text-orange-50">
            Your academic space to explore courses and stay connected with your college.
          </p>

          <button
            onClick={loadDashboard}
            disabled={loading}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-orange-700 shadow transition hover:bg-orange-50 disabled:opacity-60"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </section>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
          <button
            onClick={loadDashboard}
            className="ml-3 font-semibold underline"
          >
            Retry
          </button>
        </div>
      )}

      <section>
        <h2 className="text-xl font-bold text-slate-800">
          Academic Overview
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Your academic information at a glance
        </p>

        <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className={`inline-flex rounded-xl p-3 ${card.color}`}>
                  <Icon size={23} />
                </div>

                <p className="mt-5 text-sm font-medium text-slate-500">
                  {card.title}
                </p>

                <p className="mt-2 break-words text-xl font-bold text-slate-800">
                  {loading ? (
                    <span className="inline-block h-8 w-24 animate-pulse rounded bg-slate-100" />
                  ) : (
                    card.value
                  )}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-slate-800">Quick Access</h2>
        <p className="mt-1 text-sm text-slate-500">
          Quickly access your student portal features
        </p>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <Link
            to="/student/courses"
            className="group flex items-center justify-between rounded-2xl border border-orange-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-orange-100 p-4 text-orange-600">
                <BookOpen size={26} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">My Courses</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Explore your department courses
                </p>
              </div>
            </div>
            <ArrowRight className="text-orange-500 transition group-hover:translate-x-1" />
          </Link>

          <Link
            to="/student/profile"
            className="group flex items-center justify-between rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-indigo-100 p-4 text-indigo-600">
                <UserCircle size={26} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">My Profile</h3>
                <p className="mt-1 text-sm text-slate-500">
                  View your personal information
                </p>
              </div>
            </div>
            <ArrowRight className="text-indigo-500 transition group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-orange-50 p-3 text-orange-700">
            <CalendarDays size={22} />
          </div>
          <div>
            <h2 className="font-bold text-slate-800">Student Workspace</h2>
            <p className="text-sm text-slate-500">
              Your academic tools and activities will be available here.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
