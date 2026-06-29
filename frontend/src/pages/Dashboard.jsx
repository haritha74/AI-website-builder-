import { motion } from "framer-motion";
import { Code2, FolderKanban, Library, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { projectApi } from "../api/projects";
import { templateApi } from "../api/templates";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    projectApi.list().then(setProjects);
    templateApi.list().then(setTemplates);
  }, []);

  const stats = [
    ["Projects", projects.length, FolderKanban],
    ["Templates", templates.length, Library],
    ["Generated", projects.filter((p) => p.prompt).length, Sparkles],
    ["Exports", "3 formats", Code2],
  ];

  return (
    <div className="grid gap-5">
      <section className="grid gap-4 md:grid-cols-4">
        {stats.map(([label, value, Icon]) => (
          <motion.article initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} key={label} className="border border-slate-200 bg-white p-5 dark:border-line dark:bg-[#101722]">
            <Icon className="text-brand" size={22} />
            <p className="mt-5 text-sm font-bold text-slate-500 dark:text-slate-400">{label}</p>
            <h3 className="text-2xl font-black">{value}</h3>
          </motion.article>
        ))}
      </section>
      <section className="grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
        <div className="border border-slate-200 bg-white p-5 dark:border-line dark:bg-[#101722]">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black">Recent Projects</h2>
            <Link className="text-sm font-bold text-brand" to="/projects">View all</Link>
          </div>
          <div className="mt-4 grid gap-3">
            {projects.slice(0, 5).map((project) => (
              <Link key={project.id} to={`/builder/${project.id}`} className="flex items-center justify-between border border-slate-200 p-3 hover:border-brand dark:border-line">
                <span className="font-bold">{project.title}</span>
                <span className="text-xs uppercase text-slate-500">{project.category}</span>
              </Link>
            ))}
            {projects.length === 0 && <p className="py-8 text-sm text-slate-500">No saved projects yet.</p>}
          </div>
        </div>
        <div className="border border-slate-200 bg-white p-5 dark:border-line dark:bg-[#101722]">
          <h2 className="text-xl font-black">Start Fast</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">Use a template prompt or open the builder for a custom website.</p>
          <Link to="/builder" className="mt-5 inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-3 text-sm font-bold text-white">
            <Sparkles size={17} />
            Open Builder
          </Link>
        </div>
      </section>
    </div>
  );
}
