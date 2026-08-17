import { useCallback } from "react";

export function useToast() {
  const show = useCallback((msg) => {
    const t = document.createElement("div");
    t.className = "toast";
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3000);
  }, []);
  return show;
}
