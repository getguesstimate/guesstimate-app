import { useRef, useState } from "react";
import Modal from "react-modal";
import { bisectRight, ScaleLinear } from "d3";
import { Simulation } from "~/modules/simulations/reducer";
import { SimulationHistogram } from "~/components/simulations/SimulationHistogram";
import { percentile } from "~/lib/dataAnalysis";
import { FieldHelp } from "./FieldHelp";
import { Icon } from "./Icon";
import styles from "./workspace.module.css";

const percentiles = [1, 5, 50, 95, 99];

export function ResultDetails({
  name,
  simulation,
  formatValue,
}: {
  name: string;
  simulation: Simulation;
  formatValue(value: number): string;
}) {
  const [open, setOpen] = useState(false);
  const [inspection, setInspection] = useState<{
    value: number;
    percent: number;
  } | null>(null);
  const histogram = useRef<{ xScale: ScaleLinear<number, number> }>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const values = simulation.sample.sortedValues || [];
  const atPercentile = (percent: number) =>
    percent === 100
      ? values[values.length - 1]
      : percentile(values, values.length, percent);
  const current = inspection || { value: atPercentile(50), percent: 50 };
  const choose = (percent: number) =>
    setInspection({ value: atPercentile(percent), percent });
  const inspectAt = (clientX: number, element: HTMLDivElement) => {
    const scale = histogram.current?.xScale;
    if (!scale || !values.length) return;
    const rect = element.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const value = Math.max(
      values[0],
      Math.min(values[values.length - 1], scale.invert(x))
    );
    setInspection({
      value,
      percent: (bisectRight(values, value) / values.length) * 100,
    });
  };
  return (
    <>
      <button
        type="button"
        className={styles.iconButton}
        aria-label="Expand result"
        title="Explore chart and percentiles"
        aria-haspopup="dialog"
        onClick={() => {
          setInspection(null);
          setOpen(true);
        }}
        disabled={!values.length}
      >
        <Icon name="expand" />
      </button>
      <Modal
        isOpen={open}
        onRequestClose={() => setOpen(false)}
        onAfterOpen={() => closeButton.current?.focus()}
        appElement={
          typeof document !== "undefined"
            ? document.getElementById("__next") || undefined
            : undefined
        }
        aria={{ labelledby: "result-dialog-title" }}
        className={`${styles.noteDialog} ${styles.resultDialog}`}
        overlayClassName={styles.noteOverlay}
      >
        <div className={styles.noteDialogHeading}>
          <div>
            <h2 id="result-dialog-title">Result details</h2>
            <p className={styles.resultNodeName}>{name}</p>
          </div>
          <button
            ref={closeButton}
            type="button"
            className={styles.iconButton}
            aria-label="Close result details"
            onClick={() => setOpen(false)}
          >
            <Icon name="close" />
          </button>
        </div>
        <div className={styles.resultDetailsGrid}>
          <section
            className={styles.resultPlotSection}
            aria-label="Result distribution"
          >
            <div className={styles.resultReadout}>
              <div>
                <span>Value</span>
                <strong>{formatValue(current.value)}</strong>
              </div>
              <div>
                <span>Percentile</span>
                <strong>{formatValue(current.percent)}%</strong>
              </div>
            </div>
            <div
              className={styles.resultPlot}
              aria-label="Result histogram; hover or tap to inspect"
              onPointerDown={(event) =>
                inspectAt(event.clientX, event.currentTarget)
              }
              onPointerMove={(event) => {
                if (event.pointerType === "mouse" || event.buttons)
                  inspectAt(event.clientX, event.currentTarget);
              }}
            >
              <SimulationHistogram
                ref={histogram}
                simulation={simulation}
                bins={60}
                cutOffRatio={0}
                showTicks
                tickCount={5}
                allowHover
                hoveredXCoord={histogram.current?.xScale(current.value)}
              />
            </div>
            <label className={styles.percentileSlider}>
              <span>
                Explore percentile{" "}
                <output>{Math.round(current.percent)}%</output>
              </span>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={Math.round(current.percent)}
                onChange={(event) => choose(Number(event.target.value))}
                aria-label="Explore percentile"
                aria-valuetext={`${Math.round(
                  current.percent
                )} percent: ${formatValue(current.value)}`}
              />
            </label>
          </section>
          <section className={styles.percentileSection}>
            <div className={styles.fieldHeading}>
              <h3>Percentiles</h3>
              <FieldHelp label="Help with percentiles">
                <p>
                  The 5th percentile is a value with about 5% of results below
                  it. The 5th to 95th percentiles cover the middle 90% of
                  results. The 50th is the median.
                </p>
                <p>
                  Hover or tap the chart to inspect it. Use the slider or its
                  arrow keys to explore any percentile. Repeated values can
                  share the same result.
                </p>
              </FieldHelp>
            </div>
            <table className={styles.percentileTable}>
              <thead>
                <tr>
                  <th scope="col">Percentile</th>
                  <th scope="col">Value</th>
                </tr>
              </thead>
              <tbody>
                {percentiles.map((percent) => (
                  <tr key={percent}>
                    <th scope="row">
                      <button type="button" onClick={() => choose(percent)}>
                        {percent}%{percent === 50 ? " · Median" : ""}
                      </button>
                    </th>
                    <td>{formatValue(atPercentile(percent))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <dl className={styles.statistics}>
              <div>
                <dt>Average</dt>
                <dd>{formatValue(simulation.stats?.mean)}</dd>
              </div>
              <div>
                <dt>Samples</dt>
                <dd>{values.length.toLocaleString("en")}</dd>
              </div>
            </dl>
          </section>
        </div>
      </Modal>
    </>
  );
}
