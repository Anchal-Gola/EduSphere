
import { useEffect, useState } from "react";
import api from "../lib/api";
import {
  UserPlus,
  UserRound,
  BookOpen,
  Plus,
  Trash2,
  RefreshCw,
} from "lucide-react";

export default function StudentEnrollment() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [studentRes, courseRes, enrollmentRes] = await Promise.all([
        api.get("/students"),
        api.get("/courses"),
        api.get("/assignments/student-courses"),
      ]);

      setStudents(studentRes.data);
      setCourses(courseRes.data);
      setEnrollments(enrollmentRes.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch enrollment data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEnroll = async (e) => {
    e.preventDefault();

    if (!studentId || !courseId) {
      alert("Please select student and course");
      return;
    }

    try {
      setSaving(true);

     const response = await api.post("/assignments/student-courses", {
  studentId,
  courseId,
});

console.log("ENROLLMENT CREATED:", response.data);

      alert("Student enrolled successfully");
      setStudentId("");
      setCourseId("");
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to enroll student");
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (id) => {
    if (!window.confirm("Remove this student enrollment?")) return;

    try {
      await api.delete(`/assignments/student-courses/${id}`);
      alert("Enrollment removed");
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to remove enrollment");
    }
  };

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 via-white to-indigo-50/50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-7">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 font-semibold text-indigo-600">
              Academic Management
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Student Enrollment
            </h1>
            <p className="mt-2 text-slate-500">
              Enroll students in academic courses.
            </p>
          </div>

          <button
            onClick={fetchData}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>

        <form
          onSubmit={handleEnroll}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
              <Plus size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Enroll a Student
              </h2>
              <p className="text-sm text-slate-500">
                Choose a student and course below.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <select
              required
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            >
              <option value="">Select Student</option>
              {students.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} ({item.email})
                </option>
              ))}
            </select>

            <select
              required
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            >
              <option value="">Select Course</option>
              {courses.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} ({item.code})
                </option>
              ))}
            </select>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 font-semibold text-white shadow-lg shadow-indigo-200 disabled:opacity-60"
            >
              {saving ? "Enrolling..." : "Enroll Student"}
            </button>
          </div>
        </form>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b p-5">
            <h2 className="text-lg font-bold text-slate-900">
              Existing Enrollments
            </h2>
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">
              {enrollments.length} enrollments
            </span>
          </div>

          {loading ? (
            <div className="py-14 text-center text-indigo-600">
              Loading enrollments...
            </div>
          ) : enrollments.length === 0 ? (
            <div className="py-14 text-center text-slate-500">
              <UserPlus className="mx-auto mb-3 text-indigo-300" size={42} />
              No student enrollments yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {enrollments.map((enrollment) => (
                <div
                  key={enrollment.id}
                  className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                      <UserRound size={21} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        {enrollment.student?.name || "Student"}
                      </p>
                      <p className="text-sm text-slate-500">
                        {enrollment.student?.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 sm:min-w-64">
                    <BookOpen className="mt-1 text-violet-500" size={19} />
                    <div>
                      <p className="font-semibold text-slate-800">
                        {enrollment.course?.name || "Course"}
                      </p>
                      <p className="text-sm text-slate-500">
                        {enrollment.course?.code} ·{" "}
                        {enrollment.course?.department?.name}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemove(enrollment.id)}
                    className="flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
