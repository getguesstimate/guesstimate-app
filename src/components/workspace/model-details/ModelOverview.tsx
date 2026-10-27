import type { ExtendedDSpace } from "~/components/spaces/denormalized-space-selector";
import { FieldHelp } from "../FieldHelp";
import { Icon } from "../Icon";
import styles from "../workspace.module.css";
import ReactMarkdown from "react-markdown";
import * as engine from "~/lib/engine/engine";
type Props = {
  space: ExtendedDSpace;
  message: string;
  error: string;
  busy: boolean;
  beginEdit(): void;
  shareAction(action: "enable" | "disable" | "reset"): void;
};
export function ModelOverview({
  space,
  message,
  error,
  busy,
  beginEdit,
  shareAction,
}: Props) {
  const owner = engine.space.getOwner(space);
  const ownerUrl = space.organization?.name
    ? `/organizations/${space.organization.id}`
    : space.user?.id
    ? `/users/${space.user.id}`
    : undefined;
  const link = engine.space.urlWithToken(space);
  return (
    <>
      <div className={styles.modelSectionHeading}>
        <h3>{space.name || "Untitled model"}</h3>
        {space.editableByMe && (
          <button
            type="button"
            className={styles.noteAction}
            onClick={beginEdit}
          >
            <Icon name="edit" />
            Edit details
          </button>
        )}
      </div>
      {message === "Details saved." && (
        <p role="status" className={styles.modelFeedback}>
          {message}
        </p>
      )}
      <div className={styles.modelMetadata}>
        {owner?.name && (
          <span>
            By {ownerUrl ? <a href={ownerUrl}>{owner.name}</a> : owner.name}
          </span>
        )}
        <span>{space.is_private ? "Private" : "Public"}</span>
      </div>
      {space.description ? (
        <div className={styles.noteMarkdown}>
          <ReactMarkdown source={space.description} skipHtml />
        </div>
      ) : (
        <p className={styles.fieldHint}>No description.</p>
      )}
      {space.is_private && space.editableByMe && (
        <section className={styles.modelSection}>
          <div className={styles.fieldHeading}>
            <h3>Shareable link</h3>
            <FieldHelp label="Help with shareable links">
              <p>
                Anyone with this link can view the model and experiment locally.
                They can’t save changes to the original. Resetting the link
                disables the previous link.
              </p>
            </FieldHelp>
          </div>
          {message && message !== "Details saved." && (
            <p role="status" className={styles.modelFeedback}>
              {message}
            </p>
          )}
          {error && (
            <p role="alert" className={styles.nodeError}>
              {error}
            </p>
          )}
          {link ? (
            <>
              <label className={styles.field}>
                Link
                <input
                  readOnly
                  value={link}
                  onFocus={(event) => event.target.select()}
                />
              </label>
              <div className={styles.modelActions}>
                <button
                  type="button"
                  className={styles.noteAction}
                  disabled={busy}
                  onClick={() => shareAction("reset")}
                >
                  Reset link
                </button>
                <button
                  type="button"
                  className={styles.noteAction}
                  disabled={busy}
                  onClick={() => shareAction("disable")}
                >
                  Disable link
                </button>
              </div>
            </>
          ) : (
            <button
              type="button"
              className={styles.noteAction}
              disabled={busy}
              onClick={() => shareAction("enable")}
            >
              Enable link
            </button>
          )}
        </section>
      )}
    </>
  );
}
