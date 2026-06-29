import { useEffect, useRef, useState } from "react";

export function useAutosave(value, saveFn, enabled = true, delay = 1200) {
  const [status, setStatus] = useState("idle");
  const mounted = useRef(false);

  useEffect(() => {
    if (!enabled) return undefined;
    if (!mounted.current) {
      mounted.current = true;
      return undefined;
    }
    setStatus("pending");
    const handle = window.setTimeout(async () => {
      try {
        await saveFn(value);
        setStatus("saved");
      } catch {
        setStatus("error");
      }
    }, delay);
    return () => window.clearTimeout(handle);
  }, [value, saveFn, enabled, delay]);

  return status;
}
