
import { useAuth } from "../context/AuthContext";
import {
  UserCircle,
  Mail,
  BadgeCheck,
  Building2,
  GraduationCap,
} from "lucide-react";

export default function FacultyProfile() {
  const { user } = useAuth();

  const details = [
    {
      label: "Full Name",
      value: user?.name || "Not available",
      icon: UserCircle,
    },
    {
      label: "Email Address",
      value: user?.email || "Not available",
      icon: Mail,
    },
    {
      label: "Employee ID",
      value: user?.employeeId || "Not available",
      icon: BadgeCheck,
    },
    {
      label: "Department",
      value: user?.department?.name || "Not available",
      icon: GraduationCap,
    },
    {
      label: "College",
      value: user?.college?.name || "Not available",
      icon: Building2,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/40 p-6">
      <div className="mx-auto max-w-5xl space-y-8">
        <div>
          <p className="font-semibold text-teal-600">Faculty Workspace</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-800">
            My Profile
          </h1>
          <p className="mt-2 text-slate-500">
            View your faculty account information.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-teal-100 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-600 p-8 text-white">
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20">
                <UserCircle size={45} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {user?.name || "Faculty Member"}
                </h2>
                <p className="mt-1 text-teal-50">Faculty Account</p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 p-8 sm:grid-cols-2">
            {details.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-5"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-teal-100 p-3 text-teal-700">
                      <Icon size={21} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-slate-500">{item.label}</p>
                      <p className="mt-1 break-words font-semibold text-slate-800">
                        {item.value}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
