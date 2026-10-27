import { Icon } from "./Icon";
import { FieldHelp } from "./FieldHelp";
import { cellName } from "./sheetGeometry";
import type { CanvasLocation } from "~/lib/locationUtils";
import styles from "./workspace.module.css";
type Props = {
  add(): void;
  hand: boolean;
  setHand(value: boolean): void;
  areaMode: boolean;
  setAreaMode(value: boolean): void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo(): void;
  onRedo(): void;
  cell: CanvasLocation;
  simplified: boolean;
  disabled: boolean;
  onDownload(): void;
};

export function SheetToolbar({
  add,
  hand,
  setHand,
  areaMode,
  setAreaMode,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  cell,
  simplified,
  disabled,
  onDownload,
}: Props) {
  return (
    <div
      className={styles.sheetToolbar}
      role="toolbar"
      aria-label="Sheet tools"
    >
      <button
        type="button"
        className={styles.addButton}
        aria-label="Add node"
        title="Add node"
        disabled={disabled}
        onClick={add}
      >
        <Icon name="plus" />
        <span className={styles.addLabel}>
          Add<span className={styles.addNodeWord}> node</span>
        </span>
      </button>
      <span className={styles.divider} />
      <button
        type="button"
        className={`${styles.iconButton} ${styles.desktopSelectionTool} ${styles.sheetSelectTool}`}
        aria-label="Select tool"
        aria-pressed={!hand && !areaMode}
        onClick={() => {
          setHand(false);
          setAreaMode(false);
        }}
      >
        <Icon name="cursor" />
      </button>
      <button
        type="button"
        className={`${styles.iconButton} ${styles.sheetHandTool}`}
        aria-label="Hand tool"
        aria-pressed={hand}
        onClick={() => {
          setHand(true);
          setAreaMode(false);
        }}
      >
        <Icon name="hand" />
      </button>
      <button
        type="button"
        className={`${styles.iconButton} ${styles.desktopSelectionTool} ${styles.touchSelectionTool}`}
        aria-label="Select an area"
        title="Select an area"
        aria-pressed={areaMode}
        onClick={() => {
          setAreaMode(!areaMode);
          setHand(false);
        }}
      >
        <Icon name="selection" />
      </button>
      <button
        type="button"
        className={`${styles.iconButton} ${styles.mobileSelectionToggle}`}
        aria-label="Area selection"
        aria-pressed={areaMode}
        title={
          areaMode ? "Switch to normal selection" : "Switch to area selection"
        }
        onClick={() => {
          setAreaMode(!areaMode);
          setHand(false);
        }}
      >
        <Icon name={areaMode ? "selection" : "cursor"} />
      </button>
      <button
        type="button"
        className={styles.iconButton}
        aria-label="Undo"
        disabled={!canUndo}
        onClick={onUndo}
      >
        <Icon name="undo" />
      </button>
      <button
        type="button"
        className={styles.iconButton}
        aria-label="Redo"
        disabled={!canRedo}
        onClick={onRedo}
      >
        <Icon name="redo" />
      </button>
      <span className={styles.sheetCellAddress} aria-label="Selected cell">
        {cellName(cell)}
      </span>
      <FieldHelp label="Sheet help">
        <p>
          Double-click or double-tap an empty cell to add a node, or select it
          and press Enter. N adds a node at the selected cell or the next empty
          cell below. Use arrow keys to move between cells. Drag across cells to
          select a range, or use Shift-click and Shift-arrow keys. Delete
          removes the selected nodes; Undo restores them.{" "}
          {simplified
            ? "Drag a node’s top-right corner to move it to an empty cell. Drag the corner of a selected node to move the whole group."
            : "Drag a node’s header to move it to an empty cell. Drag a selected header to move the whole group."}{" "}
          Use the hand tool or hold Space to drag the sheet. Swipe to pan on
          touch screens; pinch to zoom. The mouse wheel scrolls in Select mode
          and zooms in Hand mode. Ctrl + scroll zooms around the pointer in
          either mode. Ctrl/⌘ D duplicates selected nodes. While editing a
          value, Enter moves down and Tab moves right, creating a node if the
          next cell is empty. Formulas use the reference IDs on nodes.
        </p>
      </FieldHelp>
      <button
        type="button"
        className={styles.iconButton}
        aria-label="Download JSON"
        disabled={disabled}
        onClick={onDownload}
      >
        <Icon name="download" />
      </button>
    </div>
  );
}
