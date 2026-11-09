
import { useEffect, useState } from "react";
import api from "../lib/api";
import { BookOpen, RefreshCw, GraduationCap } from "lucide-react";

export default function StudentCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      setLoading(true);

      const response = await api.get("/assignments/my-enrollments");

      console.log("API RESPONSE:", response.data);

      const enrollments = response.data.enrollments || response.data;

      const enrolledCourses = enrollments
        .map((enrollment) => enrollment.course)
        .filter(Boolean);

      setCourses(enrolledCourses);
    } catch (error) {
      console.error("Error fetching student courses:", error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="min-h-full bg-gradient-to-br from-orange-50 via-white to-rose-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-7">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              My Courses
            </h1>
            <p className="mt-2 text-slate-500">
              Courses assigned to you through enrollment.
            </p>
          </div>

          <button
            onClick={fetchCourses}
            className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-600"
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>

        {/* Summary */}
        <div className="rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 p-6 text-white shadow-lg">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20">
              <BookOpen size={30} />
            </div>

            <div>
              <p className="text-sm font-medium text-white/80">
                Your Enrollment
              </p>
              <h2 className="text-2xl font-bold">Academic Courses</h2>
              <p className="mt-1">
                {courses.length} enrolled{" "}
                {courses.length === 1 ? "course" : "courses"}
              </p>
            </div>
          </div>
        </div>

        {/* Course List */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {loading ? (
            <div className="py-14 text-center">
              <RefreshCw className="mx-auto mb-4 animate-spin text-orange-500" size={32} />
              <p className="text-slate-500">Loading courses...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="py-14 text-center">
              <GraduationCap className="mx-auto mb-4 text-orange-300" size={48} />
              <h3 className="text-lg font-semibold text-slate-800">
                No courses enrolled
              </h3>
              <p className="mt-2 text-slate-500">
                Your enrolled courses will appear here.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="rounded-2xl border border-orange-100 bg-gradient-to-br from-white to-orange-50 p-5 transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                    <BookOpen size={24} />
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">
                    {course.name}
                  </h3>

                  <p className="mt-2 text-sm font-medium text-orange-600">
                    {course.code}
                  </p>

                  <div className="mt-4 border-t border-orange-100 pt-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Department
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      {course.department?.name || "Not specified"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
