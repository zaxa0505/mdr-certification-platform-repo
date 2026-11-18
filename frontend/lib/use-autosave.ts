import { useEffect, useRef, useState, useCallback } from "react";
import { saveStageInProgress } from "./project-store";
import type { StageData, StageKey } from "./project-store";

type Options = {
  delay?: number;
  enabled?: boolean;
  onSave?: () => void;
};

export function useAutosave<K extends StageKey, T extends Partial<StageData<K>>>(
  key: K,
  value: T,
  options: Options = {},
) {
  const { delay = 1000, enabled = true, onSave } = options;
  const [isSaving, setIsSaving] = useState(false);
  const timer = useRef<number | null>(null);

  const saveNow = useCallback(async () => {
    if (timer.current) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }

    setIsSaving(true);
    try {
      // mark this stage as in-progress when autosaving / manual save
      saveStageInProgress(key, value);
      onSave?.();
    } finally {
      setIsSaving(false);
    }
  }, [key, value, onSave]);

  useEffect(() => {
    if (!enabled) return;

    // schedule debounced save
    if (timer.current) window.clearTimeout(timer.current);

    timer.current = window.setTimeout(() => {
      setIsSaving(true);
      try {
        saveStageInProgress(key, value);
        onSave?.();
      } finally {
        setIsSaving(false);
      }
    }, delay) as unknown as number;

    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [key, value, delay, enabled, onSave]);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  return { saveNow, isSaving };
}
