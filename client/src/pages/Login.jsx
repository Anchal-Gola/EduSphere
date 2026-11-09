
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";


const DEMO_USERS = {
  ADMIN: {
    email: "anchal@gmail.com",
    password: "anchal@34",
  },
  FACULTY: {
    email: "sanu@gmail.com",
    password: "sanu@34",
  },
  STUDENT: {
    email: "anu@gmail.com",
    password: "anu@123",
  },
};


const Login = () => {
  const [role, setRole] = useState("STUDENT");
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

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

  const handleDemoLogin = async (demoRole) => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await handleLogin(demoRole, DEMO_USERS[demoRole]);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          `Demo ${demoRole.toLowerCase()} login failed. Check demo credentials.`
      );
    } finally {
      setLoading(false);
    }
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-4">
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-indigo-700">EduSphere</h1>
          <p className="mt-2 text-gray-500">College Management System</p>
        </div>

        {/* TEMPORARY DEMO LOGIN */}
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wide text-amber-700">
            Temporary Demo Login
          </p>

          <div className="grid grid-cols-3 gap-2">
            {["ADMIN", "FACULTY", "STUDENT"].map((demoRole) => (
              <button
                key={demoRole}
                type="button"
                disabled={loading}
                onClick={() => handleDemoLogin(demoRole)}
                className="rounded-lg bg-white px-2 py-2 text-xs font-semibold text-amber-800 shadow-sm ring-1 ring-amber-200 hover:bg-amber-100 disabled:opacity-50"
              >
                {loading ? "Wait..." : demoRole}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6 grid grid-cols-3 gap-2">
          {["ADMIN", "FACULTY", "STUDENT"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => handleRoleChange(item)}
              className={`rounded-lg py-2 text-sm font-medium ${
                role === item
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {role === "ADMIN" && (
          <div className="mb-5 flex rounded-lg bg-gray-100 p-1">
            <button
              type="button"
              onClick={() => {
                setIsRegister(false);
                setError("");
                setSuccess("");
              }}
              className={`flex-1 rounded-md py-2 text-sm font-medium ${
                !isRegister ? "bg-white text-indigo-700 shadow" : "text-gray-500"
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
              className={`flex-1 rounded-md py-2 text-sm font-medium ${
                isRegister ? "bg-white text-indigo-700 shadow" : "text-gray-500"
              }`}
            >
              Register
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {role === "ADMIN" && isRegister && (
            <div>
              <label className="mb-1 block text-sm font-medium">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                placeholder="Admin name"
              />
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}

          {success && (
            <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading
              ? "Please wait..."
              : role === "ADMIN" && isRegister
              ? "Create Admin Account"
              : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
