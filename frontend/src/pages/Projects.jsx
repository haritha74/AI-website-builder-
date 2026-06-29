import { Copy, Edit3, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { projectApi } from "../api/projects";
import EmptyState from "../components/ui/EmptyState";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");

  const load = () => projectApi.list(search).then(setProjects);

  useEffect(() => {
    const handle = window.setTimeout(load, 250);
    return () => window.clearTimeout(handle);
  }, [search]);

  const duplicate = async (id) => {
    await projectApi.duplicate(id);
    load();
  };

  const remove = async (id) => {
    await projectApi.remove(id);
    load();
  };

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full border border-slate-200 bg-white py-2 pl-9 pr-3 dark:border-line dark:bg-[#101722]" placeholder="Search projects" />
        </div>
        <Link className="rounded-lg bg-brand px-4 py-2 text-sm font-bold text-white" to="/builder">New project</Link>
      </div>
      {projects.length === 0 ? (
        <EmptyState title="No projects found" body="Generate and save your first website to build a reusable project library." action={<Link className="mt-5 inline-block rounded-lg bg-brand px-4 py-2 text-sm font-bold text-white" to="/builder">Open Builder</Link>} />
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <article key={project.id} className="border border-slate-200 bg-white dark:border-line dark:bg-[#101722]">
              <div className="h-28" style={{ background: project.thumbnailColor }} />
              <div className="p-4">
                <p className="text-xs font-bold uppercase text-slate-500">{project.category}</p>
                <h2 className="mt-1 text-lg font-black">{project.title}</h2>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{project.prompt}</p>
                <div className="mt-4 flex gap-2">
                  <Link title="Edit project" to={`/builder/${project.id}`} className="grid h-9 w-9 place-items-center rounded-md bg-brand text-white"><Edit3 size={16} /></Link>
                  <button title="Duplicate project" onClick={() => duplicate(project.id)} className="grid h-9 w-9 place-items-center rounded-md border border-slate-200 dark:border-line"><Copy size={16} /></button>
                  <button title="Delete project" onClick={() => remove(project.id)} className="grid h-9 w-9 place-items-center rounded-md border border-slate-200 text-coral dark:border-line"><Trash2 size={16} /></button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
