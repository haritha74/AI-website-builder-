import { Sparkles } from "lucide-react";

export default function PromptPanel({ prompt, setPrompt, onGenerate, generating }) {
  return (
    <section className="border border-slate-200 bg-white p-4 dark:border-line dark:bg-[#101722]">
      <label className="text-sm font-black" htmlFor="prompt">
        Describe the website
      </label>
      <textarea
        id="prompt"
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
        rows={4}
        className="mt-2 w-full resize-y border border-slate-200 bg-white p-3 text-sm outline-none focus:border-brand dark:border-line dark:bg-[#0b1018]"
        placeholder="Create a modern restaurant website with online reservation, gallery, menu, contact page, and dark theme"
      />
      <button onClick={onGenerate} disabled={generating} className="mt-3 inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-bold text-white disabled:opacity-60">
        <Sparkles size={17} />
        {generating ? "Generating" : "Generate"}
      </button>
    </section>
  );
}
