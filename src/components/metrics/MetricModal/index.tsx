import _ from "lodash";
import React from "react";

import DistributionEditor from "~/components/distributions/editor/index";
import { HistogramWithStats } from "~/components/simulations/histogram_with_stats/index";
import { ButtonClose } from "~/components/utility/buttons/close";
import { DropDown } from "~/components/utility/DropDown";
import { GeneralModal } from "~/components/utility/modal/index";
import { GuesstimateDescription } from "./GuesstimateDescription";

import { FullDenormalizedMetric } from "~/lib/engine/space";
import { SAMPLE_FILTERED } from "~/lib/guesstimator/samplers/simulator-worker/simulator/filters/filters";
import { MetricClickMode } from "~/modules/canvas_state/reducer";

const SampleList: React.FC<{ samples: number[] | undefined }> = ({
  samples,
}) => (
  <ul className="SampleList">
    {_.map(
      samples,
      (element, index) =>
        !_.isEqual(element, SAMPLE_FILTERED) && (
          <li key={index}>
            <div key={index}>{element}</div>
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

//Note: Controlled inputs don't pass through very well.  Try to keep them in child connects().
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

  const sortedSampleValues = _.get(metric, "simulation.sample.sortedValues");
  const allSamples = _.get(metric, "simulation.sample.values");
  const stats = _.get(metric, "simulation.stats");
  const guesstimate = metric.guesstimate;
  return (
    <GeneralModal onRequestClose={closeModal}>
      <div className="metricModal">
        <div className="container top">
          <div className="row">
            <div className="col-sm-10">
              <h1> {metric.name} </h1>
            </div>
            <div className="col-sm-2">
              <ButtonClose onClick={closeModal} />
            </div>
          </div>
          {showSimulation && (
            <HistogramWithStats
              simulation={metric.simulation}
              stats={stats}
              sortedSampleValues={sortedSampleValues}
            />
          )}
        </div>

        <div className="container bottom">
          <div className="row editingInputSection">
            <div className="col-sm-10">
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
            <div className="col-sm-2">
              <div className="metricModal--sample-container">
                <DropDown
                  headerText="Samples"
                  openLink={<a className="modal-action button"> Samples </a>}
                  position="right"
                  hasPadding={true}
                >
                  <SampleList samples={allSamples} />
                </DropDown>
              </div>
            </div>
          </div>
          <div className="row guesstimateDescriptionSection">
            <div className="col-xs-12">
              {guesstimate && (
                <GuesstimateDescription
                  onChange={onChangeGuesstimateDescription}
                  value={guesstimate.description}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </GeneralModal>
  );
};
