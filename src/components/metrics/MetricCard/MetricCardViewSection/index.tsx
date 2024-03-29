import { FC, forwardRef, useImperativeHandle, useRef } from "react";

import clsx from "clsx";
import _ from "lodash";
import { ConnectDragSource } from "react-dnd";
import { DistributionSummary } from "~/components/distributions/DistributionSummary/index";
import {
  MetricName,
  MetricNameHandle,
} from "~/components/metrics/MetricCard/MetricName";
import { SensitivitySection } from "~/components/metrics/MetricCard/SensitivitySection/SensitivitySection";
import {
  MetricExportedIcon,
  MetricReadableId,
  MetricReasoningIcon,
  MetricSidebarToggle,
} from "~/components/metrics/MetricCard/token/index";
import Icon from "~/components/react-fa-patched";
import { MetricStatTable } from "~/components/simulations/MetricStatTable";
import { SimulationHistogram } from "~/components/simulations/SimulationHistogram";
import { INPUT, OUTPUT, relationshipType } from "~/lib/engine/graph";
import {
  displayableError,
  errors,
  hasErrors,
  isBreak,
  isInfiniteLoop,
} from "~/lib/engine/simulation";
import { FullDenormalizedMetric } from "~/lib/engine/space";
import { replaceByMap } from "~/lib/engine/utils";
import { getMessage, PropagationError } from "~/lib/propagation/errors";
import { metricIdToNodeId } from "~/lib/propagation/wrapper";
import { CanvasState } from "~/modules/canvas_state/reducer";

// TODO(matthew): Refactor these components. E.g. it's weird that isBreak takes all errors, but you may only care about
// the one...

// We have to display this section after it disappears
// to ensure that the metric card gets selected after click.
const ErrorIcon: FC<{ errors: PropagationError[] }> = ({ errors }) => {
  if (isBreak(errors)) {
    return <Icon name="unlink" className="text-[1.4em] text-red-8" />;
  } else if (isInfiniteLoop(errors)) {
    return <i className="ion-ios-infinite text-[1.8em] text-red-4" />;
  } else {
    return <Icon name="warning" className="text-[1.5em] text-red-4" />;
  }
};

// We have to display this section after it disappears
// to ensure that the metric card gets selected after click.
const ErrorSection: FC<{
  errors: PropagationError[];
  shouldShowErrorText: boolean;
  messageToDisplay: string | null;
}> = ({ errors, shouldShowErrorText, messageToDisplay }) => {
  const theme = isBreak(errors) ? "minor" : "serious";

  return (
    <div
      className={clsx(
        "grid h-full min-h-[40px] place-items-center",
        theme === "serious" ? "bg-red-6" : "bg-red-7"
      )}
    >
      {shouldShowErrorText ? (
        <div className="px-2 py-0.5 text-sm font-medium leading-[1.1em] text-red-3">
          {messageToDisplay}
        </div>
      ) : (
        <ErrorIcon errors={errors} />
      )}
    </div>
  );
};

type Props = {
  canvasState: CanvasState;
  isTitle: boolean;
  titleView: boolean;
  metric: FullDenormalizedMetric;
  inSelectedCell: boolean;
  screenshot: boolean;
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

export const MetricCardViewSection = forwardRef<
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
    screenshot,
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
    } else if (!_.isEmpty(metric.guesstimate.description) && !screenshot) {
      return <MetricReasoningIcon />;
    } else {
      return null;
    }
  };

  const shouldShowErrorSection = _hasErrors() && !inSelectedCell;

  const renderErrorSection = () => {
    const errorToDisplay = displayableError(_errors());

    const nodeIdMap = _.transform(
      props.idMap,
      (runningMap, value, key) => {
        runningMap[metricIdToNodeId(key)] = value;
      },
      {}
    );
    const messageToDisplay = errorToDisplay
      ? replaceByMap(getMessage(errorToDisplay), nodeIdMap)
      : null;

    return (
      <ErrorSection
        errors={_errors()}
        messageToDisplay={messageToDisplay}
        shouldShowErrorText={!!messageToDisplay && props.hovered}
      />
    );
  };

  const stats = metric.simulation?.stats;
  const anotherFunctionSelected =
    metricClickMode === "FUNCTION_INPUT_SELECT" && !inSelectedCell;

  const relType = relationshipType(metric.edges);
  const renderDistributionSummary = () => {
    const summaryTheme =
      relType === INPUT
        ? "normal-input"
        : relType === OUTPUT
        ? "normal-output"
        : "normal";

    return (
      <DistributionSummary
        length={stats.length}
        mean={stats.mean}
        adjustedConfidenceInterval={stats.adjustedConfidenceInterval}
        theme={summaryTheme}
      />
    );
  };

  return (
    <div className="relative flex flex-1 flex-col" onMouseDown={onMouseDown}>
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
        <div className="mt-1 mr-1">{renderToken()}</div>
      </div>

      {(!_.isEmpty(metric.name) || inSelectedCell || hasContent()) && (
        <div className="flex-none pr-7 pl-1.5 pt-1">
          <MetricName
            anotherFunctionSelected={anotherFunctionSelected}
            inSelectedCell={inSelectedCell}
            titleView={props.titleView}
            isOutput={relType === OUTPUT}
            name={metric.name}
            onChange={onChangeName}
            jumpSection={jumpSection}
            ref={nameRef}
            heightHasChanged={props.heightHasChanged}
            onReturn={props.onReturn}
            onTab={props.onTab}
          />
        </div>
      )}

      <div
        className={clsx(
          "flex min-h-[10px] flex-1 flex-col",
          anotherFunctionSelected ? "cursor-pointer" : "cursor-move"
        )}
        ref={props.connectDragSource}
      >
        {showSensitivitySection && (
          <div className="flex-none">
            <SensitivitySection
              yMetric={props.analyzedMetric}
              xMetric={metric}
            />
          </div>
        )}
        {showSimulation && (
          <div className="flex-1 px-2 pt-2 pb-1">
            {renderDistributionSummary()}
          </div>
        )}
        {showSimulation && shouldShowStatistics && (
          <div className="mt-2.5 bg-white/30 px-2">
            <MetricStatTable stats={metric.simulation?.stats} />
          </div>
        )}

        {shouldShowErrorSection && (
          <div
            className={clsx(
              "flex-1",
              !_.isEmpty(metric.name) && !inSelectedCell && "mt-1"
            )}
          >
            {renderErrorSection()}
          </div>
        )}
      </div>
    </div>
  );
});
