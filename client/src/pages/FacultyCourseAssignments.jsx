
import { useEffect, useState } from "react";
import api from "../lib/api";
import {
  ClipboardList,
  UserRound,
  BookOpen,
  Plus,
  Trash2,
  RefreshCw,
  GraduationCap,
  CheckCircle2,
} from "lucide-react";

export default function FacultyCourseAssignments() {
  const [faculty, setFaculty] = useState([]);
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [facultyId, setFacultyId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [facultyRes, courseRes, assignmentRes] = await Promise.all([
        api.get("/faculty"),
        api.get("/courses"),
        api.get("/assignments/faculty-courses"),
      ]);

      setFaculty(facultyRes.data);
      setCourses(courseRes.data);
      setAssignments(assignmentRes.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch assignment data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssign = async (e) => {
    e.preventDefault();

    if (!facultyId || !courseId) {
      alert("Please select faculty and course");
      return;
    }

    try {
      setSaving(true);

      await api.post("/assignments/faculty-courses", {
        facultyId,
        courseId,
      });

      alert("Course assigned successfully");
      setFacultyId("");
      setCourseId("");
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to assign course");
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (id) => {
    if (!window.confirm("Remove this faculty course assignment?")) return;

    try {
      await api.delete(`/assignments/faculty-courses/${id}`);
      alert("Assignment removed");
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to remove assignment");
    }
  };

  const selectClass =
    "w-full rounded-xl border border-purple-100 bg-purple-50/40 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-purple-300 focus:ring-4 focus:ring-purple-100";

  return (
    <div className="min-h-full bg-transparent p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-7">
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-pink-500 p-7 text-white shadow-xl shadow-indigo-200 md:p-9">
          <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

          <div className="relative">
            <p className="mb-3 text-sm font-semibold text-indigo-100">
              Administration / Assignments
            </p>

            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
              <div>
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                  Faculty Course Assignments
                </h1>
                <p className="mt-3 max-w-xl text-sm leading-6 text-indigo-100 md:text-base">
                  Manage faculty teaching assignments and course allocations.
                </p>
              </div>

              <button
                type="button"
                onClick={fetchData}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white/15 px-5 py-3 font-semibold text-white ring-1 ring-white/30 transition hover:bg-white/25"
              >
                <RefreshCw size={17} />
                Refresh
              </button>
            </div>

            <div className="mt-7 inline-flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
                <ClipboardList size={19} />
              </div>
              <div>
                <p className="text-xs text-indigo-100">Total Assignments</p>
                <p className="text-xl font-bold">{assignments.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Assign Course Form */}
        <form
          onSubmit={handleAssign}
          className="rounded-2xl border border-purple-100 bg-white/95 p-5 shadow-sm sm:p-6"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 text-white shadow-md shadow-purple-200">
              <Plus size={23} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Assign a Course
              </h2>
              <p className="text-sm text-slate-500">
                Choose faculty and course below.
              </p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_1fr_auto]">
            <select
              required
              value={facultyId}
              onChange={(e) => setFacultyId(e.target.value)}
              className={selectClass}
            >
              <option value="">Select Faculty</option>
              {faculty.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} ({item.email})
                </option>
              ))}
            </select>

            <select
              required
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className={selectClass}
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
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 px-6 py-3 font-semibold text-white shadow-lg shadow-purple-200 transition hover:from-purple-700 hover:to-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Plus size={18} />
              {saving ? "Assigning..." : "Assign Course"}
            </button>
          </div>
        </form>

        {/* Existing Assignments */}
        <div className="rounded-2xl border border-purple-100 bg-white/95 p-5 shadow-sm sm:p-6">
          <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Existing Assignments
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Faculty members and their assigned courses.
              </p>
            </div>

            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-purple-50 px-3 py-1.5 text-sm font-semibold text-purple-700">
              <CheckCircle2 size={15} />
              {assignments.length} assignments
            </span>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-purple-100 bg-white/80 py-14 text-center">
              <RefreshCw className="mx-auto mb-3 animate-spin text-purple-500" size={30} />
              <p className="font-medium text-slate-500">Loading assignments...</p>
            </div>
          ) : assignments.length === 0 ? (
            <div className="rounded-2xl border border-purple-100 bg-white/80 py-14 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 text-purple-500">
                <ClipboardList size={32} />
              </div>
              <h3 className="font-semibold text-slate-800">
                No course assignments yet
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Assign a course to a faculty member to get started.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {assignments.map((assignment, index) => (
                <div
                  key={assignment.id}
                  className="group relative overflow-hidden rounded-2xl border border-purple-100 bg-white/95 p-5 shadow-sm transition hover:-translate-y-1 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-100/60"
                >
                  <div
                    className={`absolute inset-x-0 top-0 h-1 ${
                      index % 3 === 0
                        ? "bg-gradient-to-r from-purple-500 to-fuchsia-500"
                        : index % 3 === 1
                          ? "bg-gradient-to-r from-orange-400 to-pink-500"
                          : "bg-gradient-to-r from-violet-500 to-indigo-500"
                    }`}
                  />

                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-violet-100 text-purple-600">
                      <UserRound size={23} />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemove(assignment.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-rose-500 transition hover:bg-rose-50"
                      title="Remove assignment"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>

                  <h3 className="mt-5 text-xl font-bold text-slate-900">
                    {assignment.faculty?.name || "Faculty"}
                  </h3>
                  <p className="mt-1 break-all text-sm text-slate-500">
                    {assignment.faculty?.email || "No email available"}
                  </p>

                  <div className="mt-5 rounded-xl border border-orange-100 bg-gradient-to-br from-orange-50 to-pink-50 p-4">
                    <div className="mb-2 flex items-center gap-2 text-orange-600">
                      <BookOpen size={17} />
                      <span className="text-xs font-bold uppercase tracking-wide">
                        Assigned Course
                      </span>
                    </div>
                    <p className="font-semibold text-slate-800">
                      {assignment.course?.name || "Course"}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Code: {assignment.course?.code || "N/A"}
                    </p>
                  </div>

                  <div className="mt-3 rounded-xl bg-purple-50/70 p-4">
                    <div className="mb-2 flex items-center gap-2 text-purple-600">
                      <GraduationCap size={17} />
                      <span className="text-xs font-bold uppercase tracking-wide">
                        Department
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-slate-800">
                      {assignment.course?.department?.name || "No department"}
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
