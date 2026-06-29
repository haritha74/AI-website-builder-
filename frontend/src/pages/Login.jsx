import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Toast from "../components/ui/Toast";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", remember: true });
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await login(form);
      navigate("/dashboard");
    } catch (exc) {
      setError(exc.message);
    }
  };

  return (
    <main className="grid min-h-screen grid-cols-1 bg-[#f5f7fb] text-ink dark:bg-[#0b1018] dark:text-white lg:grid-cols-[1.1fr_.9fr]">
      <section className="hidden border-r border-slate-200 p-12 dark:border-line lg:flex lg:flex-col lg:justify-between">
        <h1 className="text-5xl font-black leading-none">AI Website Builder</h1>
        <p className="max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">Generate, edit, preview, save, and export complete websites from natural language prompts.</p>
      </section>
      <section className="grid place-items-center p-6">
        <form onSubmit={submit} className="w-full max-w-md border border-slate-200 bg-white p-6 dark:border-line dark:bg-[#101722]">
          <h2 className="text-3xl font-black">Welcome back</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Sign in to continue building.</p>
          <div className="mt-6 grid gap-4">
            <input className="auth-input" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <input className="auth-input" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <input type="checkbox" checked={form.remember} onChange={(e) => setForm({ ...form, remember: e.target.checked })} />
              Remember me
            </label>
            <Toast message={error} tone="error" />
            <button className="rounded-lg bg-brand px-4 py-3 font-bold text-white">Login</button>
          </div>
          <div className="mt-5 flex justify-between text-sm">
            <Link className="font-bold text-brand" to="/register">Create account</Link>
            <Link className="font-bold text-brand" to="/forgot-password">Forgot password?</Link>
          </div>
        </form>
      </section>
    </main>
  );
}
