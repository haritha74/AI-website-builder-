import Editor from "@monaco-editor/react";

const tabs = [
  { key: "html", label: "HTML", language: "html" },
  { key: "css", label: "CSS", language: "css" },
  { key: "javascript", label: "JS", language: "javascript" },
];

export default function CodeEditor({ code, setCode, activeTab, setActiveTab, editorRef }) {
  const tab = tabs.find((item) => item.key === activeTab) || tabs[0];

  return (
    <section className="flex min-h-[560px] flex-col overflow-hidden border border-slate-200 bg-white dark:border-line dark:bg-[#101722]">
      <div className="flex items-center justify-between border-b border-slate-200 px-3 py-2 dark:border-line">
        <div className="flex gap-1">
          {tabs.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`rounded-md px-3 py-1.5 text-sm font-bold ${
                activeTab === item.key ? "bg-brand text-white" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-[#182132]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div className="min-h-0 flex-1">
        <Editor
          height="560px"
          language={tab.language}
          theme="vs-dark"
          value={code[activeTab]}
          onMount={(editor) => {
            editorRef.current = editor;
          }}
          onChange={(value) => setCode((current) => ({ ...current, [activeTab]: value || "" }))}
          options={{ minimap: { enabled: false }, fontSize: 14, wordWrap: "on", scrollBeyondLastLine: false, automaticLayout: true }}
        />
      </div>
    </section>
  );
}
