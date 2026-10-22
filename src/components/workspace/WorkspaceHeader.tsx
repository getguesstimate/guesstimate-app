import { useEffect, useRef, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { signIn } from "~/lib/auth";
import { useAppSelector } from "~/modules/hooks";
import { Icon } from "./Icon";
import styles from "./workspace.module.css";

export function WorkspaceHeader({
  view,
  onViewChange,
}: {
  view: "canvas" | "sheet";
  onViewChange(view: "canvas" | "sheet"): void;
}) {
  const me = useAppSelector((state) => state.me);
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (!menu.current?.contains(event.target as Node)) setOpen(false);
    };
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", key);
    };
  }, [open]);
  return (
    <header className={styles.header}>
      <a href="/" className={styles.brand} aria-label="Guesstimate home">
        <img src="/assets/new-logo-2.png" alt="" width="26" height="26" />
        <span>Guesstimate</span>
      </a>
      <div className={styles.documentTitle}>
        <h1>Scratchpad</h1>
        <span className={styles.temporary}>Not saved</span>
      </div>
      <div
        className={styles.viewSwitch}
        role="group"
        aria-label="Workspace view"
      >
        {(["canvas", "sheet"] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            aria-pressed={view === mode}
            onClick={() => onViewChange(mode)}
          >
            {mode === "canvas" ? "Canvas" : "Sheet"}
          </button>
        ))}
      </div>
      <div
        className={styles.account}
        ref={menu}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget))
            setOpen(false);
        }}
      >
        {session ? (
          <>
            <button
              ref={trigger}
              type="button"
              className={styles.iconButton}
              aria-label="Account"
              aria-expanded={open}
              aria-controls="workspace-account"
              onClick={() => setOpen(!open)}
            >
              <Icon name="user" />
            </button>
            {open && (
              <nav
                id="workspace-account"
                aria-label="Account"
                className={styles.accountMenu}
              >
                <p>
                  {me.tag === "SIGNED_IN" ? me.profile.name : "Your account"}
                </p>
                {me.tag === "SIGNED_IN" && (
                  <a href={`/users/${me.profile.id}`}>My models</a>
                )}
                <a href="/settings">Account settings</a>
                <a href="/billing">Billing</a>
                <a href="/organizations/new">New organization</a>
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/scratchpad" })}
                >
                  Sign out
                </button>
              </nav>
            )}
          </>
        ) : (
          <button type="button" className={styles.signIn} onClick={signIn}>
            <Icon name="user" />
            Sign in
          </button>
        )}
      </div>
    </header>
  );
}
