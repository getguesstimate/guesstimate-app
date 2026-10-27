import type { RefObject } from "react";
import { useRouter } from "next/router";
import { FieldHelp } from "../FieldHelp";
import styles from "../workspace.module.css";
type Props = {
  name: string;
  description: string;
  privateModel: boolean;
  busy: boolean;
  error: string;
  setName(value: string): void;
  setDescription(value: string): void;
  setPrivateModel(value: boolean): void;
  canBePrivate: boolean;
  privateLimitReached: boolean;
  hasPrivateUsage: boolean;
  privateModelCount?: number;
  privateModelLimit?: number;
  visibilityRef: RefObject<HTMLSelectElement | null>;
  setPrivacyNotice(value: boolean): void;
  save(): Promise<void>;
};
export function ModelDetailsForm({
  name,
  description,
  privateModel,
  busy,
  error,
  setName,
  setDescription,
  setPrivateModel,
  canBePrivate,
  privateLimitReached,
  hasPrivateUsage,
  privateModelCount,
  privateModelLimit,
  visibilityRef,
  setPrivacyNotice,
  save,
}: Props) {
  const router = useRouter();
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void save();
      }}
    >
      <label className={styles.field}>
        Title
        <input
          autoFocus
          value={name}
          onChange={(event) => setName(event.target.value)}
          disabled={busy}
        />
      </label>
      <label className={styles.field}>
        Description
        <textarea
          className={styles.modelDescriptionInput}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          disabled={busy}
        />
      </label>
      <div className={styles.modelInline}>
        <label className={styles.field}>
          Visibility
          <select
            ref={visibilityRef}
            value={privateModel ? "private" : "public"}
            disabled={busy}
            onChange={(event) => {
              const wantsPrivate = event.target.value === "private";
              if (wantsPrivate && !canBePrivate) {
                if (privateLimitReached) setPrivacyNotice(true);
                else void router.push("/billing");
                return;
              }
              setPrivateModel(wantsPrivate);
            }}
          >
            <option value="public">Public</option>
            <option value="private">
              {!canBePrivate && !privateLimitReached
                ? "Private — upgrade plan"
                : "Private"}
            </option>
          </select>
        </label>
        <FieldHelp label="Help with model visibility">
          <p>
            Public models can be viewed by anyone. Private models are available
            to their owner, organization members, and people with an enabled
            shareable link. Only people with edit access can save changes.
          </p>
          {hasPrivateUsage && (
            <p>
              {privateModelCount} of {privateModelLimit} private models used.
            </p>
          )}
          {!canBePrivate && (
            <p>
              {privateLimitReached
                ? "Your private-model limit has been reached."
                : "Your plan doesn’t support another private model."}{" "}
              Choosing Private shows your plan options.
            </p>
          )}
        </FieldHelp>
      </div>
      {error && (
        <p role="alert" className={styles.nodeError}>
          {error}
        </p>
      )}
      <div className={`${styles.modelActions} ${styles.modelFormFooter}`}>
        <button type="submit" className={styles.noteSave} disabled={busy}>
          {busy ? "Saving…" : "Save details"}
        </button>
      </div>
    </form>
  );
}
