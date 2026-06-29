import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { projectApi } from "../api/projects";
import BuilderToolbar from "../components/builder/BuilderToolbar";
import CodeEditor from "../components/builder/CodeEditor";
import PreviewPane from "../components/builder/PreviewPane";
import PromptPanel from "../components/builder/PromptPanel";
import Toast from "../components/ui/Toast";
import { useAutosave } from "../hooks/useAutosave";

const initialCode = {
  html: "<main><h1>Your generated website will appear here.</h1></main>",
  css: "body { margin: 0; font-family: Inter, system-ui, sans-serif; padding: 48px; }",
  javascript: "",
};

export default function Builder() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const editorRef = useRef(null);
  const [title, setTitle] = useState("Untitled Website");
  const [prompt, setPrompt] = useState("");
  const [code, setCode] = useState(initialCode);
  const [category, setCategory] = useState("custom");
  const [thumbnailColor, setThumbnailColor] = useState("#2563eb");
  const [activeTab, setActiveTab] = useState("html");
  const [viewport, setViewport] = useState("desktop");
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!projectId) return;
    projectApi.get(projectId).then((project) => {
      setTitle(project.title);
      setPrompt(project.prompt);
      setCode({ html: project.html, css: project.css, javascript: project.javascript });
      setCategory(project.category);
      setThumbnailColor(project.thumbnailColor);
    });
  }, [projectId]);

  useEffect(() => {
    if (projectId) return;
    const templatePrompt = location.state?.prompt || sessionStorage.getItem("builderPrompt");
    if (templatePrompt) {
      setPrompt(templatePrompt);
      sessionStorage.removeItem("builderPrompt");
    }
  }, [location.state, projectId]);

  const payload = useMemo(
    () => ({ title, prompt, ...code, category, thumbnailColor }),
    [title, prompt, code, category, thumbnailColor],
  );

  const save = useCallback(
    async (nextPayload = payload) => {
      if (projectId) {
        return projectApi.update(projectId, nextPayload);
      }
      const saved = await projectApi.create(nextPayload);
      navigate(`/builder/${saved.id}`, { replace: true });
      return saved;
    },
    [projectId, navigate, payload],
  );

  const autosaveStatus = useAutosave(payload, save, Boolean(projectId));

  const generate = async () => {
    setGenerating(true);
    setMessage("");
    try {
      const generated = await projectApi.generate(prompt);
      setTitle(generated.title);
      setCode({ html: generated.html, css: generated.css, javascript: generated.javascript });
      setCategory(generated.category);
      setThumbnailColor(generated.thumbnailColor);
      setMessage("Website generated.");
    } catch (exc) {
      setMessage(exc.message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 xl:grid-cols-[420px_1fr]">
        <div className="grid content-start gap-4">
          <PromptPanel prompt={prompt} setPrompt={setPrompt} onGenerate={generate} generating={generating} />
          <section className="border border-slate-200 bg-white p-4 dark:border-line dark:bg-[#101722]">
            <label className="text-sm font-black" htmlFor="project-title">Project title</label>
            <input id="project-title" value={title} onChange={(event) => setTitle(event.target.value)} className="mt-2 w-full border border-slate-200 bg-white p-3 text-sm dark:border-line dark:bg-[#0b1018]" />
          </section>
          <Toast message={message} tone={message.includes("failed") || message.includes("Describe") ? "error" : "info"} />
        </div>
        <div className="grid gap-4">
          <BuilderToolbar
            projectId={projectId}
            autosaveStatus={autosaveStatus}
            onSave={() => save().then(() => setMessage("Project saved."))}
            onUndo={() => editorRef.current?.trigger("keyboard", "undo")}
            onRedo={() => editorRef.current?.trigger("keyboard", "redo")}
          />
          <div className="grid gap-4 2xl:grid-cols-2">
            <CodeEditor code={code} setCode={setCode} activeTab={activeTab} setActiveTab={setActiveTab} editorRef={editorRef} />
            <PreviewPane code={code} viewport={viewport} setViewport={setViewport} />
          </div>
        </div>
      </div>
    </div>
  );
}
