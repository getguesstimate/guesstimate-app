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
      <div className="relative h-full bg-white">
        <div className="z-10 flex h-full flex-col justify-between gap-2 p-1">
          <div className="break-words">
            <div className="text-sm leading-none text-grey-333">
              {fact.name}
            </div>
          </div>
          {fact.simulation.stats.mean !== undefined && (
            <div className="leading-none text-[#607580]">
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
    <div className="group flex">
      <div className="relative min-w-[6em]">
        <div className="simulation-summary relative z-10 mt-1 ml-1">
          {fact.simulation.stats.mean !== undefined && (
            <div className="text-xl leading-none text-[#607580]">
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
      <div className="mt-1 flex-1 break-words">
        <div className="leading-none text-grey-333">{fact.name}</div>
        <div className="ml-0.5 text-sm text-grey-999 transition-colors group-hover:text-grey-444">
          <span className="mr-[1px]">#</span>
          {fact.variable_name}
        </div>
      </div>

      <div className="flex">
        <div className="mr-2 hidden self-center group-hover:block">
          <Button size="small" onClick={onEdit || (() => {})}>
            Edit
          </Button>
        </div>

        {isExportedFromSpace(fact) && (
          <div
            className="group/icon grid cursor-pointer place-items-center self-stretch bg-grey-eee px-2 transition-colors hover:bg-grey-ccc"
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
