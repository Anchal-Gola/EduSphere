
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import {
  GraduationCap,
  ShieldCheck,
  Users,
  BookOpen,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Zap,
  TrendingUp,
} from "lucide-react";

const roles = [
  {
    name: "ADMIN",
    icon: ShieldCheck,
    active:
      "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-200/50",
    iconColor: "text-blue-600",
    focus: "focus:border-blue-400 focus:ring-4 focus:ring-blue-100",
    accent: "text-blue-600",
    button:
      "bg-gradient-to-r from-blue-600 to-indigo-600 shadow-blue-200/50",
  },
  {
    name: "FACULTY",
    icon: Users,
    active:
      "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-200/50",
    iconColor: "text-emerald-600",
    focus: "focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100",
    accent: "text-emerald-600",
    button:
      "bg-gradient-to-r from-emerald-600 to-teal-600 shadow-emerald-200/50",
  },
  {
    name: "STUDENT",
    icon: BookOpen,
    active:
      "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-200/50",
    iconColor: "text-orange-600",
    focus: "focus:border-orange-400 focus:ring-4 focus:ring-orange-100",
    accent: "text-orange-600",
    button:
      "bg-gradient-to-r from-orange-500 to-amber-500 shadow-orange-200/50",
  },
];

const Login = () => {
  const [role, setRole] = useState("STUDENT");
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const selectedRole = roles.find((item) => item.name === role);

  const handleRoleChange = (item) => {
    setRole(item);
    setIsRegister(false);
    setError("");
    setSuccess("");
  };

  const handleLogin = async (selectedRole, credentials) => {
    const response = await api.post(
      `/auth/${selectedRole.toLowerCase()}/login`,
      credentials
    );

    login({ ...response.data.user, role: selectedRole }, response.data.token);

    if (selectedRole === "ADMIN") navigate("/admin");
    else if (selectedRole === "FACULTY") navigate("/faculty");
    else navigate("/student");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (role === "ADMIN" && isRegister) {
        const response = await api.post("/auth/admin/register", {
          name,
          email,
          password,
        });

        setSuccess(
          response.data.message ||
            "Admin registered successfully. Please sign in."
        );

        setIsRegister(false);
        setName("");
        setPassword("");
      } else {
        await handleLogin(role, { email, password });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f2ff] via-[#f8f7ff] to-[#edf4ff] p-3 sm:p-5 lg:p-8">
      <div className="relative mx-auto grid min-h-[calc(100vh-2rem)] max-w-[1500px] overflow-hidden rounded-[28px] border border-white/80 bg-[#f7f5ff] shadow-2xl shadow-violet-200/40 lg:grid-cols-[1.05fr_0.95fr]">
        {/* LEFT CAMPUS PANEL */}
        <section className="relative hidden overflow-hidden lg:flex">
          <img
            src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1600&q=90"
            alt="University campus"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-br from-[#786cc2]/55 via-[#8378c4]/30 to-[#789bd4]/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#302b60]/65 via-transparent to-[#786cc2]/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#e8e0ff]/15" />

          <div className="absolute -left-24 top-36 h-72 w-72 rounded-full bg-[#c4a8ff]/25 blur-3xl" />
          <div className="absolute right-0 top-20 h-72 w-72 rounded-full bg-[#a8d4ff]/25 blur-3xl" />

          <div className="relative z-10 flex w-full flex-col justify-between p-10 xl:p-14">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/30 bg-white/20 text-white backdrop-blur-md">
                <GraduationCap size={28} />
              </div>

              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white">
                  Edu<span className="text-[#e4d6ff]">Sphere</span>
                </h2>
                <p className="text-xs text-white/90">
                  College Management System
                </p>
              </div>
            </div>

            <div className="max-w-xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-2 text-sm text-white backdrop-blur-lg">
                <Sparkles size={15} className="text-[#ffe1a6]" />
                The future of campus management
              </div>

              <h1 className="text-5xl font-extrabold leading-[1.15] tracking-tight text-white xl:text-6xl">
                Your Campus,
                <br />
                <span className="bg-gradient-to-r from-[#ffe0c7] via-[#e9d9ff] to-[#d7e9ff] bg-clip-text text-transparent">
                  Our Priority.
                </span>
              </h1>

              <p className="mt-6 max-w-md text-lg leading-8 text-white/95">
                A smarter way to manage college life for students, faculty and
                administrators.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                {[
                  { icon: Users, title: "Connect", subtitle: "With everyone" },
                  { icon: Zap, title: "Manage", subtitle: "With ease" },
                  { icon: TrendingUp, title: "Grow", subtitle: "Together" },
                ].map(({ icon: Icon, title, subtitle }) => (
                  <div
                    key={title}
                    className="flex items-center gap-3 rounded-2xl border border-white/25 bg-white/15 px-4 py-3 backdrop-blur-lg"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-white">
                      <Icon size={19} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{title}</p>
                      <p className="text-xs text-white/85">{subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-white/25 pt-5 text-xs text-white/85">
              <span>Learn · Manage · Grow</span>
              <span>© {new Date().getFullYear()} EduSphere</span>
            </div>
          </div>
        </section>

        {/* RIGHT LOGIN PANEL */}
        <section className="relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#f5f2ff] via-[#f8f6ff] to-[#edf4ff] px-5 py-8 sm:px-10 lg:px-12">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#d8c8ff]/35 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#b9d9ff]/30 blur-3xl" />
          <div className="pointer-events-none absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-[#d9ccff]/20 to-transparent" />

          <div className="relative z-10 w-full max-w-md">
            {/* Mobile logo */}
            <div className="mb-8 text-center lg:hidden">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7968df] to-[#a18aeb] text-white shadow-lg shadow-violet-200">
                <GraduationCap size={30} />
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900">
                Edu<span className="text-[#8873e8]">Sphere</span>
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                College Management System
              </p>
            </div>

            {/* Back to Home */}
            <Link
              to="/"
              className="mb-5 inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-gray-500 transition hover:text-blue-600"
            >
              <ArrowLeft size={16} />
              Back to Home
            </Link>

            {/* Heading */}
            <div className="mb-7">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#e4d8ff] bg-white/75 px-3 py-1.5 text-xs font-semibold text-[#8170d9] backdrop-blur-md">
                <Sparkles size={14} />
                Welcome back
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Sign in to your
                <span
                  className={`block bg-gradient-to-r ${
                    role === "ADMIN"
                      ? "from-blue-600 to-indigo-600"
                      : role === "FACULTY"
                      ? "from-emerald-600 to-teal-600"
                      : "from-orange-500 to-amber-500"
                  } bg-clip-text text-transparent`}
                >
                  campus portal.
                </span>
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Access your academic world, all in one place.
              </p>
            </div>

            {/* Login card */}
            <div className="rounded-3xl border border-white/90 bg-white/85 p-5 shadow-xl shadow-[#b9a7ef]/20 backdrop-blur-2xl sm:p-7">
              {/* Role selector */}
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
                Continue as
              </p>

              <div className="mb-6 grid grid-cols-3 gap-2 rounded-2xl border border-gray-100 bg-gray-50 p-1.5">
                {roles.map(({ name: item, icon: Icon, active: activeClass }) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleRoleChange(item)}
                    className={`flex flex-col items-center gap-1.5 rounded-xl py-3 text-xs font-semibold transition-all ${
                      role === item
                        ? activeClass
                        : "text-gray-500 hover:bg-white hover:text-gray-800"
                    }`}
                  >
                    <Icon size={18} />
                    {item}
                  </button>
                ))}
              </div>

              {/* Admin registration */}
              {role === "ADMIN" && (
                <div className="mb-5 flex rounded-xl border border-blue-100 bg-blue-50/70 p-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegister(false);
                      setError("");
                      setSuccess("");
                    }}
                    className={`flex-1 rounded-lg py-2.5 text-sm font-semibold ${
                      !isRegister
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-500"
                    }`}
                  >
                    Sign In
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsRegister(true);
                      setError("");
                      setSuccess("");
                    }}
                    className={`flex-1 rounded-lg py-2.5 text-sm font-semibold ${
                      isRegister
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-500"
                    }`}
                  >
                    Register
                  </button>
                </div>
              )}

              {/* Login form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {role === "ADMIN" && isRegister && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <div className="relative">
                      <User
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Admin name"
                        className={`w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 outline-none transition focus:bg-white ${selectedRole.focus}`}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className={`w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 outline-none transition focus:bg-white ${selectedRole.focus}`}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className={`w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-12 outline-none transition focus:bg-white ${selectedRole.focus}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 ${selectedRole.accent}`}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600">
                    {error}
                  </p>
                )}

                {success && (
                  <p className="rounded-xl border border-green-100 bg-green-50 p-3 text-sm text-green-700">
                    {success}
                  </p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`group flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-60 ${selectedRole.button}`}
                >
                  {loading
                    ? "Please wait..."
                    : role === "ADMIN" && isRegister
                    ? "Create Admin Account"
                    : "Sign In"}

                  {!loading && (
                    <ArrowRight
                      size={18}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  )}
                </button>
              </form>

              <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-500">
                <ShieldCheck size={15} className={selectedRole.accent} />
                Secure College Portal
              </div>
            </div>

            <p className="mt-6 text-center text-xs text-gray-500">
              © {new Date().getFullYear()} EduSphere · Learn. Manage. Grow.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Login;
