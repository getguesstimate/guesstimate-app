import clsx from "clsx";
import React from "react";

import Icon from "~/components/react-fa-patched";

import { Guesstimator } from "~/lib/guesstimator/index";
import { DistributionType } from "~/lib/guesstimator/types";

import * as elev from "~/server/elev/index";
import { DistributionIcon } from "./DistributionSelector";

type Props = {
  guesstimateType: DistributionType;
  toggleDistributionSelector(): void;
  size: "large" | "small";
};

export const GuesstimateTypeIcon: React.FC<Props> = ({
  guesstimateType,
  toggleDistributionSelector,
  size,
}) => {
  const samplerType = Guesstimator.samplerTypes.find(guesstimateType);
  if (samplerType.icon) {
    return (
      <DistributionIcon
        type={guesstimateType}
        size={size}
        isDisabled={!samplerType.isRangeDistribution}
        onClick={toggleDistributionSelector}
        theme="current"
      />
    );
  } else {
    return (
      <div
        className={clsx(
          "mr-1.5 cursor-pointer text-grey-2 opacity-60 hover:opacity-100",
          size === "large" ? "text-3xl" : "text-xl"
        )}
        onMouseDown={() => {
          elev.open(elev.GUESSTIMATE_TYPES);
        }}
      >
        <Icon name="question-circle" />
      </div>
    );
  }
};
