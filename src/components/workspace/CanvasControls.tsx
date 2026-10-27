import { SelectionActions } from "./SelectionActions";
import { Icon } from "./Icon";
import styles from "./workspace.module.css";
type Props = {
  selectionCount: number;
  nodeCount: number;
  loading: boolean;
  error: boolean;
  areaMode: boolean;
  setAreaMode(value: boolean): void;
  help: boolean;
  setHelp(value: boolean): void;
  canvasHeight: number;
  isScratchpad: boolean;
  simplified: boolean;
  zoomLevel: number;
  canUndo: boolean;
  canRedo: boolean;
  onUndo(): void;
  onRedo(): void;
  onClear(): void;
  add(): void;
  duplicateSelection(): void;
  remove(): void;
  load(): void;
  download(): void;
  zoom(factor: number): void;
  resetZoom(): void;
  fit(): void;
};

export function CanvasControls({
  selectionCount,
  nodeCount,
  loading,
  error,
  areaMode,
  setAreaMode,
  help,
  setHelp,
  canvasHeight,
  isScratchpad,
  simplified,
  zoomLevel,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onClear,
  add,
  duplicateSelection,
  remove,
  load,
  download,
  zoom,
  resetZoom,
  fit,
}: Props) {
  return (
    <>
      {selectionCount > 0 && (
        <SelectionActions
          surface="canvas"
          count={selectionCount}
          onDuplicate={duplicateSelection}
          onDelete={remove}
          onClear={onClear}
        />
      )}
      <div
        data-canvas-control
        className={styles.toolbar}
        role="toolbar"
        aria-label="Canvas tools"
      >
        <button
          type="button"
          className={styles.addButton}
          aria-label="Add node"
          title="Add node"
          onClick={() => add()}
          disabled={loading || error}
        >
          <Icon name="plus" />
          <span className={styles.addLabel}>
            Add<span className={styles.addNodeWord}> node</span>
          </span>
        </button>
        <span className={styles.divider} />
        <button
          type="button"
          className={`${styles.iconButton} ${styles.desktopSelectionTool}`}
          aria-label="Select nodes"
          aria-pressed={!areaMode}
          onClick={() => {
            setAreaMode(false);
          }}
          title="Select nodes"
        >
          <Icon name="cursor" />
        </button>
        <button
          type="button"
          className={`${styles.iconButton} ${styles.desktopSelectionTool}`}
          aria-label="Select an area"
          title="Select an area"
          aria-pressed={areaMode}
          onClick={() => {
            setAreaMode(!areaMode);
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
          onClick={() => setAreaMode(!areaMode)}
        >
          <Icon name={areaMode ? "selection" : "cursor"} />
        </button>
        <span className={styles.divider} />
        <button
          type="button"
          className={styles.iconButton}
          disabled={!canUndo}
          aria-label="Undo"
          title="Undo (Ctrl/⌘ Z)"
          onClick={onUndo}
        >
          <Icon name="undo" />
        </button>
        <button
          type="button"
          className={styles.iconButton}
          disabled={!canRedo}
          aria-label="Redo"
          title="Redo (Ctrl/⌘ Shift Z)"
          onClick={onRedo}
        >
          <Icon name="redo" />
        </button>
      </div>
      {(loading || error) && (
        <div
          data-canvas-control
          className={styles.canvasMessage}
          role={error ? "alert" : "status"}
        >
          {loading ? (
            <p>Loading model…</p>
          ) : (
            <>
              <h2>Couldn’t load the example</h2>
              <p>Check your connection and try again.</p>
              <button className={styles.signIn} type="button" onClick={load}>
                Try again
              </button>
            </>
          )}
        </div>
      )}
      {!loading && !error && !nodeCount && (
        <div className={styles.canvasMessage}>
          <h2>Your canvas is empty</h2>
          <p>Add a node to start a calculation.</p>
        </div>
      )}
      <div
        data-canvas-control
        className={`${styles.canvasBottom} ${
          selectionCount ? styles.canvasBottomWithSelection : ""
        }`}
      >
        <div className={styles.helpArea}>
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Canvas help"
            aria-expanded={help}
            onClick={() => setHelp(!help)}
          >
            <Icon name="help" />
          </button>
          <span className={styles.canvasHint}>
            Drag to pan · Scroll to zoom
          </span>
          {help && (
            <section
              className={styles.helpPopover}
              style={{
                maxHeight: Math.min(
                  520,
                  Math.max(40, canvasHeight - (selectionCount ? 250 : 150))
                ),
              }}
              aria-label="Canvas help"
            >
              <div className={styles.panelHeading}>
                <h2>Workspace help</h2>
                <button
                  type="button"
                  className={styles.iconButton}
                  aria-label="Close help"
                  onClick={() => setHelp(false)}
                >
                  <Icon name="close" />
                </button>
              </div>
              {isScratchpad && (
                <p>
                  Changes stay here until you reload. Download a copy before
                  leaving if you want to keep your work.
                </p>
              )}
              <ul>
                <li>
                  Drag the background to pan. Use the mouse wheel or pinch on
                  touch screens to zoom.
                </li>
                <li>
                  {simplified
                    ? "Drag a node’s top-right corner to move it."
                    : "Drag a node’s header to move it."}{" "}
                  Use arrow keys on a focused grip for precise movement.
                </li>
                <li>Select a node to edit its value, formula, or notes.</li>
                <li>
                  Hold Shift and drag to select an area. Hold near an edge to
                  move farther across the canvas. On touch screens, use Select
                  an area.{" "}
                  {simplified
                    ? "Drag the top-right corner of a selected node to move the group;"
                    : "Drag a selected header to move the group;"}{" "}
                  use Duplicate or Delete on the selection. Escape clears it.
                </li>
                <li>
                  With multiple nodes selected, Shift + scroll down spreads them
                  apart; scroll up brings them closer. Undo reverses the
                  adjustment.
                </li>
                <li>
                  With the canvas focused: N adds a node, F fits the model, and
                  + / − zoom. Ctrl/⌘ D duplicates selected nodes.
                </li>
              </ul>
              <button
                type="button"
                className={styles.downloadButton}
                onClick={download}
                disabled={loading || error}
              >
                <Icon name="download" />
                Download JSON
              </button>
              <a
                href="https://docs.getguesstimate.com/docs/Introduction"
                target="_blank"
                rel="noreferrer"
              >
                Open documentation ↗
              </a>
            </section>
          )}
        </div>
        <div
          className={styles.zoomControls}
          role="group"
          aria-label="Zoom controls"
        >
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Zoom out"
            onClick={() => zoom(1 / 1.2)}
          >
            <Icon name="minus" />
          </button>
          <button
            type="button"
            className={styles.zoomLabel}
            aria-label="Reset zoom to 100 percent"
            onClick={resetZoom}
          >
            {Math.round(zoomLevel * 100)}%
          </button>
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Zoom in"
            onClick={() => zoom(1.2)}
          >
            <Icon name="plus" />
          </button>
          <span className={styles.divider} />
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Fit model to view"
            onClick={fit}
          >
            <Icon name="fit" />
          </button>
        </div>
      </div>
    </>
  );
}
