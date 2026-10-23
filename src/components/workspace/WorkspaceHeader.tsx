import { ExtendedDSpace } from "~/components/spaces/denormalized-space-selector";
import { allowEdits, forbidEdits } from "~/modules/canvas_state/actions";
import { useAppDispatch } from "~/modules/hooks";
import { AccountMenu } from "./AccountMenu";
import { FieldHelp } from "./FieldHelp";
import styles from "./workspace.module.css";

export function WorkspaceHeader({
  view,
  onViewChange,
  model,
  onDetails,
}: {
  view: "canvas" | "sheet";
  onViewChange(view: "canvas" | "sheet"): void;
  model?: ExtendedDSpace;
  onDetails?(): void;
}) {
  const dispatch = useAppDispatch();
  const editing =
    !!model?.editableByMe &&
    (!model.canvasState.editsAllowedManuallySet ||
      model.canvasState.editsAllowed);
  const action = model?.canvasState.actionState;
  const status = !model
    ? "Not saved"
    : action === "SAVING"
    ? "Saving…"
    : action === "ERROR"
    ? "Couldn’t save"
    : action === "CONFLICT"
    ? "Save conflict — reload required"
    : action === "COPYING"
    ? "Copying…"
    : action === "ERROR_COPYING"
    ? "Couldn’t copy"
    : !editing
    ? action === "UNALLOWED_ATTEMPT"
      ? "Local changes · not saved"
      : "Changes won’t save"
    : action === "SAVED"
    ? "Saved"
    : "Autosave on";
  return (
    <header className={`${styles.header} ${model ? styles.modelHeader : ""}`}>
      <a href="/" className={styles.brand} aria-label="Guesstimate home">
        <img src="/assets/new-logo-2.png" alt="" width="26" height="26" />
        <span>Guesstimate</span>
      </a>
      <div className={styles.documentTitle}>
        <h1>
          {model ? (
            <button
              type="button"
              className={styles.modelTitleButton}
              onClick={onDetails}
              aria-label="Open model details"
              title={model.name || "Untitled model"}
            >
              <span>{model.name || "Untitled model"}</span>
              <span aria-hidden="true">⌄</span>
            </button>
          ) : (
            "Scratchpad"
          )}
        </h1>
        <span
          className={styles.temporary}
          role="status"
          aria-live="polite"
          title={status}
        >
          {status}
        </span>
      </div>
      <div
        className={styles.viewSwitch}
        role="group"
        aria-label="Workspace view"
      >
        {(["sheet", "canvas"] as const).map((mode) => (
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
      {model && (
        <select
          className={styles.mobileViewSwitch}
          aria-label="Workspace view"
          value={view}
          onChange={(event) =>
            onViewChange(event.target.value as "sheet" | "canvas")
          }
        >
          <option value="sheet">Sheet</option>
          <option value="canvas">Canvas</option>
        </select>
      )}
      {model && (
        <div
          className={`${styles.modelMode} ${
            !model.editableByMe ? styles.viewOnlyMode : ""
          }`}
        >
          {!model.editableByMe && (
            <span
              className={styles.mobileModeStatus}
              aria-label="Model mode: Viewing"
            >
              Viewing
            </span>
          )}
          <select
            aria-label="Model mode"
            value={editing ? "editing" : "viewing"}
            onChange={(event) =>
              dispatch(
                event.target.value === "editing" ? allowEdits() : forbidEdits()
              )
            }
          >
            <option value="viewing">Viewing</option>
            <option value="editing" disabled={!model.editableByMe}>
              Editing
            </option>
          </select>
          <FieldHelp label="Help with model modes">
            <p>
              Viewing lets you experiment without saving changes to this model.
              Editing saves your changes, including any local changes when you
              next edit.
            </p>
            {!model.editableByMe && (
              <p>
                You don’t have access to save this model. Make a copy to keep
                your own version.
              </p>
            )}
          </FieldHelp>
        </div>
      )}
      <AccountMenu
        callbackUrl={model ? `/models/${model.id}` : "/scratchpad"}
      />
    </header>
  );
}
