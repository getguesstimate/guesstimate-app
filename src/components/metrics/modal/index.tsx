import _ from "lodash";
import { Component } from "react";

import DistributionEditor from "gComponents/distributions/editor/index";
import { HistogramWithStats } from "gComponents/simulations/histogram_with_stats/index";
import { ButtonClose } from "gComponents/utility/buttons/close";
import DropDown from "gComponents/utility/drop-down/index";
import { GeneralModal } from "gComponents/utility/modal/index";
import GuesstimateDescription from "./description";

import { SAMPLE_FILTERED } from "lib/guesstimator/samplers/simulator-worker/simulator/filters/filters";

const SampleList = ({ samples }) => (
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

//Note: Controlled inputs don't pass through very well.  Try to keep them in child connects().
export class MetricModal extends Component<any> {
  showSimulation() {
    const stats = _.get(this.props, "metric.simulation.stats");
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
  }

  render() {
    const showSimulation = this.showSimulation();

    const {
      closeModal,
      metric,
      organizationId,
      canUseOrganizationFacts,
      metricClickMode,
      onChangeGuesstimateDescription,
    } = this.props;
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
  }
}
