import { CSSProperties, useEffect, useRef, useState } from "react";
import styles from "./workspace.module.css";

export function usePanelResize() {
  const mainRef = useRef<HTMLElement>(null);
  const [bounds, setBounds] = useState({
    width: 1024,
    height: 800,
    mobile: false,
  });
  const [width, setWidth] = useState(320);
  const [height, setHeight] = useState<number | null>(null);
  const [resizing, setResizing] = useState(false);
  const drag = useRef<{ start: number; size: number; pointer: number } | null>(
    null
  );
  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    const measure = () =>
      setBounds({
        width: main.clientWidth,
        height: main.clientHeight,
        mobile: window.innerWidth <= 650,
      });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(main);
    return () => observer.disconnect();
  }, []);
  const { mobile } = bounds;
  const max = mobile
    ? Math.max(120, bounds.height - 160)
    : Math.min(600, Math.max(260, bounds.width - 320));
  const min = Math.min(mobile ? 200 : 260, max);
  const clamp = (value: number) =>
    Math.round(Math.min(max, Math.max(min, value)));
  const value = clamp(mobile ? height ?? bounds.height * 0.48 : width);
  const change = (next: number) =>
    mobile ? setHeight(clamp(next)) : setWidth(clamp(next));
  useEffect(() => {
    drag.current = null;
    setResizing(false);
  }, [mobile]);
  return {
    mainRef,
    panelStyle: {
      "--inspector-width": `${mobile ? width : value}px`,
      "--inspector-height": mobile ? `${value}px` : "48%",
    } as CSSProperties,
    resizing,
    resizeHandle: (
      <div
        className={styles.panelResizeHandle}
        role="separator"
        tabIndex={0}
        aria-label={
          mobile ? "Resize node details height" : "Resize node details width"
        }
        aria-orientation={mobile ? "horizontal" : "vertical"}
        aria-controls="node-details-panel"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={`${value} pixels`}
        title={
          mobile
            ? "Drag to resize · Up/Down to adjust · Double-click to reset"
            : "Drag to resize · Left/Right to adjust · Double-click to reset"
        }
        onPointerDown={(event) => {
          if (event.button !== 0) return;
          event.preventDefault();
          event.currentTarget.focus();
          event.currentTarget.setPointerCapture(event.pointerId);
          drag.current = {
            start: mobile ? event.clientY : event.clientX,
            size: value,
            pointer: event.pointerId,
          };
          setResizing(true);
        }}
        onPointerMove={(event) => {
          const current = drag.current;
          if (!current || current.pointer !== event.pointerId) return;
          change(
            current.size +
              current.start -
              (mobile ? event.clientY : event.clientX)
          );
        }}
        onPointerUp={(event) => {
          drag.current = null;
          setResizing(false);
          if (event.currentTarget.hasPointerCapture(event.pointerId))
            event.currentTarget.releasePointerCapture(event.pointerId);
        }}
        onLostPointerCapture={() => {
          drag.current = null;
          setResizing(false);
        }}
        onPointerCancel={() => {
          drag.current = null;
          setResizing(false);
        }}
        onDoubleClick={() => change(mobile ? bounds.height * 0.48 : 320)}
        onKeyDown={(event) => {
          const increase = mobile ? "ArrowUp" : "ArrowLeft";
          const decrease = mobile ? "ArrowDown" : "ArrowRight";
          if (![increase, decrease, "Home", "End"].includes(event.key)) return;
          event.preventDefault();
          event.stopPropagation();
          const step = event.shiftKey ? 40 : 10;
          change(
            event.key === "Home"
              ? min
              : event.key === "End"
              ? max
              : value + (event.key === increase ? step : -step)
          );
        }}
      />
    ),
  };
}
