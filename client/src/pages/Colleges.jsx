
import { useEffect, useState } from "react";
import api from "../lib/api";
import {
  Building2,
  Plus,
  Search,
  RefreshCw,
  X,
  Mail,
  Hash,
  Pencil,
  Trash2,
} from "lucide-react";

function Colleges() {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingCollege, setEditingCollege] = useState(null);
  const [form, setForm] = useState({ name: "", code: "", email: "" });

  const fetchColleges = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/colleges");
      setColleges(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load colleges");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, []);

  const openCreateForm = () => {
    setEditingCollege(null);
    setForm({ name: "", code: "", email: "" });
    setError("");
    setShowForm(true);
  };

  const openEditForm = (college) => {
    setEditingCollege(college);
    setForm({
      name: college.name,
      code: college.code,
      email: college.email,
    });
    setError("");
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      if (editingCollege) {
        await api.put(`/colleges/${editingCollege.id}`, form);
      } else {
        await api.post("/colleges", form);
      }

      setShowForm(false);
      setEditingCollege(null);
      setForm({ name: "", code: "", email: "" });
      await fetchColleges();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save college");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (college) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${college.name}"?`
    );

    if (!confirmed) return;

    try {
      setError("");
      await api.delete(`/colleges/${college.id}`);
      await fetchColleges();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete college");
    }
  };

  const filteredColleges = colleges.filter((college) =>
    `${college.name} ${college.code} ${college.email}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-pink-500 p-7 md:p-9 text-white shadow-xl shadow-indigo-200">
        <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 text-indigo-100 text-sm mb-3">
              <Building2 size={17} />
              Administration / Colleges
            </div>

            <h1 className="text-3xl md:text-4xl font-bold">Colleges</h1>

            <p className="text-indigo-100 mt-2">
              Manage institutions connected to EduSphere.
            </p>
          </div>

          <button
            onClick={openCreateForm}
            className="flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold px-5 py-3 rounded-xl shadow-lg transition"
          >
            <Plus size={19} />
            Add College
          </button>
        </div>

        <div className="relative mt-7">
          <div className="inline-block bg-white/15 backdrop-blur-md rounded-xl px-4 py-3 border border-white/20">
            <p className="text-xs text-indigo-100">Total Colleges</p>
            <p className="text-2xl font-bold">{colleges.length}</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="relative flex-1 max-w-xl">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={19}
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search colleges by name, code or email..."
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          onClick={fetchColleges}
          className="flex items-center justify-center gap-2 rounded-xl border bg-white px-4 py-3 text-slate-600 hover:text-indigo-600 transition"
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
          {error}
        </div>
      )}

      {/* Colleges */}
      {loading ? (
        <div className="py-20 text-center text-indigo-600">
          <RefreshCw className="animate-spin mx-auto mb-3" size={28} />
          Loading colleges...
        </div>
      ) : filteredColleges.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <Building2 size={30} />
          </div>

          <h3 className="text-lg font-semibold text-slate-800">
            No colleges found
          </h3>

          <p className="text-slate-500 mt-1">
            Add your first college to get started.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredColleges.map((college) => (
            <div
              key={college.id}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-xl hover:shadow-indigo-100 hover:-translate-y-1 transition duration-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-200">
                  <Building2 size={23} />
                </div>

                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                  Active
                </span>
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-800">
                {college.name}
              </h3>

              <div className="mt-3 space-y-2 text-sm text-slate-500">
                <p className="flex items-center gap-2">
                  <Hash size={15} className="text-indigo-500" />
                  {college.code}
                </p>

                <p className="flex items-center gap-2 break-all">
                  <Mail size={15} className="text-violet-500 shrink-0" />
                  {college.email}
                </p>
              </div>

              <div className="mt-5 border-t pt-4 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {college.departments?.length || 0} Departments
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={() => openEditForm(college)}
                    className="rounded-lg p-2 text-indigo-600 hover:bg-indigo-50 transition"
                    title="Edit college"
                  >
                    <Pencil size={17} />
                  </button>

                  <button
                    onClick={() => handleDelete(college)}
                    className="rounded-lg p-2 text-red-500 hover:bg-red-50 transition"
                    title="Delete college"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit College Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-5 text-white flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  {editingCollege ? "Edit College" : "Add New College"}
                </h2>
                <p className="text-sm text-indigo-100 mt-1">
                  Enter institution details
                </p>
              </div>

              <button
                onClick={() => setShowForm(false)}
                className="rounded-lg p-2 hover:bg-white/20"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  College Name
                </label>

                <input
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  placeholder="e.g. ABC Institute of Technology"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  College Code
                </label>

                <input
                  required
                  value={form.code}
                  onChange={(e) =>
                    setForm({ ...form, code: e.target.value })
                  }
                  placeholder="e.g. ABCIT"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Official Email
                </label>

                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  placeholder="college@example.com"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 rounded-xl border border-slate-200 py-3 font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3 font-semibold text-white shadow-lg shadow-indigo-200 hover:opacity-90 disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingCollege
                    ? "Update College"
                    : "Create College"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Colleges;
