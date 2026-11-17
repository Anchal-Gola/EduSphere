import { useEffect, useState } from "react";
import api from "../lib/api";
import {
  Wallet,
  RefreshCw,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Receipt,
  X,
  Printer,
  IndianRupee,
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

const emptySummary = {
  totalAmount: 0,
  collectedAmount: 0,
  pendingAmount: 0,
  overdueAmount: 0,
};

export default function StudentFees() {
  const [fees, setFees] = useState([]);
  const [summary, setSummary] = useState(emptySummary);
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadFees = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/fees/my");
      setFees(response.data.fees || []);
      setSummary(response.data.summary || emptySummary);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load fees.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFees();
  }, []);

  const openReceipt = async (id) => {
    try {
      const response = await api.get(`/fees/my/${id}`);
      setReceipt(response.data);
    } catch (err) {
      alert(err.response?.data?.message || "Unable to load receipt");
    }
  };

  const printReceipt = () => {
    const r = receipt;
    const w = window.open("", "_blank", "width=700,height=800");

    w.document.write(`
      <html>
        <head>
          <title>Receipt ${r.receiptNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #1e293b; }
            h1 { margin: 0 0 4px; font-size: 24px; }
            .muted { color: #64748b; font-size: 13px; }
            .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0; }
            .total { font-size: 20px; font-weight: bold; margin-top: 20px; }
            .paid { color: #047857; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>Fee Receipt</h1>
          <p class="muted">${r.student?.college?.name || ""}</p>
          <p class="muted">Receipt No: ${r.receiptNumber}</p>
          <br />
          <div class="row"><span>Student</span><span>${r.student?.name}</span></div>
          <div class="row"><span>Roll Number</span><span>${r.student?.rollNumber}</span></div>
          <div class="row"><span>Department</span><span>${r.student?.department?.name || "-"}</span></div>
          <div class="row"><span>Fee</span><span>${r.title}</span></div>
          <div class="row"><span>Paid On</span><span>${formatDate(r.paidAt)}</span></div>
          <div class="row"><span>Payment Method</span><span>${(r.paymentMethod || "").replace("_", " ")}</span></div>
          <div class="row total"><span>Amount Paid</span><span>${money(r.amount)}</span></div>
          <p class="paid">Status: PAID</p>
        </body>
      </html>
    `);

    w.document.close();
    w.focus();
    w.print();
  };

  const summaryCards = [
    { label: "Total Fees", value: summary.totalAmount, icon: Wallet, color: "from-amber-500 to-orange-500" },
    { label: "Paid", value: summary.collectedAmount, icon: CheckCircle2, color: "from-emerald-500 to-teal-600" },
    { label: "Pending", value: summary.pendingAmount, icon: Clock, color: "from-blue-500 to-indigo-600" },
    { label: "Overdue", value: summary.overdueAmount, icon: AlertTriangle, color: "from-rose-500 to-pink-600" },
  ];

  return (
    <div className="space-y-8 bg-gradient-to-br from-slate-50 via-white to-orange-50/30 p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">My Fees</h1>
          <p className="mt-2 text-slate-500">
            View your fee records, payment status and receipts.
          </p>
        </div>

        <button
          onClick={loadFees}
          className="inline-flex items-center gap-2 rounded-xl border border-orange-100 bg-white px-4 py-3 text-sm font-semibold text-orange-700 shadow-sm transition hover:bg-orange-50"
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

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm"
            >
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${card.color} text-white shadow-md`}>
                <Icon size={21} />
              </div>
              <p className="mt-4 text-sm text-slate-500">{card.label}</p>
              <p className="mt-1 text-2xl font-extrabold text-slate-800">
                {loading ? (
                  <span className="inline-block h-8 w-24 animate-pulse rounded bg-slate-100" />
                ) : (
                  money(card.value)
                )}
              </p>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800">Fee Records</h2>

        {loading ? (
          <div className="mt-5 h-32 animate-pulse rounded-xl bg-orange-50" />
        ) : fees.length === 0 ? (
          <div className="py-14 text-center">
            <IndianRupee className="mx-auto mb-3 text-orange-300" size={38} />
            <p className="font-semibold text-slate-800">No fees assigned yet</p>
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            {fees.map((fee) => (
              <div
                key={fee.id}
                className="flex flex-col gap-3 rounded-xl border border-orange-100 bg-orange-50/30 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-slate-800">{fee.title}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Due: {formatDate(fee.dueDate)}
                    {fee.paidAt ? ` · Paid: ${formatDate(fee.paidAt)}` : ""}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-lg font-extrabold text-slate-800">
                    {money(fee.amount)}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${badgeClass[fee.displayStatus]}`}
                  >
                    {fee.displayStatus}
                  </span>
                  {fee.status === "PAID" && (
                    <button
                      onClick={() => openReceipt(fee.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-orange-700 shadow-sm transition hover:bg-orange-50"
                    >
                      <Receipt size={14} />
                      Receipt
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Receipt Modal */}
      {receipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 px-6 py-5 text-white">
              <div>
                <h2 className="text-lg font-bold">Fee Receipt</h2>
                <p className="text-xs text-orange-50">{receipt.receiptNumber}</p>
              </div>
              <button
                onClick={() => setReceipt(null)}
                className="rounded-lg p-2 hover:bg-white/20"
              >
                <X size={19} />
              </button>
            </div>

            <div className="space-y-3 p-6 text-sm">
              {[
                ["Student", receipt.student?.name],
                ["Roll Number", receipt.student?.rollNumber],
                ["Department", receipt.student?.department?.name || "-"],
                ["Fee", receipt.title],
                ["Paid On", formatDate(receipt.paidAt)],
                ["Method", (receipt.paymentMethod || "").replace("_", " ")],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between border-b border-orange-50 pb-2"
                >
                  <span className="text-slate-500">{label}</span>
                  <span className="font-semibold text-slate-800">{value}</span>
                </div>
              ))}

              <div className="flex items-center justify-between pt-2">
                <span className="font-semibold text-slate-700">Amount Paid</span>
                <span className="text-2xl font-extrabold text-emerald-600">
                  {money(receipt.amount)}
                </span>
              </div>

              <button
                onClick={printReceipt}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3 font-semibold text-white shadow-md shadow-orange-200"
              >
                <Printer size={17} />
                Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}