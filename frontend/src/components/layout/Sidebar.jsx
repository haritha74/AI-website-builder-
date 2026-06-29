import { Code2, FolderKanban, LayoutDashboard, Library, Settings, Sparkles } from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/builder", label: "Builder", icon: Sparkles },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/templates", label: "Templates", icon: Library },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-slate-200 bg-white px-4 py-5 dark:border-line dark:bg-[#101722] lg:block">
        <div className="mb-8 flex items-center gap-3 px-2">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand text-white">
            <Code2 size={22} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">AI Website</p>
            <h1 className="text-xl font-black">Builder</h1>
          </div>
        </div>
        <nav className="grid gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font700 transition ${
                    isActive
                      ? "bg-brand text-white shadow-glow"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-[#182132]"
                  }`
                }
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-slate-200 bg-white dark:border-line dark:bg-[#101722] lg:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink key={item.to} to={item.to} title={item.label} className={({ isActive }) => `grid h-14 place-items-center ${isActive ? "text-brand" : "text-slate-500"}`}>
              <Icon size={20} />
            </NavLink>
          );
        })}
      </nav>
    </>
  );
}
