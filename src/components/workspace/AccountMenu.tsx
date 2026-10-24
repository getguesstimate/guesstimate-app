import { useEffect, useRef, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { signIn } from "~/lib/auth";
import { useAppSelector } from "~/modules/hooks";
import { Icon } from "./Icon";
import { NewModelButton } from "./NewModelButton";
import { AccountSettingsDialog } from "~/components/account/AccountSettings";
import styles from "./workspace.module.css";

export function AccountMenu({
  callbackUrl = "/scratchpad",
  showMyModels = true,
  showNewModel = false,
}: {
  callbackUrl?: string;
  showMyModels?: boolean | "mobile";
  showNewModel?: boolean | "mobile";
}) {
  const me = useAppSelector((state) => state.me);
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [failedPicture, setFailedPicture] = useState<string | null>(null);
  const name = me.tag === "SIGNED_IN" ? me.profile.name : session?.user?.name;
  const picture =
    me.tag === "SIGNED_IN" ? me.profile.picture : session?.user?.image;
  const initials = name
    ?.trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  const menu = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (document.querySelector("[data-model-owner-dialog]")) return;
      if (!menu.current?.contains(event.target as Node)) setOpen(false);
    };
    const key = (event: KeyboardEvent) => {
      if (document.querySelector("[data-model-owner-dialog]")) return;
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
        if (document.querySelector("[data-model-owner-dialog]")) return;
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      {me.tag !== "SIGNED_OUT" ? (
        <>
          <button
            ref={trigger}
            type="button"
            className={`${styles.iconButton} ${styles.accountTrigger}`}
            aria-label="Account"
            aria-expanded={open}
            aria-controls="workspace-account"
            onClick={() => setOpen(!open)}
          >
            {picture && picture !== failedPicture ? (
              <img
                className={styles.accountAvatar}
                src={picture}
                alt=""
                referrerPolicy="no-referrer"
                onError={() => setFailedPicture(picture)}
              />
            ) : initials ? (
              <span className={styles.accountInitials} aria-hidden="true">
                {initials}
              </span>
            ) : (
              <Icon name="user" />
            )}
          </button>
          {open && (
            <nav
              id="workspace-account"
              aria-label="Account"
              className={styles.accountMenu}
            >
              <p>{me.tag === "SIGNED_IN" ? me.profile.name : "Your account"}</p>
              {showNewModel && (
                <div
                  className={
                    showNewModel === "mobile"
                      ? styles.mobileNewModel
                      : undefined
                  }
                >
                  <NewModelButton inMenu />
                </div>
              )}
              {showMyModels && me.tag === "SIGNED_IN" && (
                <a
                  href={`/users/${me.profile.id}`}
                  className={
                    showMyModels === "mobile"
                      ? styles.mobileMyModels
                      : undefined
                  }
                >
                  My models
                </a>
              )}
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setSettingsOpen(true);
                }}
              >
                Account settings
              </button>
              <a href="/billing">Billing</a>
              <a href="/organizations">Organizations</a>
              <a
                href="https://docs.getguesstimate.com/docs/Introduction"
                target="_blank"
                rel="noopener noreferrer"
              >
                Documentation
              </a>
              <a href="/">Homepage</a>
              <button type="button" onClick={() => signOut({ callbackUrl })}>
                Sign out
              </button>
              <div
                className={styles.accountSupport}
                aria-label="Community and support"
              >
                <a
                  href="https://discord.gg/nsTnQTgtG6"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Join Discord"
                  title="Join Discord"
                >
                  <Icon name="discord" />
                </a>
                <a
                  href="mailto:support@quantifieduncertainty.org"
                  aria-label="Email support"
                  title="Email support"
                >
                  <Icon name="mail" />
                </a>
              </div>
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
      <AccountSettingsDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onAfterClose={() => trigger.current?.focus()}
      />
    </div>
  );
}
