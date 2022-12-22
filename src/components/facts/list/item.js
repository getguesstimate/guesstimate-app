import React from "react";
import { useRouter } from "next/router";

import Icon from "gComponents/react-fa-patched";

import { DistributionSummary } from "gComponents/distributions/summary/index";
import Histogram from "gComponents/simulations/histogram/index";
import {
  adjustedConfidenceInterval,
  isExportedFromSpace,
  length,
  mean,
} from "gEngine/facts";
import { spaceUrlById } from "gEngine/space";

import { allPropsPresent } from "gEngine/utils";

export const FactItem = ({
  fact,
  onEdit,
  isExportedFromSelectedSpace,
  size,
}) => {
  const router = useRouter();

  const exported_from_url = spaceUrlById(_.get(fact, "exported_from_id"), {
    factsShown: "true",
  });
  return (
    <div className={`Fact--outer ${size}`}>
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
                <Histogram
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

        {!!isExportedFromSpace(fact) && size !== "SMALL" && (
          <div
            className="section-exported"
            onClick={
              !isExportedFromSelectedSpace && router.push(exported_from_url)
            }
          >
            {!isExportedFromSelectedSpace && <Icon name="share" />}
          </div>
        )}
      </div>
    </div>
  );
};
