
import { useAuth } from "../context/AuthContext";
import { UserCircle, Mail, GraduationCap, Hash } from "lucide-react";

const StudentProfile = () => {
  const { user } = useAuth();

  const details = [
    {
      label: "Full Name",
      value: user?.name || "Student",
      icon: UserCircle,
      color: {
        border: "border-orange-100",
        icon: "from-orange-100 to-amber-100 text-orange-700",
      },
    },
    {
      label: "Email Address",
      value: user?.email || "Not available",
      icon: Mail,
      color: {
        border: "border-blue-100",
        icon: "from-blue-100 to-indigo-100 text-blue-700",
      },
    },
    {
      label: "Roll Number",
      value: user?.rollNumber || "Not available",
      icon: Hash,
      color: {
        border: "border-purple-100",
        icon: "from-purple-100 to-violet-100 text-purple-700",
      },
    },
    {
      label: "Student Role",
      value: "Student",
      icon: GraduationCap,
      color: {
        border: "border-emerald-100",
        icon: "from-emerald-100 to-teal-100 text-emerald-700",
      },
    },
  ];

  return (
    <div className="space-y-6 bg-gradient-to-br from-slate-50 via-white to-orange-50/30 p-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          My Profile
        </h1>
        <p className="mt-2 text-slate-500">
          View your personal and academic information.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm">
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-8 text-white">
          <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20">
            <UserCircle size={42} />
          </div>

          <div>
            <h2 className="text-2xl font-bold">
              {user?.name}
            </h2>
            <p className="mt-1 text-orange-50">Student Profile</p>
          </div>
        </div>
        </div>

        <div className="grid gap-5 p-8 md:grid-cols-2">
          {details.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className={`rounded-2xl border ${item.color.border} bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md`}
              >
                <div className="flex items-center gap-3">
                  <div className={`rounded-xl bg-gradient-to-br ${item.color.icon} p-3`}>
                    <Icon size={20} />
                  </div>
                  <span className="text-sm text-slate-500">
                    {item.label}
                  </span>
                </div>

                <p className="mt-3 break-words font-semibold text-slate-800">
                  {item.value}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
