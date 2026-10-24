import { useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import { useSession } from "next-auth/react";
import { signIn } from "~/lib/auth";
import { Plan } from "~/lib/config/plan";
import { useAppSelector } from "~/modules/hooks";
import { Icon } from "~/components/workspace/Icon";
import styles from "./account.module.css";
import { FieldHelp } from "~/components/workspace/FieldHelp";
import {
  useSimplifiedNodes,
  setSimplifiedNodes,
} from "~/components/workspace/useNodeAppearance";

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

function AppearanceSettings() {
  const simplified = useSimplifiedNodes();
  const [storageError, setStorageError] = useState(false);
  return (
    <section className={styles.appearanceSettings} aria-label="Appearance">
      <span className={styles.eyebrow}>Appearance</span>
      <div className={styles.preferenceRow}>
        <div className={styles.preferenceLabel}>
          <span id="simplified-nodes-label">Simplified nodes</span>
          <FieldHelp label="About simplified nodes">
            Fewer labels and graphs behind the values in Sheet and Canvas. Saved
            in this browser for all models and the scratchpad.
          </FieldHelp>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={simplified}
          aria-labelledby="simplified-nodes-label"
          className={styles.preferenceSwitch}
          onClick={() => setStorageError(!setSimplifiedNodes(!simplified))}
        >
          <span />
        </button>
      </div>
      {storageError && (
        <p role="status" className={styles.muted}>
          Applied for this session. Browser storage is unavailable.
        </p>
      )}
    </section>
  );
}

export function AccountSettingsContent() {
  const profile = useAppSelector((state) => state.me.profile);
  const [previewPlan, setPreviewPlan] = useState<string>();
  useEffect(() => {
    // Local visual previews must never change the account or its permissions.
    if (!["localhost", "127.0.0.1", "[::1]"].includes(location.hostname)) return;
    const requested = new URLSearchParams(location.search).get("previewPlan");
    if (requested && Plan.find(requested)) setPreviewPlan(requested);
  }, []);
  const plan = Plan.find(previewPlan || profile?.plan?.id);
  const planLabel =
    plan?.id === "organization_basic_30"
      ? "Organizations"
      : plan?.name || profile?.plan?.name || "View plan";
  const hasSparkles =
    plan?.id === "personal_premium" ||
    plan?.id === "personal_infinite" ||
    plan?.id === "organization_basic_30";
  const planTier =
    plan && plan.privateModelLimit > 0
      ? hasSparkles
        ? "premium"
        : "lite"
      : undefined;
  return (
    <>
      <AppearanceSettings />
      <AccountAccess>
        {profile && (
          <a className={styles.settingsPlan} href="/billing">
            <span>Current plan</span>
            <strong
              className={planTier ? styles.settingsPlanBadge : undefined}
              data-plan-tier={planTier}
            >
              {hasSparkles && (
                <span className={styles.planSparkles} aria-hidden="true">
                  {Array.from({ length: 8 }, (_, index) => (
                    <i key={index} />
                  ))}
                </span>
              )}
              <span>{planLabel}</span>
            </strong>
            <Icon name="arrow" />
          </a>
        )}
      </AccountAccess>
    </>
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
