import { Monitor, Smartphone, Tablet } from "lucide-react";

const sizes = {
  desktop: "w-full",
  tablet: "w-[768px]",
  mobile: "w-[390px]",
};

export default function PreviewPane({ code, viewport, setViewport }) {
  const srcDoc = `<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><style>${code.css}</style></head><body>${code.html}<script>${code.javascript}</script></body></html>`;

  return (
    <section className="flex min-h-[560px] flex-col overflow-hidden border border-slate-200 bg-white dark:border-line dark:bg-[#101722]">
      <div className="flex items-center justify-between border-b border-slate-200 px-3 py-2 dark:border-line">
        <p className="text-sm font-black">Live Preview</p>
        <div className="flex gap-1">
          {[
            ["desktop", Monitor],
            ["tablet", Tablet],
            ["mobile", Smartphone],
          ].map(([key, Icon]) => (
            <button
              key={key}
              title={`${key} preview`}
              onClick={() => setViewport(key)}
              className={`grid h-9 w-9 place-items-center rounded-md ${viewport === key ? "bg-brand text-white" : "hover:bg-slate-100 dark:hover:bg-[#182132]"}`}
            >
              <Icon size={17} />
            </button>
          ))}
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-auto bg-slate-100 p-3 dark:bg-[#090d14]">
        <iframe title="Generated website preview" sandbox="allow-scripts allow-forms" srcDoc={srcDoc} className={`mx-auto h-[535px] max-w-full border-0 bg-white ${sizes[viewport]}`} />
      </div>
    </section>
  );
}
