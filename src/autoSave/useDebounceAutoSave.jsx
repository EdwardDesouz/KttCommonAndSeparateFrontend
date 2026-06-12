import { useEffect, useRef } from "react";
import API from "../api/api";

export function useDebounceAutoSave({ payload, enabled = true, delay = 2000 }) {
  const timerRef = useRef(null);
  const savingRef = useRef(false);
  const mountedRef = useRef(true);
  const exitingRef = useRef(false);

  const cancelRef = useRef(() => {
    exitingRef.current = true;
    if (timerRef.current) clearTimeout(timerRef.current);
  });

  useEffect(() => {
    mountedRef.current = true;
    exitingRef.current = false;
    return () => {
      mountedRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    if (!payload?.PermitId) return;
    if (exitingRef.current) return;

    const blocked = ["APR", "PEN", "REJ", "AMD", "CNL", "RFD"];
    if (blocked.includes(payload?.prmtStatus)) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      if (!mountedRef.current) return;
      if (exitingRef.current) return;
      if (savingRef.current) return;
      savingRef.current = true;
      try {
        await API.post("/postCommonHeaderTable/", payload);
        console.log("Auto-saved:", new Date().toLocaleTimeString());
      } catch (err) {
        console.warn("Auto-save failed:", err.message);
      } finally {
        savingRef.current = false;
      }
    }, delay);

    return () => clearTimeout(timerRef.current);
  }, [payload, enabled, delay]);
  return { cancel: cancelRef.current };
}
