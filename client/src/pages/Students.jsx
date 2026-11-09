
import { useEffect, useState } from "react";
import api from "../lib/api";
import {
  GraduationCap,
  Plus,
  Search,
  RefreshCw,
  X,
  Pencil,
  Trash2,
  Mail,
  Building2,
  BookOpen,
  Landmark,
} from "lucide-react";

const emptyForm = {
  name: "",
  email: "",
  rollNumber: "",
  password: "",
  collegeId: "",
  departmentId: "",
};

export default function Students() {
  const [students, setStudents] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [studentRes, collegeRes, departmentRes] = await Promise.all([
        api.get("/students"),
        api.get("/colleges"),
        api.get("/departments"),
      ]);

      setStudents(studentRes.data);
      setColleges(collegeRes.data);
      setDepartments(departmentRes.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch student data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEditModal = (student) => {
    setEditingId(student.id);
    setForm({
      name: student.name,
      email: student.email,
      rollNumber: student.rollNumber,
      password: "",
      collegeId: student.collegeId,
      departmentId: student.departmentId,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = { ...form };

      if (editingId && !payload.password) {
        delete payload.password;
      }

      if (editingId) {
        await api.put(`/students/${editingId}`, payload);
        alert("Student updated successfully");
      } else {
        await api.post("/students", payload);
        alert("Student created successfully");
      }

      setModalOpen(false);
      setForm(emptyForm);
      setEditingId(null);
      fetchData();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) {
      return;
    }

    try {
      await api.delete(`/students/${id}`);
      alert("Student deleted successfully");
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete student");
    }
  };

  const filteredStudents = students.filter((student) => {
    const query = search.toLowerCase();

    return (
      student.name.toLowerCase().includes(query) ||
      student.email.toLowerCase().includes(query) ||
      student.rollNumber.toLowerCase().includes(query) ||
      student.department?.name?.toLowerCase().includes(query) ||
      student.college?.name?.toLowerCase().includes(query)
    );
  });

  const selectedDepartments = departments.filter(
    (department) => department.collegeId === form.collegeId
  );

  return (
    <div className="min-h-full bg-transparent p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-7">

        {/* Header Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-pink-500 p-7 text-white shadow-xl shadow-indigo-200 md:p-9">
          <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm text-indigo-100">
                <GraduationCap size={17} />
                Administration / Students
              </div>

              <h1 className="text-3xl font-bold md:text-4xl">
                Students
              </h1>

              <p className="mt-2 text-indigo-100">
                Manage student accounts and academic assignments.
              </p>
            </div>

            <button
              onClick={openCreateModal}
              className="flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-3 font-semibold text-slate-900 shadow-lg transition hover:bg-amber-300"
            >
              <Plus size={19} />
              Add Student
            </button>
          </div>

          <div className="relative mt-7">
            <div className="inline-block rounded-xl border border-white/20 bg-white/15 px-4 py-3 backdrop-blur-md">
              <p className="text-xs text-indigo-100">Total Students</p>
              <p className="text-2xl font-bold">{students.length}</p>
            </div>
          </div>
        </div>

        {/* Search and Refresh */}
        <div className="flex flex-col gap-3 rounded-2xl border border-purple-100 bg-white/90 p-4 shadow-sm backdrop-blur-sm sm:flex-row">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400"
              size={19}
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search student, roll number, email or department..."
              className="w-full rounded-xl border border-purple-100 bg-purple-50/40 py-3 pl-10 pr-4 outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
            />
          </div>

          <button
            onClick={fetchData}
            className="flex items-center justify-center gap-2 rounded-xl border border-purple-100 px-4 py-3 font-medium text-purple-700 transition hover:bg-purple-50"
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>

        {/* Student Cards */}
        {loading ? (
          <div className="rounded-2xl border border-purple-100 bg-white/80 py-16 text-center text-purple-600 shadow-sm">
            <RefreshCw size={25} className="mx-auto mb-3 animate-spin" />
            Loading students...
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="rounded-2xl border border-purple-100 bg-white/90 py-16 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-100 to-orange-100">
              <GraduationCap className="text-purple-500" size={32} />
            </div>

            <h3 className="text-lg font-semibold text-slate-800">
              No students found
            </h3>

            <p className="mt-2 text-slate-500">
              Add a student or try another search.
            </p>

            {!search && (
              <button
                onClick={openCreateModal}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 px-4 py-2.5 font-semibold text-white shadow-md shadow-purple-200 transition hover:shadow-lg"
              >
                <Plus size={17} />
                Add your first student
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredStudents.map((student, index) => (
              <div
                key={student.id}
                className="group relative overflow-hidden rounded-2xl border border-purple-100 bg-white/95 p-5 shadow-sm transition hover:-translate-y-1 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-100/60"
              >
                <div
                  className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${
                    index % 3 === 0
                      ? "from-purple-400 to-fuchsia-400"
                      : index % 3 === 1
                      ? "from-orange-300 to-pink-400"
                      : "from-violet-400 to-indigo-400"
                  }`}
                />

                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 text-white shadow-md shadow-purple-200">
                    <GraduationCap size={23} />
                  </div>

                  <div className="flex gap-1">
                    <button
                      onClick={() => openEditModal(student)}
                      className="rounded-lg p-2 text-purple-600 transition hover:bg-purple-50"
                      title="Edit student"
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      onClick={() => handleDelete(student.id)}
                      className="rounded-lg p-2 text-rose-500 transition hover:bg-rose-50"
                      title="Delete student"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>

                <h3 className="mt-5 text-xl font-bold text-slate-900">
                  {student.name}
                </h3>

                <p className="mt-2 inline-flex rounded-lg bg-gradient-to-r from-purple-50 to-fuchsia-50 px-3 py-1 text-sm font-semibold text-purple-700">
                  {student.rollNumber}
                </p>

                <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                  <Mail size={16} className="shrink-0 text-purple-500" />
                  <span className="break-all">{student.email}</span>
                </div>

                <div className="mt-5 rounded-xl border border-orange-100 bg-gradient-to-r from-orange-50/70 to-pink-50/50 p-3">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-orange-600">
                    <Landmark size={14} />
                    College
                  </div>

                  <p className="mt-1 font-medium text-slate-700">
                    {student.college?.name || "College unavailable"}
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between rounded-xl bg-purple-50/70 px-3 py-3">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <BookOpen size={16} className="text-purple-500" />
                    Department
                  </div>

                  <span className="rounded-lg bg-white px-3 py-1 font-bold text-purple-700 shadow-sm">
                    {student.department?.name || "Unavailable"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create / Edit Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-2xl">

              <div className="flex items-center justify-between bg-gradient-to-r from-[#312e81] via-[#5b21b6] to-[#7c3aed] px-6 py-5 text-white">
                <div>
                  <h2 className="text-xl font-bold">
                    {editingId ? "Edit Student" : "Add Student"}
                  </h2>

                  <p className="mt-1 text-sm text-purple-100">
                    Student account information
                  </p>
                </div>

                <button
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg p-2 transition hover:bg-white/20"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 p-6">
                {[
                  ["name", "Full Name", "Aarav Sharma"],
                  ["email", "Email Address", "student@example.com"],
                  ["rollNumber", "Roll Number", "CSE2026001"],
                ].map(([field, label, placeholder]) => (
                  <div key={field}>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      {label}
                    </label>

                    <input
                      required
                      type={field === "email" ? "email" : "text"}
                      value={form[field]}
                      onChange={(e) =>
                        setForm({ ...form, [field]: e.target.value })
                      }
                      placeholder={placeholder}
                      className="w-full rounded-xl border border-purple-100 bg-purple-50/30 px-4 py-3 outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
                    />
                  </div>
                ))}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    {editingId ? "New Password (optional)" : "Password"}
                  </label>

                  <input
                    required={!editingId}
                    type="password"
                    minLength={6}
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    placeholder={
                      editingId
                        ? "Leave blank to keep current"
                        : "Minimum 6 characters"
                    }
                    className="w-full rounded-xl border border-purple-100 bg-purple-50/30 px-4 py-3 outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Select College
                  </label>

                  <select
                    required
                    value={form.collegeId}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        collegeId: e.target.value,
                        departmentId: "",
                      })
                    }
                    className="w-full rounded-xl border border-purple-100 bg-white px-4 py-3 outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
                  >
                    <option value="">Choose a college</option>

                    {colleges.map((college) => (
                      <option key={college.id} value={college.id}>
                        {college.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Select Department
                  </label>

                  <select
                    required
                    value={form.departmentId}
                    disabled={!form.collegeId}
                    onChange={(e) =>
                      setForm({ ...form, departmentId: e.target.value })
                    }
                    className="w-full rounded-xl border border-purple-100 bg-white px-4 py-3 outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-100 disabled:bg-slate-100"
                  >
                    <option value="">Choose a department</option>

                    {selectedDepartments.map((department) => (
                      <option key={department.id} value={department.id}>
                        {department.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="flex-1 rounded-xl border border-purple-100 px-4 py-3 font-semibold text-slate-600 transition hover:bg-purple-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 px-4 py-3 font-semibold text-white shadow-lg shadow-purple-200 transition hover:shadow-xl"
                  >
                    {editingId ? "Save Changes" : "Create Student"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
