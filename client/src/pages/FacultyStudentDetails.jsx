
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../lib/api";
import {
  ArrowLeft,
  UserCircle,
  Mail,
  BadgeCheck,
  Building2,
  GraduationCap,
} from "lucide-react";

export default function FacultyStudentDetails() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStudent = async () => {
      try {
        const response = await api.get("/students");
        const students = response.data.students || response.data;
        const found = students.find((item) => item.id === id);

        if (!found) {
          setError("Student not found.");
        } else {
          setStudent(found);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load student.");
      } finally {
        setLoading(false);
      }
    };

    loadStudent();
  }, [id]);

  if (loading) {
    return <div className="p-10 text-center text-teal-600">Loading student...</div>;
  }

  if (error || !student) {
    return (
      <div className="p-8">
        <p className="text-red-600">{error || "Student not found."}</p>
        <Link to="/faculty/students" className="mt-4 inline-block text-teal-600">
          Back to Students
        </Link>
      </div>
    );
  }

  const details = [
    { label: "Full Name", value: student.name, icon: UserCircle },
    { label: "Email Address", value: student.email, icon: Mail },
    { label: "Roll Number", value: student.rollNumber, icon: BadgeCheck },
    { label: "Department", value: student.department?.name || "N/A", icon: GraduationCap },
    { label: "College", value: student.college?.name || "N/A", icon: Building2 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/40 p-6">
      <div className="mx-auto max-w-5xl space-y-8">
        <Link
          to="/faculty/students"
          className="inline-flex items-center gap-2 font-semibold text-teal-700 hover:text-teal-900"
        >
          <ArrowLeft size={18} /> Back to Students
        </Link>

        <div className="overflow-hidden rounded-3xl border border-teal-100 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-600 p-8 text-white">
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20">
                <UserCircle size={45} />
              </div>
              <div>
                <p className="text-teal-50">Student Profile</p>
                <h1 className="mt-1 text-3xl font-bold">{student.name}</h1>
                <p className="mt-2 text-teal-50">{student.rollNumber}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 p-8 sm:grid-cols-2">
            {details.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.label} className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-teal-100 p-3 text-teal-700">
                      <Icon size={21} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-slate-500">{item.label}</p>
                      <p className="mt-1 break-words font-semibold text-slate-800">{item.value}</p>
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
