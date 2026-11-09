
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
    <div className="min-h-full bg-transparent p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-7">
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-pink-500 p-7 text-white shadow-xl shadow-indigo-200 md:p-9">
          <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-pink-300/20 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm text-indigo-100">
                <Building2 size={17} />
                Administration / Colleges
              </div>

              <h1 className="text-3xl font-bold md:text-4xl">
                Colleges
              </h1>

              <p className="mt-2 text-indigo-100">
                Manage institutions connected to EduSphere.
              </p>
            </div>

            <button
              onClick={openCreateForm}
              className="flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-3 font-semibold text-slate-900 shadow-lg transition hover:bg-amber-300"
            >
              <Plus size={19} />
              Add College
            </button>
          </div>

          <div className="relative mt-7">
            <div className="inline-block rounded-xl border border-white/20 bg-white/15 px-4 py-3 backdrop-blur-md">
              <p className="text-xs text-indigo-100">Total Colleges</p>
              <p className="text-2xl font-bold">{colleges.length}</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="flex flex-col gap-3 rounded-2xl border border-purple-100 bg-white/90 p-4 shadow-sm backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-xl flex-1">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={19}
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search colleges by name, code or email..."
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 outline-none transition focus:border-purple-300 focus:ring-2 focus:ring-purple-200"
            />
          </div>

          <button
            onClick={fetchColleges}
            className="flex items-center justify-center gap-2 rounded-xl border border-purple-100 bg-white px-4 py-3 text-slate-600 transition hover:bg-purple-50 hover:text-purple-600"
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
          <div className="py-20 text-center text-purple-600">
            <RefreshCw className="mx-auto mb-3 animate-spin" size={28} />
            Loading colleges...
          </div>
        ) : filteredColleges.length === 0 ? (
          <div className="rounded-2xl border border-purple-100 bg-white py-16 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-100 to-violet-100 text-purple-600">
              <Building2 size={30} />
            </div>

            <h3 className="text-lg font-semibold text-slate-800">
              No colleges found
            </h3>

            <p className="mt-1 text-slate-500">
              Add your first college to get started.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredColleges.map((college, index) => (
              <div
                key={college.id}
                className="group relative overflow-hidden rounded-2xl border border-purple-100 bg-white/95 p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-100/60"
              >
                {/* Gradient top strip */}
                <div
                  className={`absolute inset-x-0 top-0 h-1 ${
                    index % 3 === 0
                      ? "bg-gradient-to-r from-purple-500 to-violet-500"
                      : index % 3 === 1
                      ? "bg-gradient-to-r from-orange-400 to-pink-500"
                      : "bg-gradient-to-r from-violet-500 to-indigo-500"
                  }`}
                />

                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 text-white shadow-md shadow-purple-200">
                    <Building2 size={23} />
                  </div>

                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                    Active
                  </span>
                </div>

                <h3 className="mt-5 text-xl font-bold text-slate-900">
                  {college.name}
                </h3>

                <div className="mt-4 rounded-xl border border-orange-100 bg-gradient-to-r from-orange-50 to-pink-50 p-3">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-orange-600">
                    College Information
                  </p>

                  <div className="space-y-2 text-sm text-slate-600">
                    <p className="flex items-center gap-2">
                      <Hash size={15} className="shrink-0 text-purple-500" />
                      <span className="font-medium">{college.code}</span>
                    </p>

                    <p className="flex items-center gap-2 break-all">
                      <Mail size={15} className="shrink-0 text-pink-500" />
                      {college.email}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between rounded-xl border border-purple-100 bg-purple-50/60 px-3 py-3">
                  <span className="text-xs font-medium text-purple-700">
                    Departments
                  </span>

                  <span className="rounded-lg bg-white px-3 py-1 text-sm font-bold text-purple-700 shadow-sm">
                    {college.departments?.length || 0}
                  </span>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-purple-100 pt-4">
                  <span className="text-xs text-slate-400">
                    Institution details
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditForm(college)}
                      className="rounded-lg p-2 text-purple-600 transition hover:bg-purple-50"
                      title="Edit college"
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      onClick={() => handleDelete(college)}
                      className="rounded-lg p-2 text-rose-500 transition hover:bg-rose-50"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-2xl">
              <div className="flex items-center justify-between bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 px-6 py-5 text-white">
                <div>
                  <h2 className="text-xl font-bold">
                    {editingCollege ? "Edit College" : "Add New College"}
                  </h2>
                  <p className="mt-1 text-sm text-indigo-100">
                    Enter institution details
                  </p>
                </div>

                <button
                  onClick={() => setShowForm(false)}
                  className="rounded-lg p-2 transition hover:bg-white/20"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 p-6">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    College Name
                  </label>

                  <input
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    placeholder="e.g. ABC Institute of Technology"
                    className="w-full rounded-xl border border-purple-100 px-4 py-3 outline-none transition focus:border-purple-300 focus:ring-2 focus:ring-purple-200"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    College Code
                  </label>

                  <input
                    required
                    value={form.code}
                    onChange={(e) =>
                      setForm({ ...form, code: e.target.value })
                    }
                    placeholder="e.g. ABCIT"
                    className="w-full rounded-xl border border-purple-100 px-4 py-3 outline-none transition focus:border-purple-300 focus:ring-2 focus:ring-purple-200"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
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
                    className="w-full rounded-xl border border-purple-100 px-4 py-3 outline-none transition focus:border-purple-300 focus:ring-2 focus:ring-purple-200"
                  />
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 rounded-xl border border-purple-100 py-3 font-semibold text-slate-600 transition hover:bg-purple-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 py-3 font-semibold text-white shadow-lg shadow-purple-200 transition hover:opacity-90 disabled:opacity-60"
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
    </div>
  );
}

export default Colleges;
