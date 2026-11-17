import { useEffect, useState } from "react";
import axios from "axios";
import {
  GraduationCap,
  Send,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  Building2,
} from "lucide-react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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

export default function AlumniRequestForm() {
  const [form, setForm] = useState(emptyForm);
  const [colleges, setColleges] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/alumni/public-options`
        );
        setColleges(response.data.colleges || []);
        setDepartments(response.data.departments || []);
      } catch (error) {
        console.error(error);
      }
    };

    loadOptions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      await axios.post(`${API_URL}/alumni/request`, form);
      setSubmitted(true);
      setForm(emptyForm);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to submit request");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-orange-100 bg-orange-50/30 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100";

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-white p-4">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl shadow-orange-100">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-200">
            <CheckCircle2 size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Request Submitted!
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            Your alumni enrollment request is pending admin approval. You'll be
            added to the directory once approved.
          </p>
          <div className="mt-7 space-y-3">
            <button
              onClick={() => setSubmitted(false)}
              className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-3 font-semibold text-white shadow-lg shadow-orange-200"
            >
              Submit Another
            </button>
            <Link
              to="/"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-orange-100 px-5 py-3 font-semibold text-slate-600 hover:bg-orange-50"
            >
              <ArrowLeft size={17} />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-white p-4 sm:p-8">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-orange-700 hover:underline"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-400 p-7 text-white shadow-xl shadow-orange-200 md:p-9">
          <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full bg-white/15 blur-3xl" />

          <div className="relative">
            <div className="mb-3 flex items-center gap-2 text-sm text-orange-50">
              <Sparkles size={17} />
              Alumni Self Enrollment
            </div>
            <h1 className="text-3xl font-bold md:text-4xl">
              Join the Alumni Network
            </h1>
            <p className="mt-3 text-sm text-orange-50 md:text-base">
              Fill this form to be added to EduSphere's alumni directory. Your
              request will be reviewed by the administration.
            </p>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4 rounded-2xl border border-orange-100 bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="flex items-center gap-3 pb-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-md">
              <GraduationCap size={21} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Your Details
              </h2>
              <p className="text-xs text-slate-500">
                Fields marked * are required
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Full Name *
              </label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your full name"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Email *
              </label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Phone
              </label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="Phone number"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Graduation Year *
              </label>
              <input
                required
                type="number"
                min="1950"
                max="2100"
                value={form.graduationYear}
                onChange={(e) =>
                  setForm({ ...form, graduationYear: e.target.value })
                }
                placeholder="e.g. 2022"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                College *
              </label>
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

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Department *
              </label>
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
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Job Title
              </label>
              <input
                value={form.jobTitle}
                onChange={(e) =>
                  setForm({ ...form, jobTitle: e.target.value })
                }
                placeholder="e.g. Software Engineer"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Company
              </label>
              <input
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                placeholder="e.g. Google"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Location
              </label>
              <input
                value={form.location}
                onChange={(e) =>
                  setForm({ ...form, location: e.target.value })
                }
                placeholder="e.g. Bengaluru"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                LinkedIn URL
              </label>
              <input
                type="url"
                value={form.linkedin}
                onChange={(e) =>
                  setForm({ ...form, linkedin: e.target.value })
                }
                placeholder="https://linkedin.com/in/..."
                className={inputClass}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Short Bio
              </label>
              <textarea
                rows={3}
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="Tell us a bit about yourself..."
                className={inputClass}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3.5 font-semibold text-white shadow-lg shadow-orange-200 transition hover:from-orange-600 hover:to-amber-600 disabled:opacity-60"
          >
            <Send size={18} />
            {submitting ? "Submitting..." : "Submit Request"}
          </button>

          <p className="text-center text-xs text-slate-400">
            <Building2 size={12} className="mr-1 inline" />
            Your request will be reviewed by the college administration.
          </p>
        </form>
      </div>
    </div>
  );
}