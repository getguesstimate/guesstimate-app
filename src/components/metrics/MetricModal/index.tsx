import _ from "lodash";
import React from "react";

import { DistributionEditor } from "~/components/distributions/DistributionEditor/index";
import { HistogramWithStats } from "~/components/simulations/HistogramWithStats";
import { ButtonClose } from "~/components/utility/buttons/close";
import { DropDown } from "~/components/utility/DropDown";
import { GeneralModal } from "~/components/utility/GeneralModal";
import { GuesstimateDescription } from "./GuesstimateDescription";

import { FullDenormalizedMetric } from "~/lib/engine/space";
import { SAMPLE_FILTERED } from "~/lib/guesstimator/samplers/simulator-worker/simulator/filters/filters";
import { MetricClickMode } from "~/modules/canvas_state/reducer";
import { SampleValue } from "~/lib/guesstimator/samplers/Simulator";
import { Button } from "~/components/utility/buttons/button";

const SampleList: React.FC<{ samples: SampleValue[] | undefined }> = ({
  samples,
}) => (
  <ul className="max-h-96 overflow-scroll rounded bg-grey-eee !p-2">
    {samples?.map(
      (element, index) =>
        !_.isEqual(element, SAMPLE_FILTERED) && (
          <li key={index}>
            <div key={index}>{element as number}</div>
          </li>
        )
    )}
  </ul>
);

type Props = {
  metric: FullDenormalizedMetric;
  closeModal(): void;
  organizationId: string | number | undefined;
  canUseOrganizationFacts: boolean;
  metricClickMode: MetricClickMode;
  onChangeGuesstimateDescription(value: string): void;
};

// Note: Controlled inputs don't pass through very well. Try to keep them in child connects().
export const MetricModal: React.FC<Props> = ({
  metric,
  closeModal,
  organizationId,
  canUseOrganizationFacts,
  metricClickMode,
  onChangeGuesstimateDescription,
}) => {
  const getShowSimulation = () => {
    const stats = _.get(metric.simulation, "stats");
    if (
      stats &&
      _.isFinite(stats.mean) &&
      _.isFinite(stats.stdev) &&
      _.isFinite(stats.length)
    ) {
      return stats.stdev === 0 || stats.length > 5;
    } else {
      return false;
    }
  };

  const showSimulation = getShowSimulation();

  const sortedSampleValues = metric.simulation?.sample.sortedValues;
  const allSamples = _.get(metric, "simulation.sample.values");
  const stats = _.get(metric, "simulation.stats");
  const guesstimate = metric.guesstimate;

  return (
    <GeneralModal onRequestClose={closeModal}>
      <div className="mb-8 w-80 bg-grey-eee sm:w-[600px] md:w-[700px] lg:w-[1000px]">
        <div className="flex items-center justify-between px-6 py-4">
          <h1 className="text-3xl font-bold leading-none text-grey-444">
            {metric.name}
          </h1>
          <ButtonClose onClick={closeModal} />
        </div>

        {showSimulation && sortedSampleValues && (
          <div className="px-8">
            <HistogramWithStats
              simulation={metric.simulation}
              stats={stats}
              sortedSampleValues={sortedSampleValues}
            />
          </div>
        )}
        <div className="bg-white pt-12">
          <div className="flex items-start justify-between gap-8 px-8">
            <div className="flex-1">
              <DistributionEditor
                organizationId={organizationId}
                canUseOrganizationFacts={canUseOrganizationFacts}
                guesstimate={metric.guesstimate}
                metricClickMode={metricClickMode}
                inputMetrics={metric.edges.inputMetrics}
                metricId={metric.id}
                size="large"
              />
            </div>
            <DropDown
              headerText="Samples"
              openLink={<Button onClick={() => {}}>Samples</Button>}
              position="right"
              hasPadding={true}
            >
              <SampleList samples={allSamples} />
            </DropDown>
          </div>
          {guesstimate && (
            <div className="px-8 pt-8">
              <GuesstimateDescription
                onChange={onChangeGuesstimateDescription}
                value={guesstimate.description}
              />
            </div>
          )}
        </div>
      </div>
    </GeneralModal>
  );
};
