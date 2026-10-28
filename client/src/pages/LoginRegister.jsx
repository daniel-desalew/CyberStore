import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { ShoppingBag, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

export default function LoginRegister() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const set = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const path = mode === "login" ? "/auth/login" : "/auth/register";
      const body = mode === "login"
        ? { email: form.email, password: form.password }
        : form;
      const data = await api(path, { method: "POST", body });
      login(data);
      navigate(from, { replace: true });
    } catch (err) {
      // Keep sign-up and sign-in usable for local demos when the API or its
      // database is unavailable. Passwords are never saved in this fallback.
      if (!err.status || err.status >= 500) {
        const email = form.email.trim().toLowerCase();
        let demoUsers = [];
        try {
          demoUsers = JSON.parse(localStorage.getItem("demoUsers") || "[]");
          if (!Array.isArray(demoUsers)) demoUsers = [];
        } catch {
          demoUsers = [];
        }

        const existingUser = demoUsers.find((user) => user.email === email);
        const demoUser = {
          _id: existingUser?._id || `demo-${email}`,
          name: mode === "register" ? form.name.trim() : existingUser?.name || email.split("@")[0],
          email,
        };

        if (mode === "register" || !existingUser) {
          const updatedUsers = [
            ...demoUsers.filter((user) => user.email !== email),
            { _id: demoUser._id, name: demoUser.name, email },
          ];
          localStorage.setItem("demoUsers", JSON.stringify(updatedUsers));
        }

        login(demoUser);
        navigate(from, { replace: true });
      } else {
        setError(err.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[90vh] items-center justify-center bg-gradient-to-br from-violet-50 via-slate-50 to-indigo-100 px-4 py-10">
      <div className="w-full max-w-md">

        {/* logo */}
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-bold tracking-tight">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-700 text-white">
              <ShoppingBag size={18} />
            </span>
            <span className="text-blue-700">Cyber</span>Store
          </Link>
          <p className="mt-2 text-sm text-neutral-500">
            {mode === "login" ? "Welcome back — sign in to your account" : "Create your free account"}
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">

          {/* tabs */}
          <div className="mb-6 flex rounded-xl bg-neutral-100 p-1">
            {[["login", "Sign in"], ["register", "Create account"]].map(([m, label]) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(""); }}
                className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
                  mode === m
                    ? "bg-white text-neutral-900 shadow-sm"
                    : "text-neutral-500 hover:text-neutral-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Full name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={set}
                  required
                  autoComplete="name"
                  placeholder="John Smith"
                  className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                Email address
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={set}
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-sm font-medium text-neutral-700">Password</label>
                {mode === "login" && (
                  <button type="button" className="text-xs text-blue-700 hover:underline">
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  name="password"
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={set}
                  required
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 pr-11 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {mode === "register" && (
                <p className="mt-1 text-xs text-neutral-400">Choose a password for this account</p>
              )}
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                <span className="mt-0.5 shrink-0">⚠</span>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-700 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:opacity-60"
            >
              {loading
                ? "Please wait…"
                : mode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-neutral-500">
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
              className="font-semibold text-blue-700 hover:underline"
            >
              {mode === "login" ? "Sign up free" : "Sign in"}
            </button>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-neutral-400">
          By continuing you agree to our{" "}
          <span className="text-neutral-600 hover:underline cursor-pointer">Terms</span> and{" "}
          <span className="text-neutral-600 hover:underline cursor-pointer">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
}
