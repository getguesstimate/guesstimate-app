import { useRef, useState } from "react";
import Modal from "react-modal";
import ReactMarkdown from "react-markdown";
import { Icon } from "./Icon";
import styles from "./workspace.module.css";

export function NodeNotes({
  value,
  onSave,
}: {
  value: string;
  onSave(value: string): void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const input = useRef<HTMLTextAreaElement>(null);
  const hasNote = value.trim().length > 0;
  const close = () => setEditing(false);
  return (
    <section className={styles.notesSection} aria-label="Notes">
      <div className={styles.notesHeading}>
        <h3>Notes</h3>
        <button
          type="button"
          className={styles.noteAction}
          onClick={() => {
            setDraft(value);
            setEditing(true);
          }}
        >
          {hasNote ? "Edit note" : "Add note"}
        </button>
      </div>
      {hasNote && (
        <div className={styles.noteMarkdown}>
          <ReactMarkdown source={value} skipHtml={true} />
        </div>
      )}
      <Modal
        isOpen={editing}
        onRequestClose={close}
        onAfterOpen={() => input.current?.focus()}
        appElement={
          typeof document !== "undefined"
            ? document.getElementById("__next") || undefined
            : undefined
        }
        aria={{ labelledby: "note-dialog-title" }}
        className={styles.noteDialog}
        overlayClassName={styles.noteOverlay}
        shouldCloseOnOverlayClick={false}
      >
        <div className={styles.noteDialogHeading}>
          <h2 id="note-dialog-title">{hasNote ? "Edit note" : "Add note"}</h2>
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Close note editor"
            onClick={close}
          >
            <Icon name="close" />
          </button>
        </div>
        <textarea
          ref={input}
          aria-label="Note (Markdown supported)"
          className={styles.noteTextarea}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
        />
        <div className={styles.noteDialogActions}>
          <button type="button" className={styles.noteAction} onClick={close}>
            Cancel
          </button>
          <button
            type="button"
            className={styles.noteSave}
            onClick={() => {
              if (draft !== value) onSave(draft);
              close();
            }}
          >
            Save
          </button>
        </div>
      </Modal>
    </section>
  );
}
