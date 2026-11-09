
import { useEffect, useState } from "react";
import api from "../lib/api";
import {
  Building2,
  BookOpen,
  Plus,
  Search,
  RefreshCw,
  X,
  Pencil,
  Trash2,
  GraduationCap,
  Landmark,
} from "lucide-react";

const emptyForm = {
  name: "",
  code: "",
  credits: 3,
  departmentId: "",
};

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [courseRes, departmentRes] = await Promise.all([
        api.get("/courses"),
        api.get("/departments"),
      ]);

      setCourses(courseRes.data);
      setDepartments(departmentRes.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch courses or departments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEditModal = (course) => {
    setEditingId(course.id);
    setForm({
      name: course.name,
      code: course.code,
      credits: course.credits,
      departmentId: course.departmentId,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/courses/${editingId}`, form);
        alert("Course updated successfully");
      } else {
        await api.post("/courses", form);
        alert("Course created successfully");
      }

      setModalOpen(false);
      setForm(emptyForm);
      setEditingId(null);
      fetchData();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) {
      return;
    }

    try {
      await api.delete(`/courses/${id}`);
      alert("Course deleted successfully");
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete course");
    }
  };

  const filteredCourses = courses.filter((course) => {
    const query = search.toLowerCase();

    return (
      course.name.toLowerCase().includes(query) ||
      course.code.toLowerCase().includes(query) ||
      course.department?.name?.toLowerCase().includes(query) ||
      course.department?.college?.name?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-full bg-transparent p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-7">

        {/* Header Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-pink-500 p-7 text-white shadow-xl shadow-indigo-200 md:p-9">
          <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm text-indigo-100">
                <BookOpen size={17} />
                Administration / Courses
              </div>

              <h1 className="text-3xl font-bold md:text-4xl">
                Courses
              </h1>

              <p className="mt-2 text-indigo-100">
                Manage courses across departments.
              </p>
            </div>

            <button
              onClick={openCreateModal}
              className="flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-3 font-semibold text-slate-900 shadow-lg transition hover:bg-amber-300"
            >
              <Plus size={19} />
              Add Course
            </button>
          </div>

          <div className="relative mt-7">
            <div className="inline-block rounded-xl border border-white/20 bg-white/15 px-4 py-3 backdrop-blur-md">
              <p className="text-xs text-indigo-100">Total Courses</p>
              <p className="text-2xl font-bold">{courses.length}</p>
            </div>
          </div>
        </div>

        {/* Search and Refresh */}
        <div className="flex flex-col gap-3 rounded-2xl border border-purple-100 bg-white/90 p-4 shadow-sm backdrop-blur-sm sm:flex-row">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400"
              size={19}
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search course, code, department or college..."
              className="w-full rounded-xl border border-purple-100 bg-purple-50/40 py-3 pl-10 pr-4 outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
            />
          </div>

          <button
            onClick={fetchData}
            className="flex items-center justify-center gap-2 rounded-xl border border-purple-100 px-4 py-3 font-medium text-purple-700 transition hover:bg-purple-50"
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>

        {/* Course Cards */}
        {loading ? (
          <div className="rounded-2xl border border-purple-100 bg-white/80 py-16 text-center text-purple-600 shadow-sm">
            <RefreshCw size={25} className="mx-auto mb-3 animate-spin" />
            Loading courses...
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="rounded-2xl border border-purple-100 bg-white/90 py-16 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-100 to-orange-100">
              <GraduationCap className="text-purple-500" size={32} />
            </div>

            <h3 className="text-lg font-semibold text-slate-800">
              No courses found
            </h3>

            <p className="mt-2 text-slate-500">
              Add a course or try another search.
            </p>

            {!search && (
              <button
                onClick={openCreateModal}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 px-4 py-2.5 font-semibold text-white shadow-md shadow-purple-200 transition hover:shadow-lg"
              >
                <Plus size={17} />
                Add your first course
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredCourses.map((course, index) => (
              <div
                key={course.id}
                className="group relative overflow-hidden rounded-2xl border border-purple-100 bg-white/95 p-5 shadow-sm transition hover:-translate-y-1 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-100/60"
              >
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
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 text-white shadow-md shadow-purple-200">
                    <BookOpen size={23} />
                  </div>

                  <div className="flex gap-1">
                    <button
                      onClick={() => openEditModal(course)}
                      className="rounded-lg p-2 text-purple-600 transition hover:bg-purple-50"
                      title="Edit course"
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      onClick={() => handleDelete(course.id)}
                      className="rounded-lg p-2 text-rose-500 transition hover:bg-rose-50"
                      title="Delete course"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>

                <h3 className="mt-5 text-xl font-bold text-slate-900">
                  {course.name}
                </h3>

                <p className="mt-2 inline-flex rounded-lg bg-gradient-to-r from-purple-50 to-fuchsia-50 px-3 py-1 text-sm font-semibold text-purple-700">
                  {course.code}
                </p>

                <div className="mt-5 rounded-xl border border-purple-100 bg-gradient-to-r from-purple-50/70 to-fuchsia-50/50 p-3">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-purple-600">
                    <BookOpen size={14} />
                    Department
                  </div>

                  <p className="mt-1 font-medium text-slate-700">
                    {course.department?.name || "Department unavailable"}
                  </p>
                </div>

                <div className="mt-3 rounded-xl border border-orange-100 bg-gradient-to-r from-orange-50/70 to-pink-50/50 p-3">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-orange-600">
                    <Landmark size={14} />
                    College
                  </div>

                  <p className="mt-1 font-medium text-slate-700">
                    {course.department?.college?.name || "College unavailable"}
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between rounded-xl bg-purple-50/70 px-3 py-3">
                  <span className="text-sm text-slate-600">Credits</span>

                  <span className="rounded-lg bg-white px-3 py-1 font-bold text-purple-700 shadow-sm">
                    {course.credits}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create / Edit Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-2xl">

              <div className="flex items-center justify-between bg-gradient-to-r from-[#312e81] via-[#5b21b6] to-[#7c3aed] px-6 py-5 text-white">
                <div>
                  <h2 className="text-xl font-bold">
                    {editingId ? "Edit Course" : "Add Course"}
                  </h2>

                  <p className="mt-1 text-sm text-purple-100">
                    Course information
                  </p>
                </div>

                <button
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg p-2 transition hover:bg-white/20"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 p-6">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Course Name
                  </label>

                  <input
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    placeholder="Data Structures and Algorithms"
                    className="w-full rounded-xl border border-purple-100 bg-purple-50/30 px-4 py-3 outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Course Code
                  </label>

                  <input
                    required
                    value={form.code}
                    onChange={(e) =>
                      setForm({ ...form, code: e.target.value })
                    }
                    placeholder="CS201"
                    className="w-full rounded-xl border border-purple-100 bg-purple-50/30 px-4 py-3 outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Credits
                  </label>

                  <input
                    required
                    type="number"
                    min="1"
                    max="20"
                    value={form.credits}
                    onChange={(e) =>
                      setForm({ ...form, credits: e.target.value })
                    }
                    className="w-full rounded-xl border border-purple-100 bg-purple-50/30 px-4 py-3 outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Select Department
                  </label>

                  <select
                    required
                    value={form.departmentId}
                    onChange={(e) =>
                      setForm({ ...form, departmentId: e.target.value })
                    }
                    className="w-full rounded-xl border border-purple-100 bg-white px-4 py-3 outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
                  >
                    <option value="">Choose a department</option>

                    {departments.map((department) => (
                      <option key={department.id} value={department.id}>
                        {department.name} — {department.college?.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="flex-1 rounded-xl border border-purple-100 px-4 py-3 font-semibold text-slate-600 transition hover:bg-purple-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 px-4 py-3 font-semibold text-white shadow-lg shadow-purple-200 transition hover:shadow-xl"
                  >
                    {editingId ? "Save Changes" : "Create Course"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
