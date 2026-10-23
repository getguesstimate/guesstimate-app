import { useEffect, useRef, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { signIn } from "~/lib/auth";
import { useAppSelector } from "~/modules/hooks";
import { Icon } from "./Icon";
import styles from "./workspace.module.css";

export function AccountMenu({
  callbackUrl = "/scratchpad",
}: {
  callbackUrl?: string;
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
    <div
      className={styles.account}
      ref={menu}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
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
              <p>{me.tag === "SIGNED_IN" ? me.profile.name : "Your account"}</p>
              {me.tag === "SIGNED_IN" && (
                <a href={`/users/${me.profile.id}`}>My models</a>
              )}
              <a href="/settings">Account settings</a>
              <a href="/billing">Billing</a>
              <a href="/organizations/new">New organization</a>
              <button type="button" onClick={() => signOut({ callbackUrl })}>
                Sign out
              </button>
            </nav>
          )}
        </>
      ) : (
        <button
          type="button"
          className={styles.signIn}
          onClick={signIn}
          aria-label="Sign in"
          title="Sign in"
        >
          <Icon name="user" />
          <span>Sign in</span>
        </button>
      )}
    </div>
  );
}
