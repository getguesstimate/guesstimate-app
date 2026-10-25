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
      <button
        type="button"
        aria-label={
          theme === "current"
            ? `Change distribution (${samplerType.displayName})`
            : samplerType.displayName
        }
        aria-pressed={
          theme === "current" ? undefined : theme === "choice-selected"
        }
        disabled={isDisabled}
        className={clsx(
          "grid cursor-pointer place-items-center rounded",
          size === "small" && "h-6 w-6",
          size === "large" && "h-9 w-9",
          theme === "current" &&
            "opacity-60 hover:bg-surface-hover hover:opacity-100",
          theme === "choice" && "bg-grey-1",
          theme === "choice-selected" && "bg-blue-2",
          isDisabled && "pointer-events-none cursor-default opacity-50"
        )}
        onClick={onClick}
      >
        {icon ? <img src={icon} alt="" /> : undefined}
      </button>
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
        <button
          type="button"
          className="px-0.5 text-[16px] text-grey-999 hover:text-grey-666"
          onClick={handleShowMore}
        >
          More
        </button>
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
