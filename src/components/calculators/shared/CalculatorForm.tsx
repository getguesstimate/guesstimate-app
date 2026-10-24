import { ChangeEvent, FC, useState } from "react";
import ReactMarkdown from "react-markdown";
import { FieldHelp } from "~/components/workspace/FieldHelp";
import styles from "../calculator.module.css";

import { FullDenormalizedMetric } from "~/lib/engine/space";
import { Optional } from "~/lib/engine/types";
import { Calculator } from "~/modules/calculators/reducer";

type CalculatorParam = { metric: FullDenormalizedMetric; isVisible: boolean };
type Props = {
  calculator: Optional<Calculator, "id">;
  inputs: CalculatorParam[];
  outputs: CalculatorParam[];
  onMetricHide(id: string): void;
  onMetricShow(id: string): void;
  onMoveMetricTo(id: string, destIndex: number): void;
  onChangeName(e: ChangeEvent): void;
  onChangeContent(e: ChangeEvent): void;
  onSubmit(): Promise<void>;
  isValid: boolean;
  buttonText: string;
};

export const CalculatorForm: FC<Props> = (props) => {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const renderParams = (label: string, params: CalculatorParam[]) => {
    const visible = params.filter((p) => p.isVisible);
    return (
      <section aria-label={`Calculator ${label.toLowerCase()}`}>
        <div className={styles.sectionHeading}>
          <h3>{label}</h3>
          <FieldHelp label={`Help with calculator ${label.toLowerCase()}`}>
            <p>
              {label === "Inputs"
                ? "Inputs are named values used by other nodes, with no dependencies of their own."
                : "Outputs are named formulas that depend on other nodes. Intermediate results can also be included."}
            </p>
            <p>
              Only nodes with a name and a value or formula appear. Unnamed,
              empty, and disconnected nodes are excluded. Add or edit nodes in
              the model first.
            </p>
            <p>
              Select the fields to include. Use the arrows to change their
              order.
            </p>
          </FieldHelp>
          <span className={styles.count}>{visible.length} selected</span>
        </div>
        {params.length ? (
          <div className={styles.rows}>
            {params.map(({ metric, isVisible }) => {
              const index = visible.findIndex((p) => p.metric.id === metric.id);
              const name = metric.name || metric.readableId;
              return (
                <div key={metric.id} className={styles.row}>
                  <label>
                    <input
                      type="checkbox"
                      checked={isVisible}
                      disabled={busy}
                      onChange={() =>
                        isVisible
                          ? props.onMetricHide(metric.id)
                          : props.onMetricShow(metric.id)
                      }
                    />
                    <span>{name}</span>
                  </label>
                  {label === "Inputs" && metric.guesstimate.description && (
                    <FieldHelp label={`Notes for ${name}`}>
                      <ReactMarkdown
                        source={metric.guesstimate.description}
                        skipHtml
                      />
                    </FieldHelp>
                  )}
                  {isVisible && (
                    <div className={styles.order}>
                      <button
                        type="button"
                        aria-label={`Move ${name} up`}
                        disabled={busy || index === 0}
                        onClick={() =>
                          props.onMoveMetricTo(metric.id, index - 1)
                        }
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        aria-label={`Move ${name} down`}
                        disabled={busy || index === visible.length - 1}
                        onClick={() =>
                          props.onMoveMetricTo(metric.id, index + 1)
                        }
                      >
                        ↓
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className={styles.empty}>
            No eligible {label.toLowerCase()}. Nodes need a name, a value or
            formula, and a connection to another node.
          </p>
        )}
      </section>
    );
  };
  return (
    <form
      className={`${styles.surface} ${styles.form}`}
      onSubmit={async (event) => {
        event.preventDefault();
        if (busy || !props.isValid) return;
        setBusy(true);
        setError("");
        try {
          await props.onSubmit();
        } catch {
          setError(
            "Couldn’t save the calculator. Your changes are still here; try again."
          );
        } finally {
          setBusy(false);
        }
      }}
    >
      <label className={styles.field}>
        Name
        <input
          aria-label="Calculator name"
          value={props.calculator.title || ""}
          onChange={props.onChangeName}
          disabled={busy}
        />
      </label>
      <label className={styles.field}>
        Description
        <textarea
          aria-label="Calculator description"
          rows={3}
          value={props.calculator.content || ""}
          onChange={props.onChangeContent}
          disabled={busy}
        />
      </label>
      {renderParams("Inputs", props.inputs)}
      {renderParams("Outputs", props.outputs)}
      {error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}
      <div className={styles.footer}>
        {!props.isValid && (
          <span className={styles.hint}>
            Enter a name and select at least one input and output.
          </span>
        )}
        <button
          type="submit"
          className={styles.primary}
          disabled={!props.isValid || busy}
        >
          {busy ? "Saving…" : props.buttonText}
        </button>
      </div>
    </form>
  );
};
