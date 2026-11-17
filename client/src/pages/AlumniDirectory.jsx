import { useEffect, useState } from "react";
import api from "../lib/api";
import {
  GraduationCap,
  RefreshCw,
  Search,
  Building2,
  Briefcase,
  MapPin,
  ExternalLink,
  CalendarDays,
} from "lucide-react";

export default function AlumniDirectory() {
  const [alumni, setAlumni] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [alumniRes, deptRes] = await Promise.all([
        api.get("/alumni"),
        api.get("/departments"),
      ]);
      setAlumni(alumniRes.data);
      setDepartments(deptRes.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch alumni");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const years = [...new Set(alumni.map((a) => a.graduationYear))].sort(
    (a, b) => b - a
  );

  const filtered = alumni.filter((item) => {
    const query = search.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(query) ||
      item.email.toLowerCase().includes(query) ||
      (item.company || "").toLowerCase().includes(query) ||
      (item.jobTitle || "").toLowerCase().includes(query);

    const matchesDept =
      !departmentFilter || item.departmentId === departmentFilter;
    const matchesYear =
      !yearFilter || String(item.graduationYear) === String(yearFilter);

    return matchesSearch && matchesDept && matchesYear;
  });

  return (
    <div className="min-h-full bg-transparent p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-7">

        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-400 p-7 text-white shadow-xl shadow-orange-200 md:p-9">
          <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full bg-white/15 blur-3xl" />

          <div className="relative">
            <div className="mb-3 flex items-center gap-2 text-sm text-orange-50">
              <GraduationCap size={17} />
              Alumni Network
            </div>
            <h1 className="text-3xl font-bold md:text-4xl">Alumni Directory</h1>
            <p className="mt-2 text-orange-50">
              Explore our alumni network — connect with seniors across companies
              and industries.
            </p>

            <div className="mt-7 inline-block rounded-xl border border-white/20 bg-white/15 px-4 py-3 backdrop-blur-md">
              <p className="text-xs text-orange-50">Total Alumni</p>
              <p className="text-2xl font-bold">{alumni.length}</p>
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
                placeholder="Search by name, company or job title..."
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

          <div className="grid gap-3 sm:grid-cols-2">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="rounded-xl border border-orange-100 bg-white px-4 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
            >
              <option value="">All departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>

            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="rounded-xl border border-orange-100 bg-white px-4 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
            >
              <option value="">All batches</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  Batch {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Cards */}
        {loading ? (
          <div className="rounded-2xl border border-orange-100 bg-white/80 py-16 text-center text-orange-600">
            <RefreshCw size={25} className="mx-auto mb-3 animate-spin" />
            Loading alumni...
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-orange-100 bg-white/90 py-16 text-center">
            <GraduationCap className="mx-auto mb-3 text-orange-300" size={40} />
            <h3 className="text-lg font-semibold text-slate-800">
              No alumni found
            </h3>
            <p className="mt-2 text-slate-500">
              Try different filters or search.
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
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-200 to-amber-100 text-orange-700 font-bold text-lg">
                      {item.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{item.name}</h3>
                      <p className="text-xs text-slate-500">{item.email}</p>
                    </div>
                  </div>
                </div>

                <span className="mt-4 inline-block w-fit rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700">
                  Batch {item.graduationYear}
                </span>

                {item.bio && (
                  <p className="mt-3 line-clamp-2 text-sm text-slate-600">
                    {item.bio}
                  </p>
                )}

                <div className="mt-4 space-y-1.5 text-xs text-slate-500">
                  {item.jobTitle && (
                    <p className="flex items-center gap-2">
                      <Briefcase size={14} className="text-orange-400" />
                      {item.jobTitle}
                    </p>
                  )}
                  {item.company && (
                    <p className="flex items-center gap-2">
                      <Building2 size={14} className="text-orange-400" />
                      {item.company}
                    </p>
                  )}
                  {item.location && (
                    <p className="flex items-center gap-2">
                      <MapPin size={14} className="text-orange-400" />
                      {item.location}
                    </p>
                  )}
                  <p className="flex items-center gap-2">
                    <GraduationCap size={14} className="text-orange-400" />
                    {item.department?.name || "-"}
                    {item.college?.name ? ` · ${item.college.name}` : ""}
                  </p>
                </div>

                {item.linkedin && (
                  <a
                    href={item.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-lg bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-700 hover:bg-orange-100"
                  >
                    <ExternalLink size={14} />
                    LinkedIn
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}