import _ from "lodash";
import React, { Component } from "react";

import Icon from "~/components/react-fa-patched";

import { DistributionSummary } from "~/components/distributions/summary/index";
import { MetricName } from "~/components/metrics/card/name/index";
import { SensitivitySection } from "~/components/metrics/card/SensitivitySection/SensitivitySection";
import {
  MetricExportedIcon,
  MetricReadableId,
  MetricReasoningIcon,
  MetricSidebarToggle,
} from "~/components/metrics/card/token/index";
import { SimulationHistogram } from "~/components/simulations/SimulationHistogram";
import { MetricStatTable } from "~/components/simulations/MetricStatTable";

import { getMessage } from "~/lib/propagation/errors";
import { metricIdToNodeId } from "~/lib/propagation/wrapper";

import {
  displayableError,
  errors,
  hasErrors,
  isBreak,
  isInfiniteLoop,
} from "~/lib/engine/simulation";
import { getClassName, replaceByMap } from "~/lib/engine/utils";
import { ConnectDragSource } from "react-dnd";
import { CanvasState } from "~/modules/canvas_state/reducer";
import { FullDenormalizedMetric } from "~/lib/engine/space";

// TODO(matthew): Refactor these components. E.g. it's weird that isBreak takes all errors, but you may only care about
// the one...

// We have to display this section after it disappears
// to ensure that the metric card gets selected after click.
const ErrorIcon: React.FC<{ errors: any }> = ({ errors }) => {
  if (isBreak(errors)) {
    return <Icon name="unlink" />;
  } else if (isInfiniteLoop(errors)) {
    return <i className="ion-ios-infinite" />;
  } else {
    return <Icon name="warning" />;
  }
};

// We have to display this section after it disappears
// to ensure that the metric card gets selected after click.
const ErrorSection: React.FC<{
  errors: any;
  padTop: boolean;
  shouldShowErrorText: boolean;
  messageToDisplay: string | null;
}> = ({ errors, padTop, shouldShowErrorText, messageToDisplay }) => (
  <div
    className={getClassName(
      "StatsSectionErrors",
      isBreak(errors) ? "minor" : "serious",
      padTop ? "padTop" : null
    )}
  >
    {shouldShowErrorText && (
      <div className={"error-message"}>{messageToDisplay}</div>
    )}
    {!shouldShowErrorText && <ErrorIcon errors={errors} />}
  </div>
);

type Props = {
  canvasState: CanvasState;
  isTitle: boolean;
  metric: FullDenormalizedMetric;
  inSelectedCell: boolean;
  hovered: boolean;
  showSensitivitySection: boolean;
  exportedAsFact: boolean;
  isInScreenshot: boolean;
  onToggleSidebar(): void;
  onChangeName(name: string): void;
  jumpSection(): void;
  heightHasChanged(): void;
  onMouseDown(e: React.MouseEvent): void;
  idMap: object;
  onReturn(): void;
  onTab(): void;
  connectDragSource: ConnectDragSource;
  analyzedMetric: any;
};

export class MetricCardViewSection extends Component<Props> {
  hasContent() {
    return _.result(this.refs, "name.hasContent");
  }
  focusName() {
    _.result(this.refs, "name.focus");
  }

  showSimulation() {
    const stats = _.get(this.props, "metric.simulation.stats");
    if (
      stats &&
      _.isFinite(stats.mean) &&
      _.isFinite(stats.stdev) &&
      _.isFinite(stats.length)
    ) {
      return stats.length > 1 || stats.stdev === 0;
    } else {
      return false;
    }
  }

  _shouldShowStatistics() {
    const isScientific = !!this.props.canvasState.scientificViewEnabled;
    const isAvailable =
      this.showSimulation() &&
      _.get(this.props, "metric.simulation.stats").length > 1;
    return isScientific && isAvailable;
  }

  _hasErrors() {
    return !this.props.isTitle && hasErrors(this.props.metric.simulation);
  }
  _errors() {
    return this._hasErrors() ? errors(this.props.metric.simulation) : [];
  }

  renderToken() {
    const {
      canvasState: { expandedViewEnabled, metricClickMode },
      metric: {
        guesstimate: { description },
        readableId,
      },
      inSelectedCell,
      hovered,
      exportedAsFact,
      onToggleSidebar,
    } = this.props;
    const anotherFunctionSelected =
      metricClickMode === "FUNCTION_INPUT_SELECT" && !inSelectedCell;
    const shouldShowReadableId =
      !!expandedViewEnabled || anotherFunctionSelected;

    if (shouldShowReadableId) {
      return <MetricReadableId readableId={readableId} />;
    } else if (hovered) {
      return <MetricSidebarToggle onToggleSidebar={onToggleSidebar} />;
    } else if (exportedAsFact) {
      return <MetricExportedIcon />;
    } else if (!_.isEmpty(description)) {
      return <MetricReasoningIcon />;
    } else {
      return null;
    }
  }

  renderErrorSection() {
    const {
      metric: { name },
      idMap,
      inSelectedCell,
      hovered,
    } = this.props;

    const shouldShowErrorSection = this._hasErrors() && !inSelectedCell;
    if (!shouldShowErrorSection) {
      return false;
    }

    const errorToDisplay = displayableError(this._errors());

    const nodeIdMap = _.transform(
      idMap,
      (runningMap, value, key) => {
        runningMap[metricIdToNodeId(key)] = value;
      },
      {}
    );
    const messageToDisplay = !!errorToDisplay
      ? replaceByMap(getMessage(errorToDisplay), nodeIdMap)
      : null;

    return (
      <ErrorSection
        errors={this._errors()}
        messageToDisplay={messageToDisplay}
        padTop={!_.isEmpty(name) && !inSelectedCell}
        shouldShowErrorText={!!messageToDisplay && hovered}
      />
    );
  }

  render() {
    const {
      canvasState: { scientificViewEnabled, metricClickMode },
      metric,
      inSelectedCell,
      onChangeName,
      jumpSection,
      onMouseDown,
      showSensitivitySection,
      isInScreenshot,
    } = this.props;

    const { simulation } = metric;
    const stats = _.get(simulation, "stats");
    const showSimulation = this.showSimulation();
    const shouldShowStatistics = this._shouldShowStatistics();
    const anotherFunctionSelected =
      metricClickMode === "FUNCTION_INPUT_SELECT" && !inSelectedCell;

    const mainClassName = getClassName(
      "MetricCardViewSection",
      anotherFunctionSelected ? "anotherFunctionSelected" : null,
      this._hasErrors() && !inSelectedCell ? "hasErrors" : null
    );
    return (
      <div className={mainClassName} onMouseDown={onMouseDown}>
        {showSimulation && (
          <SimulationHistogram
            height={scientificViewEnabled ? 110 : 30}
            simulation={simulation}
            cutOffRatio={0.995}
          />
        )}

        <div className="MetricTokenSection">
          <div className="MetricToken">{this.renderToken()}</div>
        </div>

        {!_.isEmpty(metric.name) || inSelectedCell || this.hasContent() ? (
          <div className="NameSection">
            <MetricName
              anotherFunctionSelected={anotherFunctionSelected}
              inSelectedCell={inSelectedCell}
              name={metric.name}
              onChange={onChangeName}
              jumpSection={jumpSection}
              ref="name"
              heightHasChanged={this.props.heightHasChanged}
              onReturn={this.props.onReturn}
              onTab={this.props.onTab}
            />
          </div>
        ) : null}

        <div className="StatsSection" ref={this.props.connectDragSource}>
          {showSensitivitySection && (
            <SensitivitySection
              yMetric={this.props.analyzedMetric}
              xMetric={metric}
            />
          )}
          {showSimulation && (
            <div className="StatsSectionBody">
              <DistributionSummary
                length={stats.length}
                mean={stats.mean}
                adjustedConfidenceInterval={stats.adjustedConfidenceInterval}
              />
            </div>
          )}
          {showSimulation && shouldShowStatistics && (
            <div className="StatsSectionTable">
              <MetricStatTable stats={metric.simulation.stats} />
            </div>
          )}

          {this.renderErrorSection()}
        </div>
      </div>
    );
  }
}
