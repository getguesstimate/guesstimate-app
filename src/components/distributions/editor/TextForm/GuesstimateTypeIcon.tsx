import React from "react";

import Icon from "~/components/react-fa-patched";

import { Guesstimator } from "~/lib/guesstimator/index";

import * as elev from "~/server/elev/index";

type Props = {
  guesstimateType: string;
  toggleDistributionSelector(): void;
};

export const GuesstimateTypeIcon: React.FC<Props> = ({
  guesstimateType,
  toggleDistributionSelector,
}) => {
  const { isRangeDistribution, icon } =
    Guesstimator.samplerTypes.find(guesstimateType);
  if (!!icon) {
    let className = "DistributionSelectorToggle DistributionIcon";
    className += isRangeDistribution ? " button" : "";
    return (
      <div
        className={className}
        onMouseDown={
          isRangeDistribution ? toggleDistributionSelector : undefined
        }
      >
        <img src={icon} />
      </div>
    );
  } else {
    return (
      <div
        className="GuesstimateTypeQuestion"
        onMouseDown={() => {
          elev.open(elev.GUESSTIMATE_TYPES);
        }}
      >
        <Icon name="question-circle" />
      </div>
    );
  }
};
