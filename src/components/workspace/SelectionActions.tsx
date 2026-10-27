import { Icon } from "./Icon";
import styles from "./workspace.module.css";
type Props = {
  count: number;
  surface: "sheet" | "canvas";
  onDuplicate(): void;
  onDelete(): void;
  onClear(): void;
};
export function SelectionActions({
  count,
  surface,
  onDuplicate,
  onDelete,
  onClear,
}: Props) {
  return (
    <div
      data-canvas-control={surface === "canvas" ? true : undefined}
      className={styles.sheetSelection}
      role="group"
      aria-label={surface === "canvas" ? "Canvas selection" : "Selected range"}
    >
      <span aria-label={`${count} selected nodes`}>
        {count}{" "}
        <span className={styles.selectionCountLabel}>
          {count === 1 ? "node" : "nodes"}
        </span>
      </span>
      <button
        type="button"
        className={styles.iconButton}
        aria-label="Duplicate selected nodes"
        title="Duplicate"
        disabled={!count}
        onClick={onDuplicate}
      >
        <Icon name="duplicate" />
      </button>
      <button
        type="button"
        className={styles.iconButton}
        aria-label="Delete selected nodes"
        disabled={!count}
        onClick={onDelete}
      >
        <Icon name="trash" />
      </button>
      <button
        type="button"
        className={styles.iconButton}
        aria-label="Clear selection"
        onClick={onClear}
      >
        <Icon name="close" />
      </button>
    </div>
  );
}
