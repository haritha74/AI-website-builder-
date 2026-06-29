import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { authApi } from "../api/auth";
import Toast from "../components/ui/Toast";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const [form, setForm] = useState({ token: params.get("token") || "", password: "" });
  const [message, setMessage] = useState("");
  const [tone, setTone] = useState("info");

  const submit = async (event) => {
    event.preventDefault();
    try {
      const response = await authApi.resetPassword(form);
      setTone("info");
      setMessage(response.message);
    } catch (exc) {
      setTone("error");
      setMessage(exc.message);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-[#f5f7fb] p-6 text-ink dark:bg-[#0b1018] dark:text-white">
      <form onSubmit={submit} className="w-full max-w-md border border-slate-200 bg-white p-6 dark:border-line dark:bg-[#101722]">
        <h1 className="text-3xl font-black">Set new password</h1>
        <div className="mt-6 grid gap-4">
          <input className="auth-input" placeholder="Reset token" value={form.token} onChange={(e) => setForm({ ...form, token: e.target.value })} required />
          <input className="auth-input" type="password" placeholder="New password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <button className="rounded-lg bg-brand px-4 py-3 font-bold text-white">Update password</button>
          <Toast message={message} tone={tone} />
        </div>
        <Link className="mt-5 inline-block text-sm font-bold text-brand" to="/login">Back to login</Link>
      </form>
    </main>
  );
}
