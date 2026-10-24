import { useEffect, useRef, useState } from "react";
import styles from "./calculator.module.css";

export function CalculatorActions({
  id,
  editable,
  onEdit,
  onDelete,
}: {
  id: number;
  editable: boolean;
  onEdit(): void;
  onDelete(): void;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);
  return (
    <div
      ref={root}
      className={styles.toolbar}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.stopPropagation();
          setOpen(false);
          trigger.current?.focus();
        }
      }}
    >
      <button
        type="button"
        ref={trigger}
        className={styles.icon}
        aria-label="Calculator actions"
        title="Calculator actions"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        •••
      </button>
      {open && (
        <div className={styles.menu}>
          <a href={`/calculators/${id}`}>Open full page</a>
          {editable && (
            <>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onEdit();
                }}
              >
                Edit calculator
              </button>
              <button
                type="button"
                className={styles.danger}
                onClick={() => {
                  setOpen(false);
                  onDelete();
                }}
              >
                Delete calculator
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
