import _ from "lodash";
import React, { Component, useImperativeHandle, useRef } from "react";

import Icon from "~/components/react-fa-patched";

import { DistributionSummary } from "~/components/distributions/summary/index";
import {
  MetricName,
  MetricNameHandle,
} from "~/components/metrics/card/name/index";
import { SensitivitySection } from "~/components/metrics/card/SensitivitySection/SensitivitySection";
import {
  MetricExportedIcon,
  MetricReadableId,
  MetricReasoningIcon,
  MetricSidebarToggle,
} from "~/components/metrics/card/token/index";
import { SimulationHistogram } from "~/components/simulations/SimulationHistogram";
import { MetricStatTable } from "~/components/simulations/MetricStatTable";

import { getMessage, PropagationError } from "~/lib/propagation/errors";
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
import clsx from "clsx";

// TODO(matthew): Refactor these components. E.g. it's weird that isBreak takes all errors, but you may only care about
// the one...

// We have to display this section after it disappears
// to ensure that the metric card gets selected after click.
const ErrorIcon: React.FC<{ errors: PropagationError[] }> = ({ errors }) => {
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
  errors: PropagationError[];
  padTop: boolean;
  shouldShowErrorText: boolean;
  messageToDisplay: string | null;
}> = ({ errors, padTop, shouldShowErrorText, messageToDisplay }) => (
  <div
    className={clsx(
      "StatsSectionErrors",
      isBreak(errors) ? "minor" : "serious",
      padTop && "padTop"
    )}
  >
    {shouldShowErrorText && (
      <div className="error-message">{messageToDisplay}</div>
    )}
    {!shouldShowErrorText && <ErrorIcon errors={errors} />}
  </div>
);

type Props = {
  canvasState: CanvasState;
  isTitle: boolean;
  titleView: boolean;
  metric: FullDenormalizedMetric;
  inSelectedCell: boolean;
  hovered: boolean;
  showSensitivitySection: boolean;
  exportedAsFact: boolean;
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

export const MetricCardViewSection = React.forwardRef<
  { hasContent(): boolean; focusName(): void },
  Props
>(function MetricCardViewSection(props, ref) {
  const {
    canvasState: {
      scientificViewEnabled,
      expandedViewEnabled,
      metricClickMode,
    },
    metric,
    inSelectedCell,
    onChangeName,
    jumpSection,
    onMouseDown,
    showSensitivitySection,
  } = props;

  const nameRef = useRef<MetricNameHandle | null>(null);

  const hasContent = () => {
    return nameRef.current?.hasContent() || false;
  };

  useImperativeHandle(ref, () => ({
    hasContent,
    focusName: () => nameRef.current?.focus(),
  }));

  const getShowSimulation = () => {
    const stats = metric?.simulation?.stats;
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
  };
  const showSimulation = getShowSimulation();

  const shouldShowStatistics =
    scientificViewEnabled &&
    showSimulation &&
    metric.simulation?.stats.length > 1;

  const _hasErrors = () => {
    return !props.isTitle && hasErrors(metric.simulation);
  };
  const _errors = () => {
    return _hasErrors() ? errors(metric.simulation) : [];
  };

  const renderToken = () => {
    const anotherFunctionSelected =
      metricClickMode === "FUNCTION_INPUT_SELECT" && !inSelectedCell;
    const shouldShowReadableId = expandedViewEnabled || anotherFunctionSelected;

    if (shouldShowReadableId) {
      return <MetricReadableId readableId={metric.readableId} />;
    } else if (props.hovered) {
      return <MetricSidebarToggle onToggleSidebar={props.onToggleSidebar} />;
    } else if (props.exportedAsFact) {
      return <MetricExportedIcon />;
    } else if (!_.isEmpty(metric.guesstimate.description)) {
      return <MetricReasoningIcon />;
    } else {
      return null;
    }
  };

  const renderErrorSection = () => {
    const shouldShowErrorSection = _hasErrors() && !inSelectedCell;
    if (!shouldShowErrorSection) {
      return null;
    }

    const errorToDisplay = displayableError(_errors());

    const nodeIdMap = _.transform(
      props.idMap,
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
        errors={_errors()}
        messageToDisplay={messageToDisplay}
        padTop={!_.isEmpty(metric.name) && !inSelectedCell}
        shouldShowErrorText={!!messageToDisplay && props.hovered}
      />
    );
  };

  const stats = metric.simulation?.stats;
  const anotherFunctionSelected =
    metricClickMode === "FUNCTION_INPUT_SELECT" && !inSelectedCell;

  const mainClassName = clsx(
    "MetricCardViewSection",
    _hasErrors() && !inSelectedCell && "hasErrors"
  );
  return (
    <div className={mainClassName} onMouseDown={onMouseDown}>
      {showSimulation && (
        <div
          className={clsx(
            "absolute bottom-0 left-0 right-0 -z-10",
            scientificViewEnabled ? "h-[110px]" : "h-[30px]"
          )}
        >
          <SimulationHistogram
            simulation={metric.simulation}
            cutOffRatio={0.995}
            theme="normal"
          />
        </div>
      )}

      <div className="absolute top-0 right-0">
        <div className="MetricToken">{renderToken()}</div>
      </div>

      {!_.isEmpty(metric.name) || inSelectedCell || hasContent() ? (
        <div className="flex-none pr-8 pl-1 pt-1">
          <MetricName
            anotherFunctionSelected={anotherFunctionSelected}
            inSelectedCell={inSelectedCell}
            titleView={props.titleView}
            name={metric.name}
            onChange={onChangeName}
            jumpSection={jumpSection}
            ref={nameRef}
            heightHasChanged={props.heightHasChanged}
            onReturn={props.onReturn}
            onTab={props.onTab}
          />
        </div>
      ) : null}

      <div
        className={clsx(
          "StatsSection",
          anotherFunctionSelected ? "cursor-pointer" : "cursor-move"
        )}
        ref={props.connectDragSource}
      >
        {showSensitivitySection && (
          <SensitivitySection yMetric={props.analyzedMetric} xMetric={metric} />
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
            <MetricStatTable stats={metric.simulation?.stats} />
          </div>
        )}

        {renderErrorSection()}
      </div>
    </div>
  );
});
