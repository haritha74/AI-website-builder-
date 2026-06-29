import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppShell() {
  return (
    <div className="min-h-screen bg-[#f5f7fb] text-ink dark:bg-[#0b1018] dark:text-white">
      <Sidebar />
      <main className="min-h-screen lg:pl-72">
        <Topbar />
        <div className="mx-auto w-full max-w-[1520px] px-4 pb-20 pt-5 sm:px-6 lg:px-8 lg:pb-5">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
