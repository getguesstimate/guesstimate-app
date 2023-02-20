import React from "react";

import { Guesstimator } from "~/lib/guesstimator/index";

import { ToolTip } from "~/components/utility/ToolTip";
import * as elev from "~/server/elev/index";
import clsx from "clsx";
import { DistributionType } from "~/lib/guesstimator/types";
import { HR } from "~/components/utility/HR";

export const DistributionIcon: React.FC<{
  type: DistributionType;
  onClick(): void;
  size: "small" | "large";
  isDisabled?: boolean;
  theme: "current" | "choice-selected" | "choice";
}> = ({ type, onClick, size, theme, isDisabled }) => {
  const samplerType = Guesstimator.samplerTypes.find(type);
  if (!samplerType) {
    return null;
  }
  const icon = samplerType.icon;

  return (
    <ToolTip id={type} text={samplerType.displayName} withPortal={true}>
      <div
        className={clsx(
          "cursor-pointer rounded grid place-items-center",
          size === "small" && "w-6 h-6",
          size === "large" && "w-9 h-9",
          theme === "current" &&
            "opacity-60 hover:opacity-100 hover:bg-grey-ccc",
          theme === "choice" && "bg-grey-1",
          theme === "choice-selected" && "bg-blue-2",
          isDisabled && "cursor-default pointer-events-none opacity-50"
        )}
        onClick={onClick}
      >
        {icon ? <img src={icon} /> : undefined}
      </div>
    </ToolTip>
  );
};

export const DistributionSelector: React.FC<{
  selected: string;
  onSubmit(type: DistributionType): void;
  disabledTypes: DistributionType[];
  size: "small" | "large";
}> = ({ selected, onSubmit, disabledTypes = [], size }) => {
  const handleShowMore = () => {
    elev.open(elev.ADDITIONAL_DISTRIBUTIONS);
  };

  const allTypes: DistributionType[] = ["LOGNORMAL", "NORMAL", "UNIFORM"];
  return (
    <div className="mt-1">
      <HR />
      <div className="mt-1 flex justify-between">
        <a
          className="px-0.5 text-[16px] text-grey-999 hover:text-grey-666"
          href=""
          onClick={handleShowMore}
        >
          More
        </a>
        <div className="flex gap-1">
          {allTypes.map((type) => (
            <DistributionIcon
              type={type}
              onClick={() => onSubmit(type)}
              size={size}
              theme={selected === type ? "choice-selected" : "choice"}
              isDisabled={disabledTypes.includes(type)}
              key={type}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
