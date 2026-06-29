import { Download, Redo2, Save, Undo2 } from "lucide-react";

export default function BuilderToolbar({ projectId, autosaveStatus, onSave, onUndo, onRedo }) {
  const download = async (type) => {
    if (!projectId) return;
    const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
    const url = `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/projects/${projectId}/export/${type}`;
    const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = `website.${type === "html" ? "html" : "zip"}`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(objectUrl);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border border-slate-200 bg-white px-3 py-2 dark:border-line dark:bg-[#101722]">
      <p className="text-sm text-slate-600 dark:text-slate-400">Autosave: <span className="font-bold">{autosaveStatus}</span></p>
      <div className="flex items-center gap-1">
        <button title="Undo" onClick={onUndo} className="grid h-9 w-9 place-items-center rounded-md border border-slate-200 dark:border-line">
          <Undo2 size={17} />
        </button>
        <button title="Redo" onClick={onRedo} className="grid h-9 w-9 place-items-center rounded-md border border-slate-200 dark:border-line">
          <Redo2 size={17} />
        </button>
        <button onClick={onSave} className="inline-flex items-center gap-2 rounded-md bg-mint px-3 py-2 text-sm font-bold text-white">
          <Save size={17} />
          Save
        </button>
        <button disabled={!projectId} onClick={() => download("html")} className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-bold disabled:opacity-50 dark:border-line">
          <Download size={17} />
          HTML
        </button>
        <button disabled={!projectId} onClick={() => download("zip")} className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-bold disabled:opacity-50 dark:border-line">
          <Download size={17} />
          ZIP
        </button>
        <button disabled={!projectId} onClick={() => download("react")} className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-bold disabled:opacity-50 dark:border-line">
          <Download size={17} />
          React
        </button>
      </div>
    </div>
  );
}
