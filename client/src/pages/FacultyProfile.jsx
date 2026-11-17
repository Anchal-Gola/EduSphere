import { useEffect, useState } from "react";
import api from "../lib/api";
import {
  UserCircle,
  Mail,
  BadgeCheck,
  Building2,
  GraduationCap,
  Phone,
  CalendarDays,
  MapPin,
  User,
  Briefcase,
  Award,
  Pencil,
  X,
  Check,
  RefreshCw,
} from "lucide-react";

const emptyForm = {
  phone: "",
  profilePhoto: "",
  dateOfBirth: "",
  gender: "",
  address: "",
  designation: "",
  qualification: "",
};

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      })
    : "";

export default function FacultyProfile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [photoError, setPhotoError] = useState(false);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/faculty/profile");
      setProfile(response.data);
      setPhotoError(false);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const startEditing = () => {
    setForm({
      phone: profile?.phone || "",
      profilePhoto: profile?.profilePhoto || "",
      dateOfBirth: profile?.dateOfBirth ? profile.dateOfBirth.slice(0, 10) : "",
      gender: profile?.gender || "",
      address: profile?.address || "",
      designation: profile?.designation || "",
      qualification: profile?.qualification || "",
    });
    setSuccess("");
    setError("");
    setEditing(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        phone: form.phone.trim() || null,
        profilePhoto: form.profilePhoto.trim() || null,
        dateOfBirth: form.dateOfBirth || null,
        gender: form.gender || null,
        address: form.address.trim() || null,
        designation: form.designation.trim() || null,
        qualification: form.qualification.trim() || null,
      };

      const response = await api.put("/faculty/profile", payload);

      setProfile((prev) => ({ ...prev, ...response.data.profile }));
      setPhotoError(false);
      setEditing(false);
      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const details = [
    {
      label: "Full Name",
      value: profile?.name,
      icon: UserCircle,
      color: {
        border: "border-purple-100",
        icon: "from-purple-100 to-violet-100 text-purple-700",
      },
    },
    {
      label: "Email Address",
      value: profile?.email,
      icon: Mail,
      color: {
        border: "border-orange-100",
        icon: "from-orange-100 to-pink-100 text-orange-700",
      },
    },
    {
      label: "Employee ID",
      value: profile?.employeeId,
      icon: BadgeCheck,
      color: {
        border: "border-blue-100",
        icon: "from-blue-100 to-cyan-100 text-blue-700",
      },
    },
    {
      label: "Designation",
      value: profile?.designation,
      icon: Briefcase,
      color: {
        border: "border-teal-100",
        icon: "from-teal-100 to-emerald-100 text-teal-700",
      },
    },
    {
      label: "Qualification",
      value: profile?.qualification,
      icon: Award,
      color: {
        border: "border-amber-100",
        icon: "from-amber-100 to-orange-100 text-amber-700",
      },
    },
    {
      label: "Phone",
      value: profile?.phone,
      icon: Phone,
      color: {
        border: "border-emerald-100",
        icon: "from-emerald-100 to-teal-100 text-emerald-700",
      },
    },
    {
      label: "Date of Birth",
      value: formatDate(profile?.dateOfBirth),
      icon: CalendarDays,
      color: {
        border: "border-pink-100",
        icon: "from-pink-100 to-rose-100 text-pink-700",
      },
    },
    {
      label: "Gender",
      value: profile?.gender,
      icon: User,
      color: {
        border: "border-indigo-100",
        icon: "from-indigo-100 to-blue-100 text-indigo-700",
      },
    },
    {
      label: "Department",
      value: profile?.department?.name,
      icon: GraduationCap,
      color: {
        border: "border-green-100",
        icon: "from-green-100 to-lime-100 text-green-700",
      },
    },
    {
      label: "College",
      value: profile?.college?.name,
      icon: Building2,
      color: {
        border: "border-indigo-100",
        icon: "from-indigo-100 to-blue-100 text-indigo-700",
      },
    },
    {
      label: "Address",
      value: profile?.address,
      icon: MapPin,
      color: {
        border: "border-cyan-100",
        icon: "from-cyan-100 to-sky-100 text-cyan-700",
      },
      wide: true,
    },
  ];

  const inputClass =
    "w-full rounded-xl border border-teal-100 bg-teal-50/30 px-4 py-3 outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-100";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/40 p-6">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-semibold text-teal-600">Faculty Workspace</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-800">
              My Profile
            </h1>
            <p className="mt-2 text-slate-500">
              View and update your faculty account information.
            </p>
          </div>

          {!loading && profile && !editing && (
            <button
              onClick={startEditing}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-teal-200 transition hover:shadow-lg"
            >
              <Pencil size={16} />
              Edit Profile
            </button>
          )}
        </div>

        {success && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
            {success}
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
            {!profile && (
              <button onClick={loadProfile} className="ml-3 font-semibold underline">
                Retry
              </button>
            )}
          </div>
        )}

        {loading ? (
          <div className="rounded-3xl border border-teal-100 bg-white py-16 text-center text-teal-600 shadow-sm">
            <RefreshCw size={25} className="mx-auto mb-3 animate-spin" />
            Loading profile...
          </div>
        ) : (
          profile && (
            <div className="overflow-hidden rounded-3xl border border-teal-100 bg-white shadow-sm">
              <div className="bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-600 p-8 text-white">
                <div className="flex items-center gap-5">
                  <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-white/20">
                    {profile.profilePhoto && !photoError ? (
                      <img
                        src={profile.profilePhoto}
                        alt={profile.name}
                        onError={() => setPhotoError(true)}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <UserCircle size={45} />
                    )}
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold">{profile.name}</h2>
                    <p className="mt-1 text-teal-50">
                      {profile.designation || "Faculty Account"}
                      {profile.department?.name
                        ? ` · ${profile.department.name}`
                        : ""}
                    </p>
                  </div>
                </div>
              </div>

              {editing ? (
                <form onSubmit={handleSave} className="space-y-5 p-8">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Designation
                      </label>
                      <input
                        value={form.designation}
                        onChange={(e) =>
                          setForm({ ...form, designation: e.target.value })
                        }
                        placeholder="Assistant Professor"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Qualification
                      </label>
                      <input
                        value={form.qualification}
                        onChange={(e) =>
                          setForm({ ...form, qualification: e.target.value })
                        }
                        placeholder="M.Tech, Ph.D."
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                        placeholder="9876543210"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={form.dateOfBirth}
                        onChange={(e) =>
                          setForm({ ...form, dateOfBirth: e.target.value })
                        }
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Gender
                      </label>
                      <select
                        value={form.gender}
                        onChange={(e) =>
                          setForm({ ...form, gender: e.target.value })
                        }
                        className={inputClass}
                      >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Profile Photo URL
                      </label>
                      <input
                        type="url"
                        value={form.profilePhoto}
                        onChange={(e) =>
                          setForm({ ...form, profilePhoto: e.target.value })
                        }
                        placeholder="https://example.com/photo.jpg"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Address
                    </label>
                    <textarea
                      rows={3}
                      value={form.address}
                      onChange={(e) =>
                        setForm({ ...form, address: e.target.value })
                      }
                      placeholder="Your address"
                      className={inputClass}
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      disabled={saving}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-teal-100 px-4 py-3 font-semibold text-slate-600 transition hover:bg-teal-50 disabled:opacity-60"
                    >
                      <X size={17} />
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 px-4 py-3 font-semibold text-white shadow-md shadow-teal-200 transition hover:shadow-lg disabled:opacity-60"
                    >
                      {saving ? (
                        <RefreshCw size={17} className="animate-spin" />
                      ) : (
                        <Check size={17} />
                      )}
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid gap-5 p-8 sm:grid-cols-2">
                  {details.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.label}
                        className={`rounded-2xl border ${item.color.border} bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md ${
                          item.wide ? "sm:col-span-2" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`rounded-xl bg-gradient-to-br ${item.color.icon} p-3`}
                          >
                            <Icon size={21} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm text-slate-500">
                              {item.label}
                            </p>
                            <p
                              className={`mt-1 break-words font-semibold ${
                                item.value ? "text-slate-800" : "text-slate-400"
                              }`}
                            >
                              {item.value || "Not added"}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}
