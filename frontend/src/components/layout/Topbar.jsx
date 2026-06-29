import { LogOut, Menu, Moon, Plus, Sun } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const titles = {
  "/dashboard": "Dashboard",
  "/builder": "AI Builder",
  "/projects": "Projects",
  "/templates": "Templates",
  "/settings": "Settings",
};

export default function Topbar() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const pageTitle = titles[location.pathname] || (location.pathname.startsWith("/builder") ? "AI Builder" : "Workspace");

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/85 px-4 py-3 backdrop-blur dark:border-line dark:bg-[#0b1018]/85 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1520px] items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 lg:hidden dark:border-line" title="Open navigation">
            <Menu size={18} />
          </button>
          <div>
            <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Workspace</p>
            <h2 className="text-xl font-black">{pageTitle}</h2>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/builder" className="inline-flex items-center gap-2 rounded-lg bg-brand px-3 py-2 text-sm font-bold text-white">
            <Plus size={17} />
            New
          </Link>
          <button
            title="Toggle theme"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 dark:border-line"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <div className="hidden text-right sm:block">
            <p className="text-sm font-bold">{user?.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
          </div>
          <button title="Log out" onClick={logout} className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 dark:border-line">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
