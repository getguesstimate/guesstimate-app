import React from "react";

import { Guesstimator } from "~/lib/guesstimator/index";

import { getClassName } from "~/lib/engine/utils";

import { ToolTip } from "~/components/utility/ToolTip";
import * as elev from "~/server/elev/index";

type DistributionType = "LOGNORMAL" | "NORMAL" | "UNIFORM";

const Descriptions: { [k in DistributionType]: { name: string } } = {
  LOGNORMAL: {
    name: "Lognormal",
  },
  NORMAL: {
    name: "Normal",
  },
  UNIFORM: {
    name: "Uniform",
  },
};

const DistributionIcon: React.FC<{
  isSelected: boolean;
  isDisabled: boolean;
  type: DistributionType;
  icon?: string;
  onSubmit(type: DistributionType): void;
}> = ({ isSelected, isDisabled, type, icon, onSubmit }) => (
  <ToolTip id={type} text={Descriptions[type].name} withPortal={true}>
    <div
      className={getClassName(
        "ui",
        "button",
        "DistributionIcon",
        isSelected && "selected",
        isDisabled && "disabled"
      )}
      onClick={() => onSubmit(type)}
    >
      {icon ? <img src={icon} /> : undefined}
    </div>
  </ToolTip>
);

export const DistributionSelector: React.FC<{
  selected: string;
  onSubmit(type: DistributionType): void;
  disabledTypes: DistributionType[];
}> = ({ selected, onSubmit, disabledTypes = [] }) => {
  const handleShowMore = () => {
    elev.open(elev.ADDITIONAL_DISTRIBUTIONS);
  };

  const allTypes: DistributionType[] = ["LOGNORMAL", "NORMAL", "UNIFORM"];
  return (
    <div className="DistributionSelector">
      <hr />
      <div className="flex justify-between">
        <a
          className="px-0.5 text-[16px] text-grey-999 hover:text-grey-666"
          href=""
          onClick={handleShowMore}
        >
          More
        </a>
        <div className="flex">
          {allTypes.map((type) => (
            <DistributionIcon
              type={type}
              onSubmit={onSubmit}
              isSelected={selected === type}
              isDisabled={disabledTypes.includes(type)}
              icon={Guesstimator.samplerTypes.find(type).icon}
              key={type}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
