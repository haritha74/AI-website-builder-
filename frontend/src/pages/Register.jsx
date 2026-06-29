import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Toast from "../components/ui/Toast";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await register(form);
      navigate("/dashboard");
    } catch (exc) {
      setError(exc.message);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-[#f5f7fb] p-6 text-ink dark:bg-[#0b1018] dark:text-white">
      <form onSubmit={submit} className="w-full max-w-md border border-slate-200 bg-white p-6 dark:border-line dark:bg-[#101722]">
        <h1 className="text-3xl font-black">Create account</h1>
        <div className="mt-6 grid gap-4">
          <input className="auth-input" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input className="auth-input" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input className="auth-input" type="password" placeholder="Password with letters and numbers" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <Toast message={error} tone="error" />
          <button className="rounded-lg bg-brand px-4 py-3 font-bold text-white">Register</button>
        </div>
        <p className="mt-5 text-sm text-slate-600 dark:text-slate-400">Already have an account? <Link className="font-bold text-brand" to="/login">Login</Link></p>
      </form>
    </main>
  );
}
