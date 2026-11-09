import { useEffect, useState } from "react";
import api from "../lib/api";
import {
  Building2,
  Plus,
  Search,
  RefreshCw,
  X,
  Pencil,
  Trash2,
  GraduationCap,
} from "lucide-react";

const emptyForm = {
  name: "",
  code: "",
  collegeId: "",
};

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [departmentRes, collegeRes] = await Promise.all([
        api.get("/departments"),
        api.get("/colleges"),
      ]);

      setDepartments(departmentRes.data);
      setColleges(collegeRes.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch departments or colleges");
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

  const openEditModal = (department) => {
    setEditingId(department.id);
    setForm({
      name: department.name,
      code: department.code,
      collegeId: department.collegeId,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/departments/${editingId}`, form);
        alert("Department updated successfully");
      } else {
        await api.post("/departments", form);
        alert("Department created successfully");
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
    if (!window.confirm("Are you sure you want to delete this department?")) {
      return;
    }

    try {
      await api.delete(`/departments/${id}`);
      alert("Department deleted successfully");
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete department");
    }
  };

  const filteredDepartments = departments.filter((department) => {
    const query = search.toLowerCase();

    return (
      department.name.toLowerCase().includes(query) ||
      department.code.toLowerCase().includes(query) ||
      department.college?.name?.toLowerCase().includes(query)
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
              Departments
            </h1>

            <p className="mt-2 text-slate-500">
              Manage departments across your colleges.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 px-5 py-3 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            <Plus size={19} />
            Add Department
          </button>
        </div>

        {/* Search and refresh */}
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={19}
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search department, code or college..."
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

        {/* Department cards */}
        {loading ? (
          <div className="py-16 text-center text-indigo-600">
            Loading departments...
          </div>
        ) : filteredDepartments.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center shadow-sm">
            <GraduationCap className="mx-auto mb-4 text-indigo-300" size={45} />
            <h3 className="text-lg font-semibold text-slate-800">
              No departments found
            </h3>
            <p className="mt-2 text-slate-500">
              Add a department or try another search.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredDepartments.map((department) => (
              <div
                key={department.id}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/60"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-200">
                    <Building2 size={23} />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(department)}
                      className="rounded-lg p-2 text-indigo-600 transition hover:bg-indigo-50"
                      title="Edit department"
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      onClick={() => handleDelete(department.id)}
                      className="rounded-lg p-2 text-red-500 transition hover:bg-red-50"
                      title="Delete department"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>

                <h3 className="mt-5 text-xl font-bold text-slate-900">
                  {department.name}
                </h3>

                <p className="mt-1 inline-flex rounded-lg bg-indigo-50 px-2.5 py-1 text-sm font-semibold text-indigo-700">
                  {department.code}
                </p>

                <div className="mt-5 border-t border-slate-100 pt-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    College
                  </p>
                  <p className="mt-1 font-medium text-slate-700">
                    {department.college?.name || "College unavailable"}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                  <span className="text-sm text-slate-500">Courses</span>
                  <span className="font-semibold text-violet-700">
                    {department.courses?.length || 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create / Edit modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
              <div className="flex items-center justify-between bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-5 text-white">
                <div>
                  <h2 className="text-xl font-bold">
                    {editingId ? "Edit Department" : "Add Department"}
                  </h2>
                  <p className="mt-1 text-sm text-indigo-100">
                    Department information
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
                    Department Name
                  </label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    placeholder="Computer Science"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Department Code
                  </label>
                  <input
                    required
                    value={form.code}
                    onChange={(e) =>
                      setForm({ ...form, code: e.target.value })
                    }
                    placeholder="CSE"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Select College
                  </label>
                  <select
                    required
                    value={form.collegeId}
                    onChange={(e) =>
                      setForm({ ...form, collegeId: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                  >
                    <option value="">Choose a college</option>
                    {colleges.map((college) => (
                      <option key={college.id} value={college.id}>
                        {college.name}
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
                    {editingId ? "Save Changes" : "Create Department"}
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