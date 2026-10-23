import { ReactNode, useEffect, useRef, useState } from "react";
import { DistributionEditor } from "~/components/distributions/DistributionEditor";
import { SimulationHistogram } from "~/components/simulations/SimulationHistogram";
import { FullDenormalizedMetric } from "~/lib/engine/space";
import { withReadableId } from "~/lib/generateVariableNames/generateMetricReadableId";
import { useAppDispatch, useAppSelector } from "~/modules/hooks";
import { changeMetric } from "~/modules/metrics/actions";
import { changeGuesstimate } from "~/modules/guesstimates/actions";
import { Icon } from "./Icon";
import { FieldHelp } from "./FieldHelp";
import { NodeNotes } from "./NodeNotes";
import { ResultDetails } from "./ResultDetails";
import styles from "./workspace.module.css";

export const formatNumber = (n: number) =>
  Number.isFinite(n)
    ? new Intl.NumberFormat("en", { maximumSignificantDigits: 4 }).format(n)
    : "—";

export function NodeInspector({
  metric,
  metrics,
  onClose,
  onSelect,
  onDelete,
  resizeHandle,
  onAdvance,
  focusFormula = false,
  canUseOrganizationFacts = false,
}: {
  metric: FullDenormalizedMetric;
  metrics: FullDenormalizedMetric[];
  onClose(): void;
  onSelect(id: string): void;
  onDelete(): void;
  resizeHandle: ReactNode;
  onAdvance?(direction: "down" | "right"): void;
  focusFormula?: boolean;
  canUseOrganizationFacts?: boolean;
}) {
  const formulaRef = useRef<{ focus(): void } | null>(null);
  useEffect(() => {
    if (focusFormula) formulaRef.current?.focus();
  }, [focusFormula]);
  const dispatch = useAppDispatch();
  const clickMode = useAppSelector(
    (state) => state.canvasState.metricClickMode
  );
  const [name, setName] = useState(metric.name || "");
  useEffect(() => setName(metric.name || ""), [metric.name]);
  const advance = (direction: "down" | "right") => {
    dispatch(changeGuesstimate(metric.id, {}));
    onAdvance?.(direction);
  };
  const stats = metric.simulation?.stats;
  const referenceExamples = metrics
    .filter((candidate) => candidate.id !== metric.id)
    .slice(0, 2)
    .map((candidate) => candidate.readableId);
  const formulaExample = referenceExamples.length
    ? `= ${referenceExamples.join(" * ")}`
    : "= 2 * 3";
  const saveName = () => {
    if (name !== (metric.name || ""))
      dispatch(
        changeMetric(
          withReadableId(
            { id: metric.id, name },
            metrics.filter((m) => m.id !== metric.id).map((m) => m.readableId)
          )
        )
      );
  };
  return (
    <aside
      id="node-details-panel"
      className={styles.inspector}
      aria-label="Node details"
    >
      {resizeHandle}
      <div className={styles.panelHeading}>
        <h2>Node details</h2>
        <button
          type="button"
          className={styles.iconButton}
          aria-label="Close node details"
          onClick={onClose}
        >
          <Icon name="close" />
        </button>
      </div>
      <div className={styles.panelBody}>
        <label className={styles.field}>
          Name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={saveName}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.blur();
            }}
            placeholder="Name this node"
          />
        </label>
        <div className={styles.variableLine}>
          Reference <code>{metric.readableId}</code>
        </div>
        <section
          className={styles.editorSection}
          aria-labelledby="expression-label"
        >
          <div className={styles.fieldHeading}>
            <h3 id="expression-label">Input</h3>
            <FieldHelp>
              <p>
                A number, a range like <code>40 to 60</code>, or a formula like{" "}
                <code>{formulaExample}</code>.
                {referenceExamples.length > 0 && (
                  <>
                    {" "}
                    Use the reference IDs shown on nodes, or type <code>
                      =
                    </code>{" "}
                    and click a node to insert its reference.
                  </>
                )}
              </p>
              {metric.guesstimate.data && (
                <p>
                  Entering a formula replaces this node’s data. Undo restores
                  it.
                </p>
              )}
            </FieldHelp>
          </div>
          <DistributionEditor
            ref={formulaRef}
            onReturn={onAdvance ? () => advance("down") : undefined}
            onTab={onAdvance ? () => advance("right") : undefined}
            size="large"
            metricId={metric.id}
            guesstimate={metric.guesstimate}
            metricClickMode={clickMode}
            inputMetrics={metric.edges.inputMetrics}
            canUseOrganizationFacts={canUseOrganizationFacts}
          />
        </section>
        {stats && (
          <section
            className={styles.resultSection}
            aria-label="Calculated result"
          >
            <div className={styles.notesHeading}>
              <h3>Result</h3>
              {metric.simulation && stats.length > 1 && (
                <ResultDetails
                  key={metric.id}
                  name={metric.name || metric.readableId}
                  simulation={metric.simulation}
                  formatValue={formatNumber}
                />
              )}
            </div>
            <p className={styles.inspectorResult}>{formatNumber(stats.mean)}</p>
            {stats.length > 1 && (
              <>
                <div className={styles.detailChart}>
                  <SimulationHistogram
                    simulation={metric.simulation}
                    cutOffRatio={0.05}
                    showTicks={false}
                  />
                </div>
                <p className={styles.fieldHint}>
                  Mean of the simulated results.
                </p>
              </>
            )}
            {stats.percentiles && (
              <dl className={styles.statistics}>
                <div>
                  <dt>5th percentile</dt>
                  <dd>{formatNumber(stats.percentiles[5])}</dd>
                </div>
                <div>
                  <dt>95th percentile</dt>
                  <dd>{formatNumber(stats.percentiles[95])}</dd>
                </div>
              </dl>
            )}
          </section>
        )}
        {!!metric.edges.inputs.length && (
          <section className={styles.dependencies}>
            <h3>Uses</h3>
            {metric.edges.inputs.map((id) => {
              const input = metrics.find((m) => m.id === id);
              return (
                input && (
                  <button key={id} type="button" onClick={() => onSelect(id)}>
                    <span>{input.name || input.readableId}</span>
                    <code>{input.readableId}</code>
                    <Icon name="arrow" />
                  </button>
                )
              );
            })}
          </section>
        )}
        <NodeNotes
          value={metric.guesstimate.description || ""}
          onSave={(description) =>
            dispatch(changeGuesstimate(metric.id, { description }))
          }
        />
        {!!metric.name?.trim() &&
          !metric.guesstimate.input?.trim() &&
          !metric.guesstimate.data?.length &&
          !!metric.guesstimate.description?.trim() && (
            <div className={styles.notesDisplaySetting}>
              <span>Show notes on node</span>
              <button
                type="button"
                role="switch"
                aria-label="Show notes on node"
                aria-checked={metric.showNotesOnNode !== false}
                className={styles.notesDisplaySwitch}
                onClick={() =>
                  dispatch(
                    changeMetric({
                      id: metric.id,
                      showNotesOnNode: metric.showNotesOnNode === false,
                    })
                  )
                }
              >
                <span aria-hidden="true" />
              </button>
            </div>
          )}
        <button
          className={styles.deleteButton}
          type="button"
          onClick={onDelete}
        >
          <Icon name="trash" />
          Delete node
        </button>
      </div>
    </aside>
  );
}
