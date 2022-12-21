import React from "react";

import Icon from "react-fa";

import { Guesstimator } from "lib/guesstimator/index";

import * as elev from "servers/elev/index";

export const GuesstimateTypeIcon = ({
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
        onMouseDown={isRangeDistribution && toggleDistributionSelector}
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
