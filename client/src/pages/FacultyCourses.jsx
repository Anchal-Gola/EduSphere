
import { useEffect, useState } from "react";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { BookOpen, GraduationCap, RefreshCw } from "lucide-react";

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
    setError(err.response?.data?.message || "Unable to load assigned courses.");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (user?.id) loadCourses();
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/40 p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-teal-600">Academic Workspace</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-800">
              My Courses
            </h1>
            <p className="mt-2 text-slate-500">
              View courses assigned to you by Admin.
            </p>
          </div>

          <button
            onClick={loadCourses}
            className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-3 font-semibold text-white shadow-lg shadow-teal-600/20 hover:bg-teal-700"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>

        <div className="rounded-2xl border border-teal-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-teal-100 p-3 text-teal-700">
              <BookOpen size={26} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Assigned Courses</p>
              <h2 className="text-2xl font-bold text-slate-800">
                {courses.length}
              </h2>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-teal-600">
            Loading courses...
          </div>
        ) : error ? (
          <div className="rounded-xl bg-red-50 p-5 text-red-600">{error}</div>
        ) : courses.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <GraduationCap className="mx-auto mb-4 text-slate-400" size={45} />
            <h3 className="text-xl font-bold text-slate-700">
              No courses assigned
            </h3>
            <p className="mt-2 text-slate-500">
              Ask Admin to assign courses to your faculty account.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => (
              <div
                key={course.id}
                className="rounded-2xl border border-teal-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="rounded-xl bg-teal-100 p-3 text-teal-700">
                    <BookOpen size={24} />
                  </div>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
                    {course.credits} Credits
                  </span>
                </div>

                <h3 className="mt-5 text-xl font-bold text-slate-800">
                  {course.name}
                </h3>

                <p className="mt-2 font-semibold text-teal-600">{course.code}</p>

                <div className="mt-4 border-t border-slate-100 pt-4 text-sm text-slate-500">
                  <GraduationCap size={16} className="mr-2 inline" />
                  {course.department?.name || "Department Course"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
