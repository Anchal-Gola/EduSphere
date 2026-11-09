
import { useEffect, useState } from "react";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import {
  BookOpen,
  GraduationCap,
  RefreshCw,
  Layers3,
} from "lucide-react";

export default function FacultyCourses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/assignments/my-courses");

      const assignments = response.data.assignments || response.data;

      const myCourses = assignments
        .filter((assignment) => assignment.facultyId === user?.id)
        .map((assignment) => assignment.course)
        .filter(Boolean);

      setCourses(myCourses);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load assigned courses."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) loadCourses();
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50/40 p-6">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-600 p-8 text-white shadow-xl shadow-emerald-200">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-emerald-200/20 blur-3xl" />

          <div className="relative flex flex-wrap items-center justify-between gap-6">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-1.5 text-sm font-semibold backdrop-blur-sm">
                <BookOpen size={16} />
                Faculty Workspace
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                My Courses
              </h1>

              <p className="mt-3 max-w-xl text-teal-50">
                Explore the courses assigned to you and view their
                academic details.
              </p>
            </div>

            <button
              onClick={loadCourses}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-teal-800 shadow-lg transition hover:bg-teal-50 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <RefreshCw
                size={18}
                className={loading ? "animate-spin" : ""}
              />
              Refresh Courses
            </button>
          </div>
        </div>

        {/* Course Statistics */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="group relative overflow-hidden rounded-2xl border border-purple-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-purple-500 to-violet-400" />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Assigned Courses
                </p>
                <h2 className="mt-2 text-3xl font-bold text-slate-800">
                  {courses.length}
                </h2>
                <p className="mt-2 text-sm text-purple-600">
                  Courses under your teaching
                </p>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-purple-100 to-violet-100 p-4 text-purple-700 transition group-hover:scale-110">
                <BookOpen size={28} />
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-orange-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-orange-500 to-pink-400" />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Credits
                </p>
                <h2 className="mt-2 text-3xl font-bold text-slate-800">
                  {courses.reduce(
                    (total, course) =>
                      total + (Number(course.credits) || 0),
                    0
                  )}
                </h2>
                <p className="mt-2 text-sm text-orange-600">
                  Across assigned courses
                </p>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-orange-100 to-pink-100 p-4 text-orange-700 transition group-hover:scale-110">
                <Layers3 size={28} />
              </div>
            </div>
          </div>
        </div>

        {/* Courses Content */}
        <div className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-green-100 to-lime-100 p-3 text-green-700">
              <BookOpen size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Your Course Collection
              </h2>
              <p className="text-sm text-slate-500">
                All courses assigned to your faculty account
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <RefreshCw className="mb-4 animate-spin text-green-600" size={32} />
              <p className="font-medium text-green-700">
                Loading your courses...
              </p>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
              <p className="font-semibold text-red-700">{error}</p>
              <button
                onClick={loadCourses}
                className="mt-4 rounded-xl bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          ) : courses.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-gradient-to-br from-slate-50 to-green-50/40 p-12 text-center">
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-100 to-pink-100 text-orange-600">
                <GraduationCap size={42} />
              </div>

              <h3 className="text-xl font-bold text-slate-800">
                No Courses Assigned Yet
              </h3>
              <p className="mx-auto mt-2 max-w-md text-slate-500">
                Your assigned courses will appear here.
                Please contact Admin to assign courses to your faculty account.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {courses.map((course, index) => {
                const accents = [
                  {
                    border: "border-purple-100",
                    strip: "from-purple-500 to-violet-400",
                    icon: "from-purple-100 to-violet-100 text-purple-700",
                    code: "text-purple-600",
                  },
                  {
                    border: "border-orange-100",
                    strip: "from-orange-500 to-pink-400",
                    icon: "from-orange-100 to-pink-100 text-orange-700",
                    code: "text-orange-600",
                  },
                  {
                    border: "border-green-100",
                    strip: "from-green-500 to-lime-400",
                    icon: "from-green-100 to-lime-100 text-green-700",
                    code: "text-green-700",
                  },
                  {
                    border: "border-blue-100",
                    strip: "from-blue-500 to-cyan-400",
                    icon: "from-blue-100 to-cyan-100 text-blue-700",
                    code: "text-blue-600",
                  },
                ];

                const accent = accents[index % accents.length];

                return (
                  <div
                    key={course.id}
                    className={`group relative overflow-hidden rounded-2xl border ${accent.border} bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl`}
                  >
                    <div className={`absolute left-0 top-0 h-1 w-full bg-gradient-to-r ${accent.strip}`} />

                    <div className="flex items-start justify-between gap-3">
                      <div className={`rounded-2xl bg-gradient-to-br ${accent.icon} p-4 transition group-hover:scale-110`}>
                        <BookOpen size={26} />
                      </div>

                      <span className="rounded-full bg-amber-100 px-3 py-1.5 text-sm font-semibold text-amber-700">
                        {course.credits} Credits
                      </span>
                    </div>

                    <h3 className="mt-5 text-xl font-bold text-slate-800 transition group-hover:text-green-700">
                      {course.name}
                    </h3>

                    <p className={`mt-2 font-semibold ${accent.code}`}>
                      {course.code}
                    </p>

                    <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4 text-sm text-slate-500">
                      <GraduationCap size={17} className="shrink-0 text-slate-400" />
                      <span>
                        {course.department?.name || "Department Course"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
