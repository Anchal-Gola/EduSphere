import { useAuth } from "../context/AuthContext";
import { UserCircle, Mail, GraduationCap, Hash } from "lucide-react";

const StudentProfile = () => {
  const { user } = useAuth();

  const details = [
    {
      label: "Full Name",
      value: user?.name || "Student",
      icon: UserCircle,
    },
    {
      label: "Email Address",
      value: user?.email || "Not available",
      icon: Mail,
    },
    {
      label: "Roll Number",
      value: user?.rollNumber || "Not available",
      icon: Hash,
    },
    {
      label: "Student Role",
      value: "Student",
      icon: GraduationCap,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          My Profile
        </h1>
        <p className="mt-2 text-slate-500">
          View your personal and academic information.
        </p>
      </div>

      <div className="rounded-2xl border border-orange-100 bg-white p-8 shadow-sm">
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 text-white">
            <UserCircle size={42} />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {user?.name}
            </h2>
            <p className="text-orange-600">Student Profile</p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {details.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-xl border border-slate-100 bg-slate-50 p-5"
              >
                <div className="flex items-center gap-3">
                  <Icon className="text-orange-500" size={20} />
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