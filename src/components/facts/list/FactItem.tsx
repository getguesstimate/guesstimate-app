import _ from "lodash";
import React from "react";
import { useRouter } from "next/router";

import Icon from "~/components/react-fa-patched";

import { DistributionSummary } from "~/components/distributions/summary/index";
import { SimulationHistogram } from "~/components/simulations/SimulationHistogram";
import {
  adjustedConfidenceInterval,
  Fact,
  isExportedFromSpace,
  length,
  mean,
} from "~/lib/engine/facts";
import { spaceUrlById } from "~/lib/engine/space";

import { allPropsPresent } from "~/lib/engine/utils";
import clsx from "clsx";

type Props = {
  fact: Fact;
  onEdit?(): void;
  isExportedFromSelectedSpace?: boolean;
  size: string;
};

export const FactItem: React.FC<Props> = ({
  fact,
  onEdit,
  isExportedFromSelectedSpace,
  size,
}) => {
  const router = useRouter();

  const exported_from_url = spaceUrlById(fact.exported_from_id, {
    factsShown: "true",
  });
  return (
    <div className={clsx("Fact--outer", size)}>
      <div className="Fact">
        <div className="section-simulation simulation-sample">
          {allPropsPresent(
            fact,
            "simulation.sample.values.length",
            "simulation.stats.mean"
          ) && (
            <div>
              <div className="simulation-summary">
                <DistributionSummary
                  length={length(fact)}
                  mean={mean(fact)}
                  adjustedConfidenceInterval={adjustedConfidenceInterval(fact)}
                  precision={4}
                />
              </div>
              <div className="histogram">
                <SimulationHistogram
                  height={15}
                  simulation={fact.simulation}
                  cutOffRatio={0.995}
                />
              </div>
            </div>
          )}
        </div>
        <div className="section-name">
          <span className="fact-name">{fact.name}</span>
          {size !== "SMALL" && (
            <div className="variable-name variable-token">
              <span className="prefix">#</span>
              <div className="name">{fact.variable_name}</div>
            </div>
          )}
        </div>

        {size !== "SMALL" && (
          <div className="section-help">
            <span className="ui button small options" onClick={onEdit}>
              Edit
            </span>
          </div>
        )}

        {isExportedFromSpace(fact) && size !== "SMALL" && (
          <div
            className="section-exported"
            onClick={() => {
              !isExportedFromSelectedSpace && router.push(exported_from_url);
            }}
          >
            {!isExportedFromSelectedSpace && <Icon name="share" />}
          </div>
        )}
      </div>
    </div>
  );
};
