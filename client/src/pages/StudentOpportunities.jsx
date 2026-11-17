import { useEffect, useState } from "react";
import api from "../lib/api";
import {
  Briefcase,
  RefreshCw,
  MapPin,
  CalendarDays,
  Gift,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";

const TYPES = ["PLACEMENT", "INTERNSHIP", "SCHOLARSHIP", "WORKSHOP"];

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

export default function StudentOpportunities() {
  const [tab, setTab] = useState("browse");
  const [opportunities, setOpportunities] = useState([]);
  const [applications, setApplications] = useState([]);
  const [typeFilter, setTypeFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applyingId, setApplyingId] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [opportunityRes, applicationRes] = await Promise.all([
        api.get("/opportunities"),
        api.get("/opportunities/my/applications"),
      ]);

      setOpportunities(opportunityRes.data);
      setApplications(applicationRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load opportunities.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApply = async (id) => {
    try {
      setApplyingId(id);
      await api.post(`/opportunities/${id}/apply`);
      alert("Applied successfully");
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to apply");
    } finally {
      setApplyingId(null);
    }
  };

  const filtered = opportunities.filter(
    (item) => !typeFilter || item.type === typeFilter
  );

  return (
    <div className="space-y-6 bg-gradient-to-br from-slate-50 via-white to-orange-50/30 p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Opportunities</h1>
          <p className="mt-2 text-slate-500">
            Placements, internships, scholarships and workshops for you.
          </p>
        </div>

        <button
          onClick={loadData}
          className="inline-flex items-center gap-2 rounded-xl border border-orange-100 bg-white px-4 py-3 text-sm font-semibold text-orange-700 shadow-sm hover:bg-orange-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="inline-flex rounded-xl bg-orange-50 p-1 text-sm font-semibold">
        {[
          ["browse", "Browse"],
          ["applications", `My Applications (${applications.length})`],
        ].map(([value, label]) => (
          <button
            key={value}
            onClick={() => setTab(value)}
            className={`rounded-lg px-5 py-2 transition ${
              tab === value ? "bg-white text-orange-700 shadow-sm" : "text-slate-500"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="h-40 animate-pulse rounded-2xl bg-orange-50" />
      ) : tab === "browse" ? (
        <>
          <div className="flex flex-wrap gap-2">
            {["", ...TYPES].map((type) => (
              <button
                key={type || "ALL"}
                onClick={() => setTypeFilter(type)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                  typeFilter === type
                    ? "bg-orange-500 text-white shadow"
                    : "bg-orange-50 text-orange-700 hover:bg-orange-100"
                }`}
              >
                {type || "ALL"}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-orange-100 bg-white py-16 text-center">
              <Briefcase className="mx-auto mb-3 text-orange-300" size={40} />
              <p className="font-semibold text-slate-800">
                No opportunities available
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col rounded-2xl border border-orange-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <span
                    className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${typeBadge[item.type]}`}
                  >
                    {item.type}
                  </span>

                  <h3 className="mt-4 text-lg font-bold text-slate-800">
                    {item.title}
                  </h3>
                  <p className="text-sm font-medium text-orange-600">
                    {item.organization}
                  </p>

                  <p className="mt-3 text-sm text-slate-600">
                    {item.description}
                  </p>

                  <div className="mt-4 space-y-1.5 text-xs text-slate-500">
                    {item.location && (
                      <p className="flex items-center gap-2">
                        <MapPin size={14} className="text-orange-400" />
                        {item.location}
                      </p>
                    )}
                    {item.benefit && (
                      <p className="flex items-center gap-2">
                        <Gift size={14} className="text-orange-400" />
                        {item.benefit}
                      </p>
                    )}
                    <p className="flex items-center gap-2">
                      <CalendarDays size={14} className="text-orange-400" />
                      Deadline: {formatDate(item.deadline)}
                    </p>
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-orange-600 hover:underline"
                      >
                        <ExternalLink size={14} />
                        More details
                      </a>
                    )}
                  </div>

                  <div className="mt-auto pt-5">
                    {item.applied ? (
                      <div className="flex items-center justify-between rounded-xl bg-orange-50/60 px-4 py-2.5">
                        <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                          <CheckCircle2 size={16} className="text-emerald-500" />
                          Applied
                        </span>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${statusBadge[item.myStatus]}`}
                        >
                          {item.myStatus}
                        </span>
                      </div>
                    ) : !item.isOpen ? (
                      <div className="rounded-xl bg-rose-50 px-4 py-2.5 text-center text-sm font-semibold text-rose-600">
                        Applications closed
                      </div>
                    ) : (
                      <button
                        onClick={() => handleApply(item.id)}
                        disabled={applyingId === item.id}
                        className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3 font-semibold text-white shadow-md shadow-orange-200 transition hover:shadow-lg disabled:opacity-60"
                      >
                        {applyingId === item.id ? "Applying..." : "Apply Now"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : applications.length === 0 ? (
        <div className="rounded-2xl border border-orange-100 bg-white py-16 text-center">
          <Briefcase className="mx-auto mb-3 text-orange-300" size={40} />
          <p className="font-semibold text-slate-800">
            You have not applied to anything yet
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-3 rounded-2xl border border-orange-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${typeBadge[item.opportunity?.type]}`}
                >
                  {item.opportunity?.type}
                </span>
                <h3 className="mt-2 font-bold text-slate-800">
                  {item.opportunity?.title}
                </h3>
                <p className="text-sm text-slate-500">
                  {item.opportunity?.organization} · Applied on{" "}
                  {formatDate(item.createdAt)}
                </p>
              </div>

              <span
                className={`w-fit rounded-full px-4 py-1.5 text-xs font-bold ${statusBadge[item.status]}`}
              >
                {item.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}