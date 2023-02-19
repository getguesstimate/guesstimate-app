import { useRouter } from "next/router";
import React from "react";

import Icon from "~/components/react-fa-patched";

import { PrecisionNumber } from "~/components/distributions/DistributionSummary/index";
import { SimulationHistogram } from "~/components/simulations/SimulationHistogram";
import { Fact, isExportedFromSpace } from "~/lib/engine/facts";
import { spaceUrlById } from "~/lib/engine/space";

import { Button } from "~/components/utility/buttons/button";

type Props = {
  fact: Fact;
  onEdit?(): void;
  isExportedFromSelectedSpace?: boolean;
};

export const SmallFactItem: React.FC<{ fact: Fact }> = ({ fact }) => {
  return (
    <div className="border border-transparent hover:border-[#d9dee2]">
      <div className="bg-white h-full relative">
        <div className="z-10 p-1 h-full flex flex-col justify-between gap-2">
          <div className="break-words">
            <div className="text-grey-333 leading-none text-sm">
              {fact.name}
            </div>
          </div>
          {fact.simulation.stats.mean !== undefined && (
            <div className="text-[#607580] leading-none">
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
  const router = useRouter();

  const exported_from_url = spaceUrlById(fact.exported_from_id, {
    factsShown: "true",
  });
  return (
    <div className="flex group">
      <div className="relative min-w-[6em]">
        <div className="simulation-summary mt-1 ml-1 relative z-10">
          {fact.simulation.stats.mean !== undefined && (
            <div className="text-xl text-[#607580] leading-none">
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
      <div className="break-words mt-1 flex-1">
        <div className="text-grey-333 leading-none">{fact.name}</div>
        <div className="text-grey-999 group-hover:text-grey-444 transition-colors ml-0.5 text-sm">
          <span className="mr-[1px]">#</span>
          {fact.variable_name}
        </div>
      </div>

      <div className="flex">
        <div className="self-center hidden group-hover:block mr-2">
          <Button size="small" onClick={onEdit || (() => {})}>
            Edit
          </Button>
        </div>

        {isExportedFromSpace(fact) && (
          <div
            className="group/icon self-stretch px-2 grid place-items-center cursor-pointer bg-grey-eee hover:bg-grey-ccc transition-colors"
            onClick={() => {
              !isExportedFromSelectedSpace && router.push(exported_from_url);
            }}
          >
            {!isExportedFromSelectedSpace && (
              <Icon
                name="share"
                className="text-blue-5 group-hover/icon:text-blue-4"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
