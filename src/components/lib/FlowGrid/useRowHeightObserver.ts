import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const idProp = "data-observer-row-id";

function getObserveProps(i: number) {
  return {
    [idProp]: i,
  };
}

export function useRowHeightObserver() {
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [rowHeights, setRowHeights] = useState<number[]>([]);

  const observer = useMemo(() => {
    if (typeof window === "undefined") {
      return undefined;
    }
    const callback = (entries: ResizeObserverEntry[]) => {
      setRowHeights((rowHeights) => {
        const newRowHeights: number[] = [...rowHeights];
        for (const entry of entries) {
          const id = entry.target.getAttribute(idProp);
          if (!id) continue; // probably an error
          const height = entry.target.getBoundingClientRect().height;
          newRowHeights[id] = height;
        }
        return newRowHeights;
      });
    };
    return new window.ResizeObserver(callback);
  }, []);

  useEffect(() => {
    return () => observer?.disconnect();
  }, [observer]);

  const getObserveRef = useCallback((i: number) => {
    return (el: HTMLDivElement | null) => {
      if (el && rowRefs.current[i]) {
        observer?.unobserve(el);
      }
      rowRefs.current[i] = el;
      if (el) {
        observer?.observe(el);
      }
    };
  }, []);

  return {
    getObserveProps,
    getObserveRef,
    rowHeights,
  };
}
