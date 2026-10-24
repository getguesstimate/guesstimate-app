import { useRef } from "react";
import Modal from "react-modal";
import { useSession } from "next-auth/react";
import { signIn } from "~/lib/auth";
import { Plan } from "~/lib/config/plan";
import { useAppSelector } from "~/modules/hooks";
import { Icon } from "~/components/workspace/Icon";
import styles from "./account.module.css";

export function AccountAccess({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const me = useAppSelector((state) => state.me);
  if (status === "loading" || me.tag === "SIGNED_IN_LOADING_PROFILE")
    return (
      <p role="status" className={styles.muted}>
        Loading your account…
      </p>
    );
  if (me.tag === "SIGNED_IN_NO_PROFILE")
    return (
      <p role="status">
        Confirm your email, then sign in again to access your account.
      </p>
    );
  if (me.tag !== "SIGNED_IN")
    return (
      <div className={styles.signInPrompt}>
        <p>Sign in to access your account.</p>
        <button className={styles.primary} onClick={() => signIn()}>
          Sign in
        </button>
      </div>
    );
  return <>{children}</>;
}

export function AccountSettingsContent() {
  const profile = useAppSelector((state) => state.me.profile);
  const plan = Plan.find(profile?.plan?.id);
  return (
    <AccountAccess>
      {profile && (
        <div className={styles.settingsContent}>
          <div>
            <span className={styles.eyebrow}>Account</span>
            <p className={styles.accountName}>
              {profile.name || "Your account"}
            </p>
          </div>
          <div className={styles.planSummary}>
            <div>
              <span className={styles.eyebrow}>Current plan</span>
              <h2>{plan?.fullName() || profile.plan?.name || "Your plan"}</h2>
              <p>
                {plan
                  ? `${plan.number()} private models · Unlimited public models`
                  : "View your plan and payment details in Billing."}
              </p>
            </div>
          </div>
          <div className={styles.actions}>
            <a className={styles.primary} href="/billing">
              Manage billing
            </a>
            <a className={styles.secondary} href={`/users/${profile.id}`}>
              My models
            </a>
          </div>
        </div>
      )}
    </AccountAccess>
  );
}

export function AccountSettingsDialog({
  open,
  onClose,
  onAfterClose,
}: {
  open: boolean;
  onClose(): void;
  onAfterClose?(): void;
}) {
  const closeButton = useRef<HTMLButtonElement>(null);
  return (
    <Modal
      isOpen={open}
      onRequestClose={onClose}
      onAfterOpen={() => closeButton.current?.focus()}
      onAfterClose={onAfterClose}
      appElement={
        typeof document !== "undefined"
          ? document.getElementById("__next") || undefined
          : undefined
      }
      contentLabel="Account settings"
      className={styles.dialog}
      overlayClassName={styles.overlay}
      bodyOpenClassName={styles.modalOpen}
    >
      <div className={styles.dialogHeading}>
        <h2>Account settings</h2>
        <button
          ref={closeButton}
          type="button"
          className={styles.close}
          aria-label="Close account settings"
          onClick={onClose}
        >
          <Icon name="close" />
        </button>
      </div>
      <AccountSettingsContent />
    </Modal>
  );
}
