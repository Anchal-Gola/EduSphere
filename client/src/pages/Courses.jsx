import { useEffect, useState } from "react";
import api from "../lib/api";
import {
  BookOpen,
  Plus,
  Search,
  RefreshCw,
  X,
  Pencil,
  Trash2,
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
    <div className="min-h-full bg-gradient-to-br from-slate-50 via-white to-indigo-50/50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-7">
        {/* Header */}
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 font-semibold text-indigo-600">
              Academic Management
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Courses
            </h1>

            <p className="mt-2 text-slate-500">
              Manage courses across departments.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 px-5 py-3 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            <Plus size={19} />
            Add Course
          </button>
        </div>

        {/* Search */}
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={19}
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search course, code, department or college..."
              className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          <button
            onClick={fetchData}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 font-medium text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-600"
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>

        {/* Courses */}
        {loading ? (
          <div className="py-16 text-center text-indigo-600">
            Loading courses...
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center shadow-sm">
            <BookOpen className="mx-auto mb-4 text-indigo-300" size={45} />
            <h3 className="text-lg font-semibold text-slate-800">
              No courses found
            </h3>
            <p className="mt-2 text-slate-500">
              Add a course or try another search.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/60"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-200">
                    <BookOpen size={23} />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(course)}
                      className="rounded-lg p-2 text-indigo-600 transition hover:bg-indigo-50"
                      title="Edit course"
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      onClick={() => handleDelete(course.id)}
                      className="rounded-lg p-2 text-red-500 transition hover:bg-red-50"
                      title="Delete course"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>

                <h3 className="mt-5 text-xl font-bold text-slate-900">
                  {course.name}
                </h3>

                <p className="mt-1 inline-flex rounded-lg bg-indigo-50 px-2.5 py-1 text-sm font-semibold text-indigo-700">
                  {course.code}
                </p>

                <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Department
                    </p>
                    <p className="mt-1 font-medium text-slate-700">
                      {course.department?.name || "Department unavailable"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      College
                    </p>
                    <p className="mt-1 font-medium text-slate-700">
                      {course.department?.college?.name || "College unavailable"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between rounded-xl bg-amber-50 px-3 py-2">
                  <span className="text-sm font-medium text-amber-700">
                    Credits
                  </span>
                  <span className="font-bold text-amber-700">
                    {course.credits}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
              <div className="flex items-center justify-between bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-5 text-white">
                <div>
                  <h2 className="text-xl font-bold">
                    {editingId ? "Edit Course" : "Add Course"}
                  </h2>
                  <p className="mt-1 text-sm text-indigo-100">
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
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
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
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
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
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
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
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
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
                    className="flex-1 rounded-xl border border-slate-200 px-4 py-3 font-semibold text-slate-600 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:shadow-xl"
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