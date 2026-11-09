import { useEffect, useState } from "react";
import api from "../lib/api";
import {
  Users,
  Plus,
  Search,
  RefreshCw,
  X,
  Pencil,
  Trash2,
  Mail,
  Building2,
} from "lucide-react";

const emptyForm = {
  name: "",
  email: "",
  employeeId: "",
  password: "",
  collegeId: "",
  departmentId: "",
};

export default function Faculty() {
  const [faculty, setFaculty] = useState([]);
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

      const [facultyRes, collegeRes, departmentRes] = await Promise.all([
        api.get("/faculty"),
        api.get("/colleges"),
        api.get("/departments"),
      ]);

      setFaculty(facultyRes.data);
      setColleges(collegeRes.data);
      setDepartments(departmentRes.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch faculty data");
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

  const openEditModal = (item) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      email: item.email,
      employeeId: item.employeeId,
      password: "",
      collegeId: item.collegeId,
      departmentId: item.departmentId,
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
        await api.put(`/faculty/${editingId}`, payload);
        alert("Faculty updated successfully");
      } else {
        await api.post("/faculty", payload);
        alert("Faculty created successfully");
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
    if (!window.confirm("Are you sure you want to delete this faculty member?")) {
      return;
    }

    try {
      await api.delete(`/faculty/${id}`);
      alert("Faculty deleted successfully");
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete faculty");
    }
  };

  const filteredFaculty = faculty.filter((item) => {
    const query = search.toLowerCase();

    return (
      item.name.toLowerCase().includes(query) ||
      item.email.toLowerCase().includes(query) ||
      item.employeeId.toLowerCase().includes(query) ||
      item.department?.name?.toLowerCase().includes(query) ||
      item.college?.name?.toLowerCase().includes(query)
    );
  });

  const selectedDepartments = departments.filter(
    (department) => department.collegeId === form.collegeId
  );

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 via-white to-indigo-50/50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-7">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 font-semibold text-indigo-600">
              People Management
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Faculty
            </h1>
            <p className="mt-2 text-slate-500">
              Manage faculty accounts and department assignments.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 px-5 py-3 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            <Plus size={19} />
            Add Faculty
          </button>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={19}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search faculty, email, employee ID or department..."
              className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          <button
            onClick={fetchData}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 font-medium text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-600"
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="py-16 text-center text-indigo-600">Loading faculty...</div>
        ) : filteredFaculty.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center shadow-sm">
            <Users className="mx-auto mb-4 text-indigo-300" size={45} />
            <h3 className="text-lg font-semibold text-slate-800">
              No faculty found
            </h3>
            <p className="mt-2 text-slate-500">
              Add faculty or try another search.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredFaculty.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/60"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-200">
                    <Users size={23} />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(item)}
                      className="rounded-lg p-2 text-indigo-600 transition hover:bg-indigo-50"
                      title="Edit faculty"
                    >
                      <Pencil size={17} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="rounded-lg p-2 text-red-500 transition hover:bg-red-50"
                      title="Delete faculty"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>

                <h3 className="mt-5 text-xl font-bold text-slate-900">{item.name}</h3>
                <p className="mt-1 text-sm font-semibold text-violet-700">
                  {item.employeeId}
                </p>

                <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                  <Mail size={16} className="text-indigo-500" />
                  <span className="break-all">{item.email}</span>
                </div>

                <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Department
                    </p>
                    <p className="mt-1 font-medium text-slate-700">
                      {item.department?.name || "Department unavailable"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      College
                    </p>
                    <p className="mt-1 flex items-center gap-2 font-medium text-slate-700">
                      <Building2 size={15} className="text-indigo-500" />
                      {item.college?.name || "College unavailable"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
              <div className="flex items-center justify-between bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-5 text-white">
                <div>
                  <h2 className="text-xl font-bold">
                    {editingId ? "Edit Faculty" : "Add Faculty"}
                  </h2>
                  <p className="mt-1 text-sm text-indigo-100">Faculty account details</p>
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
                  ["name", "Full Name", "Dr. Rahul Sharma"],
                  ["email", "Email Address", "faculty@example.com"],
                  ["employeeId", "Employee ID", "EMP001"],
                ].map(([field, label, placeholder]) => (
                  <div key={field}>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      {label}
                    </label>
                    <input
                      required
                      type={field === "email" ? "email" : "text"}
                      value={form[field]}
                      onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                      placeholder={placeholder}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
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
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder={editingId ? "Leave blank to keep current" : "Minimum 6 characters"}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    College
                  </label>
                  <select
                    required
                    value={form.collegeId}
                    onChange={(e) =>
                      setForm({ ...form, collegeId: e.target.value, departmentId: "" })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                  >
                    <option value="">Choose college</option>
                    {colleges.map((college) => (
                      <option key={college.id} value={college.id}>
                        {college.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Department
                  </label>
                  <select
                    required
                    value={form.departmentId}
                    disabled={!form.collegeId}
                    onChange={(e) => setForm({ ...form, departmentId: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 disabled:bg-slate-100"
                  >
                    <option value="">Choose department</option>
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
                    className="flex-1 rounded-xl border border-slate-200 px-4 py-3 font-semibold text-slate-600 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:shadow-xl"
                  >
                    {editingId ? "Save Changes" : "Create Faculty"}
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