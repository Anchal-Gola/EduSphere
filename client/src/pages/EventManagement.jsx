import { useEffect, useState } from "react";
import api from "../lib/api";
import {
  CalendarDays,
  Plus,
  Pencil,
  Trash2,
  Users,
  X,
  RefreshCw,
  Search,
  MapPin,
  Building2,
} from "lucide-react";

const formatDateTime = (value) =>
  value
    ? new Date(value).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-";

const emptyForm = {
  title: "",
  description: "",
  venue: "",
  date: "",
  clubId: "",
};

export default function EventManagement() {
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [registrationsFor, setRegistrationsFor] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [registrationsLoading, setRegistrationsLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [eventsRes, clubsRes] = await Promise.all([
        api.get("/events"),
        api.get("/clubs"),
      ]);
      setEvents(eventsRes.data);
      setClubs(clubsRes.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch events");
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
      description: item.description,
      venue: item.venue,
      date: item.date ? new Date(item.date).toISOString().slice(0, 16) : "",
      clubId: item.clubId || "",
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const payload = { ...form, clubId: form.clubId || null };

      if (editingId) {
        await api.put(`/events/${editingId}`, payload);
        alert("Event updated successfully");
      } else {
        await api.post("/events", payload);
        alert("Event created successfully");
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
    if (!window.confirm("Delete this event and all its registrations?")) return;

    try {
      await api.delete(`/events/${id}`);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete");
    }
  };

  const openRegistrations = async (item) => {
    setRegistrationsFor(item);
    setRegistrations([]);

    try {
      setRegistrationsLoading(true);
      const response = await api.get(`/events/${item.id}/registrations`);
      setRegistrations(response.data);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to fetch registrations");
    } finally {
      setRegistrationsLoading(false);
    }
  };

  const filtered = events.filter((item) => {
    const query = search.toLowerCase();
    return (
      item.title.toLowerCase().includes(query) ||
      item.venue.toLowerCase().includes(query) ||
      (item.club?.name || "").toLowerCase().includes(query)
    );
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
                <CalendarDays size={17} />
                Administration / Events
              </div>
              <h1 className="text-3xl font-bold md:text-4xl">Events</h1>
              <p className="mt-2 text-indigo-100">
                College-wide events and club events.
              </p>
            </div>

            <button
              onClick={openCreate}
              className="flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-3 font-semibold text-slate-900 shadow-lg transition hover:bg-amber-300"
            >
              <Plus size={19} />
              Add Event
            </button>
          </div>

          <div className="relative mt-7 inline-block rounded-xl border border-white/20 bg-white/15 px-4 py-3 backdrop-blur-md">
            <p className="text-xs text-indigo-100">Total Events</p>
            <p className="text-2xl font-bold">{events.length}</p>
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
                placeholder="Search by title, venue or club..."
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
        </div>

        {/* Cards */}
        {loading ? (
          <div className="rounded-2xl border border-purple-100 bg-white/80 py-16 text-center text-purple-600">
            <RefreshCw size={25} className="mx-auto mb-3 animate-spin" />
            Loading events...
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-purple-100 bg-white/90 py-16 text-center">
            <CalendarDays className="mx-auto mb-3 text-purple-300" size={40} />
            <h3 className="text-lg font-semibold text-slate-800">
              No events found
            </h3>
            <p className="mt-2 text-slate-500">Add one or change the search.</p>
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
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      item.club
                        ? "bg-violet-50 text-violet-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {item.club ? item.club.name : "GENERAL"}
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

                <p className="mt-3 line-clamp-3 text-sm text-slate-600">
                  {item.description}
                </p>

                <div className="mt-4 space-y-1.5 text-xs text-slate-500">
                  <p className="flex items-center gap-2">
                    <MapPin size={14} className="text-purple-400" />
                    {item.venue}
                  </p>
                  <p className="flex items-center gap-2">
                    <CalendarDays size={14} className="text-purple-400" />
                    {formatDateTime(item.date)}
                    {!item.isUpcoming && (
                      <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-600">
                        ENDED
                      </span>
                    )}
                  </p>
                  {item.club && (
                    <p className="flex items-center gap-2">
                      <Building2 size={14} className="text-purple-400" />
                      {item.club.name}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => openRegistrations(item)}
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-purple-50 px-4 py-2.5 text-sm font-semibold text-purple-700 transition hover:bg-purple-100"
                >
                  <Users size={16} />
                  {item.registrationCount} Registered
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
                  {editingId ? "Edit Event" : "Add Event"}
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
                  placeholder="Event title"
                  className={inputClass}
                />

                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Description"
                  className={inputClass}
                />

                <input
                  required
                  value={form.venue}
                  onChange={(e) => setForm({ ...form, venue: e.target.value })}
                  placeholder="Venue"
                  className={inputClass}
                />

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Date & Time
                  </label>
                  <input
                    required
                    type="datetime-local"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Club (optional)
                  </label>
                  <select
                    value={form.clubId}
                    onChange={(e) =>
                      setForm({ ...form, clubId: e.target.value })
                    }
                    className={inputClass}
                  >
                    <option value="">General (no club)</option>
                    {clubs.map((club) => (
                      <option key={club.id} value={club.id}>
                        {club.name}
                      </option>
                    ))}
                  </select>
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

        {/* Registrations Modal */}
        {registrationsFor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
              <div className="flex items-center justify-between bg-gradient-to-r from-[#312e81] via-[#5b21b6] to-[#7c3aed] px-6 py-5 text-white">
                <div>
                  <h2 className="text-lg font-bold">Registrations</h2>
                  <p className="text-xs text-purple-100">
                    {registrationsFor.title}
                  </p>
                </div>
                <button
                  onClick={() => setRegistrationsFor(null)}
                  className="rounded-lg p-2 hover:bg-white/20"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6">
                {registrationsLoading ? (
                  <div className="py-10 text-center text-purple-600">
                    <RefreshCw size={24} className="mx-auto animate-spin" />
                  </div>
                ) : registrations.length === 0 ? (
                  <p className="py-10 text-center text-sm text-slate-500">
                    No one has registered yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {registrations.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col gap-2 rounded-xl border border-purple-100 bg-purple-50/30 p-4 sm:flex-row sm:items-center sm:justify-between"
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
                          </p>
                        </div>
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