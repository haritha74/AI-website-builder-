import { Sparkles } from "lucide-react";

export default function EmptyState({ title, body, action }) {
  return (
    <section className="grid min-h-[320px] place-items-center border border-dashed border-slate-300 bg-white p-8 text-center dark:border-line dark:bg-[#101722]">
      <div className="max-w-md">
        <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-lg bg-brand text-white">
          <Sparkles size={22} />
        </div>
        <h3 className="text-xl font-black">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{body}</p>
        {action}
      </div>
    </section>
  );
}
