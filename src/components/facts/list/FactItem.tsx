import React from "react";

import { Icon } from "~/components/workspace/Icon";
import styles from "./metrics.module.css";

import { PrecisionNumber } from "~/components/distributions/DistributionSummary/index";
import { SimulationHistogram } from "~/components/simulations/SimulationHistogram";
import { Fact, isExportedFromSpace } from "~/lib/engine/facts";
import { spaceUrlById } from "~/lib/engine/space";

type Props = {
  fact: Fact;
  onEdit?(): void;
  isExportedFromSelectedSpace?: boolean;
};

export const SmallFactItem: React.FC<{ fact: Fact }> = ({ fact }) => {
  return (
    <div className="border border-transparent hover:border-border">
      <div className="relative h-full bg-white">
        <div className="relative z-10 flex h-full flex-col justify-between gap-2 p-1">
          <div className="break-words">
            <div className="text-sm leading-none text-grey-333">
              {fact.name}
            </div>
          </div>
          {fact.simulation.stats.mean !== undefined && (
            <div className="leading-none text-ink-muted">
              <PrecisionNumber
                value={fact.simulation.stats.mean}
                precision={4}
              />
            </div>
          )}
        </div>
        <div className="absolute inset-x-0 bottom-0 h-4">
          <SimulationHistogram
            simulation={fact.simulation}
            cutOffRatio={0.995}
            theme="light"
          />
        </div>
      </div>
    </div>
  );
};

export const FactItem: React.FC<Props> = ({
  fact,
  onEdit,
  isExportedFromSelectedSpace,
}) => {
  const sourceUrl = spaceUrlById(fact.exported_from_id, { factsShown: "true" });
  return (
    <div className={styles.row}>
      <div className={styles.identity}>
        <div className={styles.name}>{fact.name}</div>
        <div className={styles.variable}>#{fact.variable_name}</div>
      </div>
      <div className={styles.result}>
        <span>
          {fact.simulation.stats.mean !== undefined ? (
            <PrecisionNumber value={fact.simulation.stats.mean} precision={4} />
          ) : (
            "—"
          )}
        </span>
        {fact.simulation.sample.values.length > 1 && (
          <div className={styles.histogram}>
            <SimulationHistogram
              simulation={fact.simulation}
              cutOffRatio={0.995}
              theme="light"
            />
          </div>
        )}
      </div>
      <div className={styles.rowActions}>
        {onEdit && (
          <button
            type="button"
            className={styles.iconButton}
            onClick={onEdit}
            aria-label={`Edit ${fact.name || fact.variable_name}`}
            title="Edit metric"
          >
            <Icon name="edit" />
          </button>
        )}
        {isExportedFromSpace(fact) && !isExportedFromSelectedSpace && (
          <a
            className={styles.iconButton}
            href={sourceUrl}
            aria-label={`Open source model for ${
              fact.name || fact.variable_name
            }`}
            title="Open source model"
          >
            <Icon name="arrow" />
          </a>
        )}
      </div>
    </div>
  );
};
