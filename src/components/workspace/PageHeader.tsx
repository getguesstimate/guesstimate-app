import { useEffect, useRef, useState } from "react";
import { HeaderActions } from "./HeaderActions";
import workspace from "./workspace.module.css";
import styles from "./pageHeader.module.css";

export function PageHeader({
  className,
  brandClassName = "",
  organizationId,
}: {
  className: string;
  brandClassName?: string;
  organizationId?: number;
}) {
  const header = useRef<HTMLElement>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const element = header.current;
    if (!element) return;
    let previous = window.scrollY;
    let frame = 0;
    const show = () => {
      setHidden(false);
      previous = window.scrollY;
    };
    const update = () => {
      frame = 0;
      // Clamp elastic overscroll so reaching either edge doesn't reverse direction.
      const maximum = Math.max(
        0,
        document.documentElement.scrollHeight - innerHeight
      );
      const position = Math.max(0, Math.min(window.scrollY, maximum));
      if (
        position <= element.offsetHeight ||
        element.querySelector(
          'details[open], [aria-expanded="true"], :focus-visible'
        )
      ) {
        show();
        return;
      }
      const distance = position - previous;
      if (Math.abs(distance) < 10) return;
      setHidden(distance > 0);
      previous = position;
    };
    const scroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("pageshow", show);
    window.addEventListener("resize", show);
    element.addEventListener("focusin", show);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("pageshow", show);
      window.removeEventListener("resize", show);
      element.removeEventListener("focusin", show);
    };
  }, []);

  return (
    <header
      ref={header}
      className={`${className} ${styles.header} ${hidden ? styles.hidden : ""}`}
    >
      <a
        href="/models"
        className={`${workspace.brand} ${brandClassName}`}
        aria-label="Browse models"
      >
        <img src="/assets/new-logo-2.png" alt="" width="26" height="26" />
        <span>Guesstimate</span>
      </a>
      <HeaderActions organizationId={organizationId} />
    </header>
  );
}
