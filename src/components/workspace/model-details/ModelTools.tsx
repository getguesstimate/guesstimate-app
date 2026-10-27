import type { ExtendedDSpace } from "~/components/spaces/denormalized-space-selector";
import { FieldHelp } from "../FieldHelp";
import { Icon } from "../Icon";
import styles from "../workspace.module.css";
import type { ComponentProps } from "react";
import type { RightSidebar } from "~/components/spaces/SpaceShow/RightSidebar";
import * as engine from "~/lib/engine/engine";
type Props = {
  space: ExtendedDSpace;
  toolDispatch: ComponentProps<typeof RightSidebar>["rightSidebarDispatch"];
};
export function ModelTools({ space, toolDispatch }: Props) {
  return (
    <div className={styles.modelToolSections}>
      <section
        className={styles.modelSection}
        aria-labelledby="model-calculators-heading"
      >
        <div className={styles.fieldHeading}>
          <h3 id="model-calculators-heading">Calculators</h3>
          <FieldHelp label="Help with calculators">
            <p>
              A calculator presents selected model inputs and results as a form.
              The model must contain named values and formulas connected to each
              other.
            </p>
          </FieldHelp>
        </div>
        {space.editableByMe && (
          <button
            type="button"
            className={styles.newCalculator}
            onClick={() => toolDispatch({ type: "MAKE_NEW_CALCULATOR" })}
          >
            <Icon name="plus" />
            New calculator
          </button>
        )}
        <div className={styles.modelToolList}>
          {space.calculators?.map((calculator) => (
            <button
              type="button"
              key={calculator.id}
              className={styles.noteAction}
              onClick={() =>
                toolDispatch({
                  type: "SHOW_CALCULATOR",
                  payload: calculator,
                })
              }
            >
              {calculator.title || "Calculator"}
            </button>
          ))}
        </div>
        {!space.calculators?.length && !space.editableByMe && (
          <p className={styles.fieldHint}>
            No calculators available for this model.
          </p>
        )}
      </section>
      {engine.space.canUseOrganizationFacts(space) && (
        <section
          className={styles.modelSection}
          aria-labelledby="model-metrics-heading"
        >
          <h3 id="model-metrics-heading">Metrics</h3>
          <div className={styles.modelToolList}>
            <button
              type="button"
              className={styles.noteAction}
              onClick={() => toolDispatch({ type: "TOGGLE_FACTS" })}
            >
              Metric Library
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
