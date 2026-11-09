
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";
import {
  Users,
  Search,
  RefreshCw,
  GraduationCap,
  Eye,
} from "lucide-react";

export default function FacultyStudents() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/assignments/my-students");

      const data = response.data.students || response.data;

      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Faculty students error:", err);
      setError(
        err.response?.data?.message || "Unable to load students."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const filteredStudents = students.filter((student) =>
    `${student.name || ""} ${student.rollNumber || ""} ${
      student.email || ""
    }`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50/40 p-6">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-600 p-8 text-white shadow-xl shadow-emerald-200">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-emerald-200/20 blur-3xl" />

          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-teal-50">
                Academic Workspace
              </p>
              <h1 className="mt-2 text-3xl font-bold text-white">
                My Students
              </h1>
              <p className="mt-2 text-teal-50">
                Students enrolled in your assigned courses.
              </p>
            </div>

            <button
              onClick={loadStudents}
              className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 font-semibold text-teal-800 shadow-lg transition hover:bg-teal-50"
            >
              <RefreshCw size={18} /> Refresh
            </button>
          </div>
        </div>

        {/* Total Students */}
        <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-gradient-to-br from-orange-100 to-pink-100 p-3 text-orange-700">
              <Users size={26} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Students</p>
              <h2 className="text-2xl font-bold text-slate-800">
                {students.length}
              </h2>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="rounded-2xl border border-purple-100 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 transition focus-within:border-purple-300 focus-within:ring-4 focus-within:ring-purple-50">
            <Search size={20} className="text-purple-600" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, roll number or email..."
              className="w-full outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-teal-600">
            Loading students...
          </div>
        ) : error ? (
          <div className="rounded-xl bg-red-50 p-5 text-red-600">
            {error}
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="rounded-2xl border border-orange-100 bg-gradient-to-br from-white to-orange-50/40 p-12 text-center shadow-sm">
            <GraduationCap
              className="mx-auto mb-4 text-orange-400"
              size={45}
            />
            <h3 className="text-xl font-bold text-slate-700">
              No students found
            </h3>
            <p className="mt-2 text-slate-500">
              No students are enrolled in your assigned courses.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gradient-to-r from-purple-50 to-violet-50 text-sm text-purple-800">
                  <tr>
                    <th className="px-6 py-4">Student</th>
                    <th className="px-6 py-4">Roll Number</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="transition hover:bg-purple-50/50"
                    >
                      <td className="px-6 py-4 font-semibold text-slate-800">
                        {student.name}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {student.rollNumber || "—"}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {student.email}
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          to={`/faculty/students/${student.id}`}
                          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-violet-500 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:shadow-md"
                        >
                          <Eye size={16} /> View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
