import { useEffect, useState } from "react";
import api from "../lib/api";
import {
  Wallet,
  Plus,
  RefreshCw,
  Trash2,
  CheckCircle2,
  Search,
  X,
  IndianRupee,
  Clock,
  AlertTriangle,
} from "lucide-react";

const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "-";

const badgeClass = {
  PAID: "bg-emerald-50 text-emerald-700",
  PENDING: "bg-amber-50 text-amber-700",
  OVERDUE: "bg-rose-50 text-rose-700",
};

const emptyForm = {
  studentId: "",
  departmentId: "",
  title: "",
  amount: "",
  dueDate: "",
};

const emptySummary = {
  totalAmount: 0,
  collectedAmount: 0,
  pendingAmount: 0,
  overdueAmount: 0,
};

export default function FeeManagement() {
  const [fees, setFees] = useState([]);
  const [summary, setSummary] = useState(emptySummary);
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [mode, setMode] = useState("student");
  const [form, setForm] = useState(emptyForm);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [payFee, setPayFee] = useState(null);
  const [payMethod, setPayMethod] = useState("CASH");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [feeRes, studentRes, departmentRes] = await Promise.all([
        api.get("/fees"),
        api.get("/students"),
        api.get("/departments"),
      ]);

      setFees(feeRes.data.fees || []);
      setSummary(feeRes.data.summary || emptySummary);
      setStudents(studentRes.data);
      setDepartments(departmentRes.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch fee data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssign = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const payload = {
        title: form.title,
        amount: form.amount,
        dueDate: form.dueDate,
        ...(mode === "student"
          ? { studentId: form.studentId }
          : { departmentId: form.departmentId }),
      };

      const response = await api.post("/fees", payload);
      alert(response.data.message);
      setForm(emptyForm);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to assign fee");
    } finally {
      setSaving(false);
    }
  };

  const handleMarkPaid = async () => {
    try {
      await api.put(`/fees/${payFee.id}/pay`, { paymentMethod: payMethod });
      alert("Fee marked as paid");
      setPayFee(null);
      setPayMethod("CASH");
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update fee");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this fee record?")) return;

    try {
      await api.delete(`/fees/${id}`);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete fee");
    }
  };

  const filteredFees = fees.filter((fee) => {
    const query = search.toLowerCase();

    const matchesSearch =
      fee.student?.name?.toLowerCase().includes(query) ||
      fee.student?.rollNumber?.toLowerCase().includes(query) ||
      fee.title.toLowerCase().includes(query);

    const matchesStatus = !statusFilter || fee.displayStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const inputClass =
    "w-full rounded-xl border border-purple-100 bg-purple-50/40 px-4 py-3 text-sm outline-none transition focus:border-purple-300 focus:ring-4 focus:ring-purple-100";

  const summaryCards = [
    { label: "Total Fees", value: summary.totalAmount, icon: Wallet, color: "from-purple-500 to-violet-600" },
    { label: "Collected", value: summary.collectedAmount, icon: CheckCircle2, color: "from-emerald-500 to-teal-600" },
    { label: "Pending", value: summary.pendingAmount, icon: Clock, color: "from-amber-400 to-orange-500" },
    { label: "Overdue", value: summary.overdueAmount, icon: AlertTriangle, color: "from-rose-500 to-pink-600" },
  ];

  return (
    <div className="min-h-full bg-transparent p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-7">

        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-pink-500 p-7 text-white shadow-xl shadow-indigo-200 md:p-9">
          <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="mb-3 text-sm font-semibold text-indigo-100">
                Administration / Fees
              </p>
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                Fee Management
              </h1>
              <p className="mt-3 max-w-xl text-sm text-indigo-100 md:text-base">
                Assign fees, track payments and issue receipts.
              </p>
            </div>

            <button
              onClick={fetchData}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white/15 px-5 py-3 font-semibold text-white ring-1 ring-white/30 transition hover:bg-white/25"
            >
              <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="rounded-2xl border border-purple-100 bg-white/95 p-5 shadow-sm"
              >
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${card.color} text-white shadow-md`}>
                  <Icon size={21} />
                </div>
                <p className="mt-4 text-sm text-slate-500">{card.label}</p>
                <p className="mt-1 text-2xl font-extrabold text-slate-900">
                  {money(card.value)}
                </p>
              </div>
            );
          })}
        </div>

        {/* Assign Fee */}
        <form
          onSubmit={handleAssign}
          className="rounded-2xl border border-purple-100 bg-white/95 p-5 shadow-sm sm:p-6"
        >
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 text-white shadow-md shadow-purple-200">
                <Plus size={23} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Assign Fee</h2>
                <p className="text-sm text-slate-500">
                  To one student or a whole department.
                </p>
              </div>
            </div>

            <div className="inline-flex rounded-xl bg-purple-50 p-1 text-sm font-semibold">
              {[
                ["student", "Single student"],
                ["department", "Whole department"],
              ].map(([value, label]) => (
                <button
                  type="button"
                  key={value}
                  onClick={() => setMode(value)}
                  className={`rounded-lg px-4 py-2 transition ${
                    mode === value
                      ? "bg-white text-purple-700 shadow-sm"
                      : "text-slate-500"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {mode === "student" ? (
              <select
                required
                value={form.studentId}
                onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                className={inputClass}
              >
                <option value="">Select Student</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.rollNumber})
                  </option>
                ))}
              </select>
            ) : (
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
                    {d.name} {d.college?.name ? `— ${d.college.name}` : ""}
                  </option>
                ))}
              </select>
            )}

            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Fee title (e.g. Semester 1 Tuition)"
              className={inputClass}
            />

            <input
              required
              type="number"
              min="1"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              placeholder="Amount in ₹"
              className={inputClass}
            />

            <input
              required
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 px-6 py-3 font-semibold text-white shadow-lg shadow-purple-200 transition hover:shadow-xl disabled:opacity-60"
          >
            <Plus size={18} />
            {saving ? "Assigning..." : "Assign Fee"}
          </button>
        </form>

        {/* Fee Records */}
        <div className="rounded-2xl border border-purple-100 bg-white/95 p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="text-xl font-bold text-slate-900">Fee Records</h2>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400"
                  size={17}
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search student, roll no or title..."
                  className="w-full rounded-xl border border-purple-100 bg-purple-50/40 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-purple-300 focus:ring-4 focus:ring-purple-100 sm:w-72"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-purple-100 bg-white px-4 py-2.5 text-sm outline-none focus:border-purple-300 focus:ring-4 focus:ring-purple-100"
              >
                <option value="">All statuses</option>
                <option value="PAID">Paid</option>
                <option value="PENDING">Pending</option>
                <option value="OVERDUE">Overdue</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="py-14 text-center text-purple-600">
              <RefreshCw size={26} className="mx-auto mb-3 animate-spin" />
              Loading fees...
            </div>
          ) : filteredFees.length === 0 ? (
            <div className="py-14 text-center">
              <IndianRupee className="mx-auto mb-3 text-purple-300" size={38} />
              <p className="font-semibold text-slate-800">No fee records found</p>
              <p className="mt-1 text-sm text-slate-500">
                Assign a fee above or change the filters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead>
                  <tr className="border-b border-purple-100 text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-3 py-3">Student</th>
                    <th className="px-3 py-3">Fee</th>
                    <th className="px-3 py-3">Amount</th>
                    <th className="px-3 py-3">Due Date</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFees.map((fee) => (
                    <tr key={fee.id} className="border-b border-purple-50">
                      <td className="px-3 py-3">
                        <p className="font-semibold text-slate-800">
                          {fee.student?.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {fee.student?.rollNumber}
                        </p>
                      </td>
                      <td className="px-3 py-3 text-slate-700">{fee.title}</td>
                      <td className="px-3 py-3 font-bold text-slate-900">
                        {money(fee.amount)}
                      </td>
                      <td className="px-3 py-3 text-slate-600">
                        {formatDate(fee.dueDate)}
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${badgeClass[fee.displayStatus]}`}
                        >
                          {fee.displayStatus}
                        </span>
                        {fee.receiptNumber && (
                          <p className="mt-1 text-[11px] text-slate-400">
                            {fee.receiptNumber}
                          </p>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex justify-end gap-2">
                          {fee.status !== "PAID" && (
                            <button
                              onClick={() => setPayFee(fee)}
                              className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100"
                            >
                              Mark Paid
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(fee.id)}
                            className="rounded-lg p-2 text-rose-500 transition hover:bg-rose-50"
                            title="Delete fee"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Mark Paid Modal */}
        {payFee && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
              <div className="flex items-center justify-between bg-gradient-to-r from-[#312e81] via-[#5b21b6] to-[#7c3aed] px-6 py-5 text-white">
                <h2 className="text-lg font-bold">Mark Fee as Paid</h2>
                <button
                  onClick={() => setPayFee(null)}
                  className="rounded-lg p-2 hover:bg-white/20"
                >
                  <X size={19} />
                </button>
              </div>

              <div className="space-y-4 p-6">
                <div className="rounded-xl bg-purple-50/70 p-4 text-sm">
                  <p className="font-semibold text-slate-800">
                    {payFee.student?.name} · {payFee.title}
                  </p>
                  <p className="mt-1 text-lg font-extrabold text-purple-700">
                    {money(payFee.amount)}
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Payment Method
                  </label>
                  <select
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value)}
                    className={inputClass}
                  >
                    <option value="CASH">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="CARD">Card</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-1">
                  <button
                    onClick={() => setPayFee(null)}
                    className="flex-1 rounded-xl border border-purple-100 px-4 py-3 font-semibold text-slate-600 hover:bg-purple-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleMarkPaid}
                    className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-3 font-semibold text-white shadow-lg shadow-emerald-200"
                  >
                    Confirm Payment
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}