import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { templateApi } from "../api/templates";

export default function Templates() {
  const [templates, setTemplates] = useState([]);
  const [category, setCategory] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    templateApi.list().then(setTemplates);
  }, []);

  const categories = ["all", ...new Set(templates.map((template) => template.category))];
  const visible = category === "all" ? templates : templates.filter((template) => template.category === category);

  const useTemplate = (template) => {
    sessionStorage.setItem("builderPrompt", template.prompt);
    navigate("/builder", { state: { prompt: template.prompt } });
  };

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-2">
        {categories.map((item) => (
          <button key={item} onClick={() => setCategory(item)} className={`rounded-lg px-3 py-2 text-sm font-bold ${category === item ? "bg-brand text-white" : "border border-slate-200 dark:border-line"}`}>
            {item}
          </button>
        ))}
      </div>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {visible.map((template) => (
          <article key={template.id} className="border border-slate-200 bg-white dark:border-line dark:bg-[#101722]">
            <div className="h-24" style={{ background: template.accentColor }} />
            <div className="p-4">
              <p className="text-xs font-bold uppercase text-slate-500">{template.category}</p>
              <h2 className="mt-1 text-lg font-black">{template.name}</h2>
              <p className="mt-2 min-h-16 text-sm leading-6 text-slate-600 dark:text-slate-400">{template.description}</p>
              <button onClick={() => useTemplate(template)} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand px-3 py-2 text-sm font-bold text-white">
                <Sparkles size={16} />
                Use
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
