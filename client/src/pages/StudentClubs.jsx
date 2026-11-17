import { useEffect, useState } from "react";
import api from "../lib/api";
import {
  UsersRound,
  RefreshCw,
  Search,
  Users,
  Check,
  LogOut,
  Tag,
} from "lucide-react";

export default function StudentClubs() {
  const [clubs, setClubs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionId, setActionId] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.get("/clubs");
      setClubs(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch clubs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleJoin = async (id) => {
    try {
      setActionId(id);
      await api.post(`/clubs/${id}/join`);
      setClubs((prev) =>
        prev.map((club) =>
          club.id === id
            ? { ...club, joined: true, memberCount: club.memberCount + 1 }
            : club
        )
      );
    } catch (error) {
      alert(error.response?.data?.message || "Failed to join club");
    } finally {
      setActionId(null);
    }
  };

  const handleLeave = async (id) => {
    if (!window.confirm("Leave this club?")) return;

    try {
      setActionId(id);
      await api.delete(`/clubs/${id}/leave`);
      setClubs((prev) =>
        prev.map((club) =>
          club.id === id
            ? {
                ...club,
                joined: false,
                memberCount: Math.max(0, club.memberCount - 1),
              }
            : club
        )
      );
    } catch (error) {
      alert(error.response?.data?.message || "Failed to leave club");
    } finally {
      setActionId(null);
    }
  };

  const filtered = clubs.filter((item) => {
    const query = search.toLowerCase();
    return (
      item.name.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-full bg-transparent p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-7">

        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-400 p-7 text-white shadow-xl shadow-orange-200 md:p-9">
          <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full bg-white/15 blur-3xl" />

          <div className="relative">
            <div className="mb-3 flex items-center gap-2 text-sm text-orange-50">
              <UsersRound size={17} />
              Student Portal / Clubs
            </div>
            <h1 className="text-3xl font-bold md:text-4xl">Clubs</h1>
            <p className="mt-2 text-orange-50">
              Discover clubs and join the ones you like.
            </p>

            <div className="mt-7 inline-block rounded-xl border border-white/20 bg-white/15 px-4 py-3 backdrop-blur-md">
              <p className="text-xs text-orange-50">Total Clubs</p>
              <p className="text-2xl font-bold">{clubs.length}</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="rounded-2xl border border-orange-100 bg-white/90 p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400"
                size={19}
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or category..."
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
        </div>

        {/* Cards */}
        {loading ? (
          <div className="rounded-2xl border border-orange-100 bg-white/80 py-16 text-center text-orange-600">
            <RefreshCw size={25} className="mx-auto mb-3 animate-spin" />
            Loading clubs...
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-orange-100 bg-white/90 py-16 text-center">
            <UsersRound className="mx-auto mb-3 text-orange-300" size={40} />
            <h3 className="text-lg font-semibold text-slate-800">
              No clubs found
            </h3>
            <p className="mt-2 text-slate-500">Try a different search.</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="relative flex flex-col overflow-hidden rounded-2xl border border-orange-100 bg-white/95 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-100/60"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700">
                    {item.category}
                  </span>

                  {item.joined && (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                      <Check size={12} />
                      JOINED
                    </span>
                  )}
                </div>

                <h3 className="mt-4 text-lg font-bold text-slate-900">
                  {item.name}
                </h3>

                <p className="mt-3 line-clamp-3 text-sm text-slate-600">
                  {item.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Users size={14} className="text-orange-400" />
                    {item.memberCount} Members
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Tag size={14} className="text-orange-400" />
                    {item.eventCount} Events
                  </span>
                </div>

                {item.joined ? (
                  <button
                    onClick={() => handleLeave(item.id)}
                    disabled={actionId === item.id}
                    className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-100 disabled:opacity-60"
                  >
                    <LogOut size={16} />
                    {actionId === item.id ? "Leaving..." : "Leave Club"}
                  </button>
                ) : (
                  <button
                    onClick={() => handleJoin(item.id)}
                    disabled={actionId === item.id}
                    className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-orange-200 transition hover:from-orange-600 hover:to-amber-600 disabled:opacity-60"
                  >
                    <Check size={16} />
                    {actionId === item.id ? "Joining..." : "Join Club"}
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