import { useState } from "react";
import { Link } from "react-router-dom";

import { authApi } from "../api/auth";
import Toast from "../components/ui/Toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    const response = await authApi.forgotPassword({ email });
    setMessage(response.message);
  };

  return (
    <main className="grid min-h-screen place-items-center bg-[#f5f7fb] p-6 text-ink dark:bg-[#0b1018] dark:text-white">
      <form onSubmit={submit} className="w-full max-w-md border border-slate-200 bg-white p-6 dark:border-line dark:bg-[#101722]">
        <h1 className="text-3xl font-black">Reset password</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Enter the email connected to your workspace.</p>
        <input className="auth-input mt-6" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <button className="mt-4 w-full rounded-lg bg-brand px-4 py-3 font-bold text-white">Send reset instructions</button>
        <div className="mt-4"><Toast message={message} /></div>
        <Link className="mt-5 inline-block text-sm font-bold text-brand" to="/login">Back to login</Link>
      </form>
    </main>
  );
}
