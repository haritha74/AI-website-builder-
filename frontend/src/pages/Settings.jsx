import { useState } from "react";

import { authApi } from "../api/auth";
import Toast from "../components/ui/Toast";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Settings() {
  const { user, setUser, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [profile, setProfile] = useState({ name: user?.name || "", theme });
  const [password, setPassword] = useState({ currentPassword: "", newPassword: "" });
  const [message, setMessage] = useState("");

  const saveProfile = async (event) => {
    event.preventDefault();
    const data = await authApi.updateProfile(profile);
    setUser(data.user);
    setTheme(profile.theme);
    setMessage("Profile updated.");
  };

  const changePassword = async (event) => {
    event.preventDefault();
    await authApi.changePassword(password);
    setPassword({ currentPassword: "", newPassword: "" });
    setMessage("Password changed.");
  };

  const deleteAccount = async () => {
    await authApi.deleteAccount();
    logout();
  };

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <form onSubmit={saveProfile} className="border border-slate-200 bg-white p-5 dark:border-line dark:bg-[#101722]">
        <h2 className="text-xl font-black">Profile</h2>
        <div className="mt-5 grid gap-4">
          <input className="auth-input" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
          <select className="auth-input" value={profile.theme} onChange={(e) => setProfile({ ...profile, theme: e.target.value })}>
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
          <button className="rounded-lg bg-brand px-4 py-3 font-bold text-white">Update profile</button>
        </div>
      </form>
      <form onSubmit={changePassword} className="border border-slate-200 bg-white p-5 dark:border-line dark:bg-[#101722]">
        <h2 className="text-xl font-black">Password</h2>
        <div className="mt-5 grid gap-4">
          <input className="auth-input" type="password" placeholder="Current password" value={password.currentPassword} onChange={(e) => setPassword({ ...password, currentPassword: e.target.value })} />
          <input className="auth-input" type="password" placeholder="New password" value={password.newPassword} onChange={(e) => setPassword({ ...password, newPassword: e.target.value })} />
          <button className="rounded-lg bg-mint px-4 py-3 font-bold text-white">Change password</button>
        </div>
      </form>
      <section className="border border-coral bg-white p-5 dark:bg-[#101722]">
        <h2 className="text-xl font-black text-coral">Delete Account</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">This removes your account and all saved projects.</p>
        <button onClick={deleteAccount} className="mt-4 rounded-lg bg-coral px-4 py-3 font-bold text-white">Delete account</button>
      </section>
      <Toast message={message} />
    </div>
  );
}
