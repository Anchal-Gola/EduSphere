import { useEffect, useState } from "react";
import api from "../lib/api";
import {
  GraduationCap,
  Plus,
  Pencil,
  Trash2,
  X,
  RefreshCw,
  Search,
  Building2,
  Briefcase,
  MapPin,
  Inbox,
  Check,
  XCircle,
  CalendarDays,
} from "lucide-react";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  graduationYear: "",
  departmentId: "",
  collegeId: "",
  company: "",
  jobTitle: "",
  location: "",
  linkedin: "",
  bio: "",
};

export default function AlumniManagement() {
  const [tab, setTab] = useState("alumni");
  const [alumni, setAlumni] = useState([]);
  const [requests, setRequests] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState(null);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [alumniRes, requestsRes, deptRes, collegeRes] = await Promise.all([
        api.get("/alumni"),
        api.get("/alumni/requests"),
        api.get("/departments"),
        api.get("/colleges"),
      ]);
      setAlumni(alumniRes.data);
      setRequests(requestsRes.data);
      setDepartments(deptRes.data);
      setColleges(collegeRes.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch alumni data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      email: item.email,
      phone: item.phone || "",
      graduationYear: String(item.graduationYear),
      departmentId: item.departmentId,
      collegeId: item.collegeId,
      company: item.company || "",
      jobTitle: item.jobTitle || "",
      location: item.location || "",
      linkedin: item.linkedin || "",
      bio: item.bio || "",
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      if (editingId) {
        await api.put(`/alumni/${editingId}`, form);
        alert("Alumni updated successfully");
      } else {
        await api.post("/alumni", form);
        alert("Alumni created successfully");
      }

      setModalOpen(false);
      setForm(emptyForm);
      setEditingId(null);
      fetchAll();
    } catch (error) {
      alert(error.response?.data?.message || "Operation failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this alumni record?")) return;

    try {
      await api.delete(`/alumni/${id}`);
      fetchAll();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete");
    }
  };

  const handleApprove = async (id) => {
    try {
      setActionId(id);
      await api.put(`/alumni/requests/${id}/approve`);
      alert("Request approved");
      fetchAll();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to approve");
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Reject this request?")) return;

    try {
      setActionId(id);
      await api.put(`/alumni/requests/${id}/reject`);
      alert("Request rejected");
      fetchAll();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to reject");
    } finally {
      setActionId(null);
    }
  };

  const filteredAlumni = alumni.filter((item) => {
    const query = search.toLowerCase();
    return (
      item.name.toLowerCase().includes(query) ||
      item.email.toLowerCase().includes(query) ||
      (item.company || "").toLowerCase().includes(query) ||
      (item.jobTitle || "").toLowerCase().includes(query)
    );
  });

  const pendingRequests = requests.filter((r) => r.status === "PENDING");
  const processedRequests = requests.filter((r) => r.status !== "PENDING");

  const inputClass =
    "w-full rounded-xl border border-purple-100 bg-purple-50/30 px-4 py-3 text-sm outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-100";

  return (
    <div className="min-h-full bg-transparent p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-7">

        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-pink-500 p-7 text-white shadow-xl shadow-indigo-200 md:p-9">
          <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm text-indigo-100">
                <GraduationCap size={17} />
                Administration / Alumni
              </div>
              <h1 className="text-3xl font-bold md:text-4xl">Alumni Network</h1>
              <p className="mt-2 text-indigo-100">
                Manage alumni directory and approve self-enrollment requests.
              </p>
            </div>

            <button
              onClick={openCreate}
              className="flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-3 font-semibold text-slate-900 shadow-lg transition hover:bg-amber-300"
            >
              <Plus size={19} />
              Add Alumni
            </button>
          </div>

          <div className="relative mt-7 flex flex-wrap gap-3">
            <div className="rounded-xl border border-white/20 bg-white/15 px-4 py-3 backdrop-blur-md">
              <p className="text-xs text-indigo-100">Total Alumni</p>
              <p className="text-2xl font-bold">{alumni.length}</p>
            </div>
            <div className="rounded-xl border border-white/20 bg-white/15 px-4 py-3 backdrop-blur-md">
              <p className="text-xs text-indigo-100">Pending Requests</p>
              <p className="text-2xl font-bold">{pendingRequests.length}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 rounded-2xl border border-purple-100 bg-white/90 p-2 shadow-sm">
          {[
            { key: "alumni", label: "Alumni Directory" },
            {
              key: "requests",
              label: `Requests${
                pendingRequests.length ? ` (${pendingRequests.length})` : ""
              }`,
            },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                tab === item.key
                  ? "bg-purple-600 text-white shadow"
                  : "text-slate-600 hover:bg-purple-50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* ALUMNI TAB */}
        {tab === "alumni" && (
          <>
            <div className="rounded-2xl border border-purple-100 bg-white/90 p-4 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400"
                    size={19}
                  />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name, company or job title..."
                    className="w-full rounded-xl border border-purple-100 bg-purple-50/40 py-3 pl-10 pr-4 outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
                  />
                </div>

                <button
                  onClick={fetchAll}
                  className="flex items-center justify-center gap-2 rounded-xl border border-purple-100 px-4 py-3 font-medium text-purple-700 hover:bg-purple-50"
                >
                  <RefreshCw
                    size={17}
                    className={loading ? "animate-spin" : ""}
                  />
                  Refresh
                </button>
              </div>
            </div>

            {loading ? (
              <div className="rounded-2xl border border-purple-100 bg-white/80 py-16 text-center text-purple-600">
                <RefreshCw size={25} className="mx-auto mb-3 animate-spin" />
                Loading alumni...
              </div>
            ) : filteredAlumni.length === 0 ? (
              <div className="rounded-2xl border border-purple-100 bg-white/90 py-16 text-center">
                <GraduationCap
                  className="mx-auto mb-3 text-purple-300"
                  size={40}
                />
                <h3 className="text-lg font-semibold text-slate-800">
                  No alumni found
                </h3>
                <p className="mt-2 text-slate-500">
                  Add one or change the search.
                </p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filteredAlumni.map((item) => (
                  <div
                    key={item.id}
                    className="relative flex flex-col overflow-hidden rounded-2xl border border-purple-100 bg-white/95 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-100/60"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-bold text-purple-700">
                        Batch {item.graduationYear}
                      </span>

                      <div className="flex gap-1">
                        <button
                          onClick={() => openEdit(item)}
                          className="rounded-lg p-2 text-purple-600 hover:bg-purple-50"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="rounded-lg p-2 text-rose-500 hover:bg-rose-50"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <h3 className="mt-4 text-lg font-bold text-slate-900">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-500">{item.email}</p>

                    {item.bio && (
                      <p className="mt-3 line-clamp-2 text-sm text-slate-600">
                        {item.bio}
                      </p>
                    )}

                    <div className="mt-4 space-y-1.5 text-xs text-slate-500">
                      {item.jobTitle && (
                        <p className="flex items-center gap-2">
                          <Briefcase size={14} className="text-purple-400" />
                          {item.jobTitle}
                        </p>
                      )}
                      {item.company && (
                        <p className="flex items-center gap-2">
                          <Building2 size={14} className="text-purple-400" />
                          {item.company}
                        </p>
                      )}
                      {item.location && (
                        <p className="flex items-center gap-2">
                          <MapPin size={14} className="text-purple-400" />
                          {item.location}
                        </p>
                      )}
                      <p className="flex items-center gap-2">
                        <GraduationCap size={14} className="text-purple-400" />
                        {item.department?.name || "-"}
                      </p>
                    </div>

                    {item.linkedin && (
                      <a
                        href={item.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 hover:underline"
                      >
                       <Briefcase size={14} />
                        LinkedIn
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* REQUESTS TAB */}
        {tab === "requests" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-purple-100 bg-white/95 p-5 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
                <Inbox size={19} className="text-purple-600" />
                Pending Requests
              </h2>

              {pendingRequests.length === 0 ? (
                <p className="py-6 text-center text-sm text-slate-500">
                  No pending requests.
                </p>
              ) : (
                <div className="space-y-3">
                  {pendingRequests.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col gap-3 rounded-xl border border-purple-100 bg-purple-50/30 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-semibold text-slate-800">
                          {item.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {item.email}
                          {item.phone ? ` · ${item.phone}` : ""}
                        </p>
                        <p className="text-xs text-slate-500">
                          Batch {item.graduationYear} ·{" "}
                          {item.departmentName || "-"} ·{" "}
                          {item.collegeName || "-"}
                        </p>
                        {(item.company || item.jobTitle) && (
                          <p className="text-xs text-slate-500">
                            {item.jobTitle}
                            {item.jobTitle && item.company ? " at " : ""}
                            {item.company}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(item.id)}
                          disabled={actionId === item.id}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-60"
                        >
                          <Check size={14} />
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(item.id)}
                          disabled={actionId === item.id}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-rose-50 px-3 py-2 text-xs font-bold text-rose-600 transition hover:bg-rose-100 disabled:opacity-60"
                        >
                          <XCircle size={14} />
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {processedRequests.length > 0 && (
              <div className="rounded-2xl border border-purple-100 bg-white/95 p-5 shadow-sm">
                <h2 className="mb-4 text-lg font-bold text-slate-900">
                  Processed Requests
                </h2>
                <div className="space-y-2">
                  {processedRequests.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3 text-sm"
                    >
                      <div>
                        <p className="font-semibold text-slate-700">
                          {item.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {item.email} · Batch {item.graduationYear}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          item.status === "APPROVED"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-rose-50 text-rose-600"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Create / Edit Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
              <div className="flex items-center justify-between bg-gradient-to-r from-[#312e81] via-[#5b21b6] to-[#7c3aed] px-6 py-5 text-white">
                <h2 className="text-xl font-bold">
                  {editingId ? "Edit Alumni" : "Add Alumni"}
                </h2>
                <button
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg p-2 hover:bg-white/20"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 p-6">
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Full name"
                  className={inputClass}
                />

                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Email"
                  className={inputClass}
                />

                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="Phone (optional)"
                  className={inputClass}
                />

                <div className="grid grid-cols-2 gap-3">
                  <input
                    required
                    type="number"
                    min="1950"
                    max="2100"
                    value={form.graduationYear}
                    onChange={(e) =>
                      setForm({ ...form, graduationYear: e.target.value })
                    }
                    placeholder="Graduation year"
                    className={inputClass}
                  />

                  <select
                    required
                    value={form.collegeId}
                    onChange={(e) =>
                      setForm({ ...form, collegeId: e.target.value })
                    }
                    className={inputClass}
                  >
                    <option value="">Select College</option>
                    {colleges.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <select
                  required
                  value={form.departmentId}
                  onChange={(e) =>
                    setForm({ ...form, departmentId: e.target.value })
                  }
                  className={inputClass}
                >
                  <option value="">Select Department</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>

                <input
                  value={form.jobTitle}
                  onChange={(e) =>
                    setForm({ ...form, jobTitle: e.target.value })
                  }
                  placeholder="Job title (optional)"
                  className={inputClass}
                />

                <input
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  placeholder="Company (optional)"
                  className={inputClass}
                />

                <input
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                  placeholder="Location (optional)"
                  className={inputClass}
                />

                <input
                  type="url"
                  value={form.linkedin}
                  onChange={(e) =>
                    setForm({ ...form, linkedin: e.target.value })
                  }
                  placeholder="LinkedIn URL (optional)"
                  className={inputClass}
                />

                <textarea
                  rows={3}
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  placeholder="Short bio (optional)"
                  className={inputClass}
                />

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="flex-1 rounded-xl border border-purple-100 px-4 py-3 font-semibold text-slate-600 hover:bg-purple-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 px-4 py-3 font-semibold text-white shadow-lg shadow-purple-200 disabled:opacity-60"
                  >
                    {saving
                      ? "Saving..."
                      : editingId
                      ? "Save Changes"
                      : "Create"}
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