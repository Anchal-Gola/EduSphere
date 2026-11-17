import { useEffect, useState } from "react";
import api from "../lib/api";
import {
  CalendarDays,
  RefreshCw,
  Search,
  MapPin,
  Building2,
  Users,
  Check,
  X,
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

export default function StudentEvents() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [actionId, setActionId] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.get("/events");
      setEvents(response.data);
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

  const handleRegister = async (id) => {
    try {
      setActionId(id);
      await api.post(`/events/${id}/register`);
      setEvents((prev) =>
        prev.map((event) =>
          event.id === id
            ? {
                ...event,
                registered: true,
                registrationCount: event.registrationCount + 1,
              }
            : event
        )
      );
    } catch (error) {
      alert(error.response?.data?.message || "Failed to register");
    } finally {
      setActionId(null);
    }
  };

  const handleUnregister = async (id) => {
    if (!window.confirm("Cancel your registration for this event?")) return;

    try {
      setActionId(id);
      await api.delete(`/events/${id}/register`);
      setEvents((prev) =>
        prev.map((event) =>
          event.id === id
            ? {
                ...event,
                registered: false,
                registrationCount: Math.max(0, event.registrationCount - 1),
              }
            : event
        )
      );
    } catch (error) {
      alert(error.response?.data?.message || "Failed to cancel");
    } finally {
      setActionId(null);
    }
  };

  const filtered = events.filter((item) => {
    const query = search.toLowerCase();

    const matchesSearch =
      item.title.toLowerCase().includes(query) ||
      item.venue.toLowerCase().includes(query) ||
      (item.club?.name || "").toLowerCase().includes(query);

    const matchesTab =
      tab === "ALL" ||
      (tab === "UPCOMING" && item.isUpcoming) ||
      (tab === "PAST" && !item.isUpcoming) ||
      (tab === "MINE" && item.registered);

    return matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-full bg-transparent p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-7">

        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-400 p-7 text-white shadow-xl shadow-orange-200 md:p-9">
          <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full bg-white/15 blur-3xl" />

          <div className="relative">
            <div className="mb-3 flex items-center gap-2 text-sm text-orange-50">
              <CalendarDays size={17} />
              Student Portal / Events
            </div>
            <h1 className="text-3xl font-bold md:text-4xl">Events</h1>
            <p className="mt-2 text-orange-50">
              Browse upcoming events and register to attend.
            </p>

            <div className="mt-7 inline-block rounded-xl border border-white/20 bg-white/15 px-4 py-3 backdrop-blur-md">
              <p className="text-xs text-orange-50">Total Events</p>
              <p className="text-2xl font-bold">{events.length}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-3 rounded-2xl border border-orange-100 bg-white/90 p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400"
                size={19}
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, venue or club..."
                className="w-full rounded-xl border border-orange-100 bg-orange-50/40 py-3 pl-10 pr-4 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
              />
            </div>

            <button
              onClick={fetchData}
              className="flex items-center justify-center gap-2 rounded-xl border border-orange-100 px-4 py-3 font-medium text-orange-700 hover:bg-orange-50"
            >
              <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { key: "ALL", label: "ALL" },
              { key: "UPCOMING", label: "UPCOMING" },
              { key: "PAST", label: "PAST" },
              { key: "MINE", label: "MY REGISTRATIONS" },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setTab(item.key)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                  tab === item.key
                    ? "bg-orange-500 text-white shadow"
                    : "bg-orange-50 text-orange-700 hover:bg-orange-100"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cards */}
        {loading ? (
          <div className="rounded-2xl border border-orange-100 bg-white/80 py-16 text-center text-orange-600">
            <RefreshCw size={25} className="mx-auto mb-3 animate-spin" />
            Loading events...
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-orange-100 bg-white/90 py-16 text-center">
            <CalendarDays className="mx-auto mb-3 text-orange-300" size={40} />
            <h3 className="text-lg font-semibold text-slate-800">
              No events found
            </h3>
            <p className="mt-2 text-slate-500">
              Try a different filter or search.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="relative flex flex-col overflow-hidden rounded-2xl border border-orange-100 bg-white/95 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-100/60"
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

                  {item.registered && (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                      <Check size={12} />
                      REGISTERED
                    </span>
                  )}
                </div>

                <h3 className="mt-4 text-lg font-bold text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-3 line-clamp-3 text-sm text-slate-600">
                  {item.description}
                </p>

                <div className="mt-4 space-y-1.5 text-xs text-slate-500">
                  <p className="flex items-center gap-2">
                    <MapPin size={14} className="text-orange-400" />
                    {item.venue}
                  </p>
                  <p className="flex items-center gap-2">
                    <CalendarDays size={14} className="text-orange-400" />
                    {formatDateTime(item.date)}
                    {!item.isUpcoming && (
                      <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-600">
                        ENDED
                      </span>
                    )}
                  </p>
                  {item.club && (
                    <p className="flex items-center gap-2">
                      <Building2 size={14} className="text-orange-400" />
                      {item.club.name}
                    </p>
                  )}
                  <p className="flex items-center gap-2">
                    <Users size={14} className="text-orange-400" />
                    {item.registrationCount} Registered
                  </p>
                </div>

                {!item.isUpcoming ? (
                  <button
                    disabled
                    className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-400"
                  >
                    Event Ended
                  </button>
                ) : item.registered ? (
                  <button
                    onClick={() => handleUnregister(item.id)}
                    disabled={actionId === item.id}
                    className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-100 disabled:opacity-60"
                  >
                    <X size={16} />
                    {actionId === item.id ? "Cancelling..." : "Cancel Registration"}
                  </button>
                ) : (
                  <button
                    onClick={() => handleRegister(item.id)}
                    disabled={actionId === item.id}
                    className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-orange-200 transition hover:from-orange-600 hover:to-amber-600 disabled:opacity-60"
                  >
                    <Check size={16} />
                    {actionId === item.id ? "Registering..." : "Register"}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}