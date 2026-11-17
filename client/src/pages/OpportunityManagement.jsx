import { useEffect, useState } from "react";
import api from "../lib/api";
import {
  Briefcase,
  Plus,
  Pencil,
  Trash2,
  Users,
  X,
  RefreshCw,
  Search,
  MapPin,
  CalendarDays,
  Gift,
  ExternalLink,
} from "lucide-react";

const TYPES = ["PLACEMENT", "INTERNSHIP", "SCHOLARSHIP", "WORKSHOP"];
const STATUSES = ["APPLIED", "SHORTLISTED", "SELECTED", "REJECTED"];

const typeBadge = {
  PLACEMENT: "bg-purple-50 text-purple-700",
  INTERNSHIP: "bg-blue-50 text-blue-700",
  SCHOLARSHIP: "bg-emerald-50 text-emerald-700",
  WORKSHOP: "bg-orange-50 text-orange-700",
};

const statusBadge = {
  APPLIED: "bg-slate-100 text-slate-700",
  SHORTLISTED: "bg-amber-50 text-amber-700",
  SELECTED: "bg-emerald-50 text-emerald-700",
  REJECTED: "bg-rose-50 text-rose-700",
};

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "-";

const emptyForm = {
  title: "",
  type: "PLACEMENT",
  organization: "",
  description: "",
  location: "",
  benefit: "",
  link: "",
  deadline: "",
};

export default function OpportunityManagement() {
  const [opportunities, setOpportunities] = useState([]);
  const [typeFilter, setTypeFilter] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [applicantsFor, setApplicantsFor] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [applicantsLoading, setApplicantsLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.get("/opportunities");
      setOpportunities(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch opportunities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      type: item.type,
      organization: item.organization,
      description: item.description,
      location: item.location || "",
      benefit: item.benefit || "",
      link: item.link || "",
      deadline: item.deadline ? item.deadline.slice(0, 10) : "",
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      if (editingId) {
        await api.put(`/opportunities/${editingId}`, form);
        alert("Opportunity updated successfully");
      } else {
        await api.post("/opportunities", form);
        alert("Opportunity created successfully");
      }

      setModalOpen(false);
      setForm(emptyForm);
      setEditingId(null);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Operation failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this opportunity and all its applications?"))
      return;

    try {
      await api.delete(`/opportunities/${id}`);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete");
    }
  };

  const openApplicants = async (item) => {
    setApplicantsFor(item);
    setApplicants([]);

    try {
      setApplicantsLoading(true);
      const response = await api.get(`/opportunities/${item.id}/applications`);
      setApplicants(response.data);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to fetch applicants");
    } finally {
      setApplicantsLoading(false);
    }
  };

  const changeStatus = async (applicationId, status) => {
    try {
      await api.put(`/opportunities/applications/${applicationId}/status`, {
        status,
      });

      setApplicants((prev) =>
        prev.map((item) =>
          item.id === applicationId ? { ...item, status } : item
        )
      );
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update status");
    }
  };

  const filtered = opportunities.filter((item) => {
    const query = search.toLowerCase();

    const matchesSearch =
      item.title.toLowerCase().includes(query) ||
      item.organization.toLowerCase().includes(query);

    const matchesType = !typeFilter || item.type === typeFilter;

    return matchesSearch && matchesType;
  });

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
                <Briefcase size={17} />
                Administration / Opportunities
              </div>
              <h1 className="text-3xl font-bold md:text-4xl">Opportunities</h1>
              <p className="mt-2 text-indigo-100">
                Placements, internships, scholarships and workshops.
              </p>
            </div>

            <button
              onClick={openCreate}
              className="flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-3 font-semibold text-slate-900 shadow-lg transition hover:bg-amber-300"
            >
              <Plus size={19} />
              Add Opportunity
            </button>
          </div>

          <div className="relative mt-7 inline-block rounded-xl border border-white/20 bg-white/15 px-4 py-3 backdrop-blur-md">
            <p className="text-xs text-indigo-100">Total Opportunities</p>
            <p className="text-2xl font-bold">{opportunities.length}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-3 rounded-2xl border border-purple-100 bg-white/90 p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400"
                size={19}
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title or organization..."
                className="w-full rounded-xl border border-purple-100 bg-purple-50/40 py-3 pl-10 pr-4 outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
              />
            </div>

            <button
              onClick={fetchData}
              className="flex items-center justify-center gap-2 rounded-xl border border-purple-100 px-4 py-3 font-medium text-purple-700 hover:bg-purple-50"
            >
              <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {["", ...TYPES].map((type) => (
              <button
                key={type || "ALL"}
                onClick={() => setTypeFilter(type)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                  typeFilter === type
                    ? "bg-purple-600 text-white shadow"
                    : "bg-purple-50 text-purple-700 hover:bg-purple-100"
                }`}
              >
                {type || "ALL"}
              </button>
            ))}
          </div>
        </div>

        {/* Cards */}
        {loading ? (
          <div className="rounded-2xl border border-purple-100 bg-white/80 py-16 text-center text-purple-600">
            <RefreshCw size={25} className="mx-auto mb-3 animate-spin" />
            Loading opportunities...
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-purple-100 bg-white/90 py-16 text-center">
            <Briefcase className="mx-auto mb-3 text-purple-300" size={40} />
            <h3 className="text-lg font-semibold text-slate-800">
              No opportunities found
            </h3>
            <p className="mt-2 text-slate-500">
              Add one or change the filters.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="relative flex flex-col overflow-hidden rounded-2xl border border-purple-100 bg-white/95 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-100/60"
              >
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${typeBadge[item.type]}`}
                  >
                    {item.type}
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
                  {item.title}
                </h3>
                <p className="text-sm font-medium text-purple-600">
                  {item.organization}
                </p>

                <p className="mt-3 line-clamp-3 text-sm text-slate-600">
                  {item.description}
                </p>

                <div className="mt-4 space-y-1.5 text-xs text-slate-500">
                  {item.location && (
                    <p className="flex items-center gap-2">
                      <MapPin size={14} className="text-purple-400" />
                      {item.location}
                    </p>
                  )}
                  {item.benefit && (
                    <p className="flex items-center gap-2">
                      <Gift size={14} className="text-purple-400" />
                      {item.benefit}
                    </p>
                  )}
                  <p className="flex items-center gap-2">
                    <CalendarDays size={14} className="text-purple-400" />
                    Deadline: {formatDate(item.deadline)}
                    {!item.isOpen && (
                      <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-600">
                        CLOSED
                      </span>
                    )}
                  </p>
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 text-purple-600 hover:underline"
                    >
                      <ExternalLink size={14} />
                      Link
                    </a>
                  )}
                </div>

                <button
                  onClick={() => openApplicants(item)}
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-purple-50 px-4 py-2.5 text-sm font-semibold text-purple-700 transition hover:bg-purple-100"
                >
                  <Users size={16} />
                  {item.applicantCount} Applicants
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Create / Edit Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
              <div className="flex items-center justify-between bg-gradient-to-r from-[#312e81] via-[#5b21b6] to-[#7c3aed] px-6 py-5 text-white">
                <h2 className="text-xl font-bold">
                  {editingId ? "Edit Opportunity" : "Add Opportunity"}
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
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Title (e.g. Software Engineer Intern)"
                  className={inputClass}
                />

                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className={inputClass}
                >
                  {TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>

                <input
                  required
                  value={form.organization}
                  onChange={(e) =>
                    setForm({ ...form, organization: e.target.value })
                  }
                  placeholder="Organization / Company"
                  className={inputClass}
                />

                <textarea
                  required
                  rows={4}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Description and eligibility"
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
                  value={form.benefit}
                  onChange={(e) =>
                    setForm({ ...form, benefit: e.target.value })
                  }
                  placeholder="Stipend / Package / Amount (optional)"
                  className={inputClass}
                />

                <input
                  type="url"
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  placeholder="Link (optional)"
                  className={inputClass}
                />

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Deadline
                  </label>
                  <input
                    required
                    type="date"
                    value={form.deadline}
                    onChange={(e) =>
                      setForm({ ...form, deadline: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>

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

        {/* Applicants Modal */}
        {applicantsFor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
              <div className="flex items-center justify-between bg-gradient-to-r from-[#312e81] via-[#5b21b6] to-[#7c3aed] px-6 py-5 text-white">
                <div>
                  <h2 className="text-lg font-bold">Applicants</h2>
                  <p className="text-xs text-purple-100">{applicantsFor.title}</p>
                </div>
                <button
                  onClick={() => setApplicantsFor(null)}
                  className="rounded-lg p-2 hover:bg-white/20"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6">
                {applicantsLoading ? (
                  <div className="py-10 text-center text-purple-600">
                    <RefreshCw size={24} className="mx-auto animate-spin" />
                  </div>
                ) : applicants.length === 0 ? (
                  <p className="py-10 text-center text-sm text-slate-500">
                    No one has applied yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {applicants.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col gap-3 rounded-xl border border-purple-100 bg-purple-50/30 p-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <p className="font-semibold text-slate-800">
                            {item.student?.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {item.student?.rollNumber} ·{" "}
                            {item.student?.department?.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {item.student?.email}
                            {item.student?.phone
                              ? ` · ${item.student.phone}`
                              : ""}
                          </p>
                        </div>

                        <select
                          value={item.status}
                          onChange={(e) => changeStatus(item.id, e.target.value)}
                          className={`rounded-lg border-0 px-3 py-2 text-xs font-bold outline-none ${statusBadge[item.status]}`}
                        >
                          {STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}