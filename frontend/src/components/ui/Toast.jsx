export default function Toast({ message, tone = "info" }) {
  if (!message) return null;
  const color = tone === "error" ? "border-coral text-coral" : "border-mint text-mint";
  return <div className={`border bg-white px-3 py-2 text-sm font-bold dark:bg-[#101722] ${color}`}>{message}</div>;
}
