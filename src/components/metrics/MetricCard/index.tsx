import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import { clsx } from "clsx";
import _ from "lodash";
import { DistributionEditor } from "~/components/distributions/DistributionEditor";
import { GridContext } from "~/components/lib/FlowGrid/FilledCell";
import { ToolTip } from "~/components/utility/ToolTip";
import {
  INPUT,
  INTERMEDIATE,
  NOEDGE,
  OUTPUT,
  relationshipType,
} from "~/lib/engine/graph";
import { FullDenormalizedMetric } from "~/lib/engine/space";
import { makeURLsMarkdown } from "~/lib/engine/utils";
import { withReadableId } from "~/lib/generateVariableNames/generateMetricReadableId";
import { shouldTransformName } from "~/lib/generateVariableNames/nameToVariableName";
import { Direction } from "~/lib/locationUtils";
import { analyzeMetricId, endAnalysis } from "~/modules/canvas_state/actions";
import { CanvasState } from "~/modules/canvas_state/reducer";
import { createFactFromMetric } from "~/modules/facts/actions";
import { changeGuesstimate } from "~/modules/guesstimates/actions";
import { useAppDispatch } from "~/modules/hooks";
import { changeMetric, removeMetrics } from "~/modules/metrics/actions";

import { MetricModal } from "../MetricModal";
import { MetricCardViewSection } from "./MetricCardViewSection";
import { MetricSidebar } from "./MetricSidebar";
import { MetricToolTip } from "./MetricToolTip";
import { SensitivitySection } from "./SensitivitySection/SensitivitySection";

const relationshipClasses = {
  [INTERMEDIATE]: "intermediate",
  [OUTPUT]: "output",
  [INPUT]: "input",
  [NOEDGE]: "noedge",
};

const shouldShowSimulation = (metric: FullDenormalizedMetric) => {
  const stats = metric.simulation?.stats;
  return Boolean(stats && _.isFinite(stats.stdev) && stats.length > 5);
};

type Props = {
  canvasState: CanvasState;
  metric: FullDenormalizedMetric;
  organizationId?: string | number;
  canUseOrganizationFacts: boolean;
  exportedAsFact: boolean;
  screenshot: boolean;
  idMap: object;
  analyzedMetric: FullDenormalizedMetric | null;
} & GridContext;

export const MetricCard = forwardRef<{ focus(): void }, Props>(
  function MetricCard(props, ref) {
    const {
      inSelectedCell,
      screenshot,
      metric,
      organizationId,
      canUseOrganizationFacts,
      canvasState,
      hovered,
      idMap,
      connectDragSource,
      analyzedMetric,
      forceFlowGridUpdate,
      exportedAsFact,
    } = props;
    const { metricClickMode } = canvasState;

    const dispatch = useAppDispatch();

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [sidebarIsOpen, setSidebarIsOpen] = useState(false);

    const viewRef = useRef<{ hasContent(): boolean; focusName(): void }>(null);
    const editorRef = useRef<{ focus(): void }>(null);

    // container element that gets focus when the item is selected
    const divRef = useRef<HTMLDivElement>(null);

    const isAnalyzedMetric =
      !!analyzedMetric && metric.id === analyzedMetric.id;

    const shouldShowSensitivitySection = !!(
      analyzedMetric &&
      !isAnalyzedMetric &&
      shouldShowSimulation(metric) &&
      shouldShowSimulation(analyzedMetric)
    );

    const shouldShowDistributionEditor =
      (canvasState.expandedViewEnabled || inSelectedCell) && !modalIsOpen;

    const isFunction = metric.guesstimate.guesstimateType === "FUNCTION";

    const canBeMadeFact =
      shouldTransformName(metric.name) && isFunction && canUseOrganizationFacts;

    const canBeAnalyzed = shouldShowSimulation(metric);

    const hasGuesstimate = !!(
      metric.guesstimate.input || metric.guesstimate.data
    );

    const isTitle = !!metric.name && !hasGuesstimate;

    const isTitleView = !hovered && !inSelectedCell && isTitle;

    const isMetricEmpty = !(
      hasGuesstimate ||
      !!metric.name ||
      !!metric.guesstimate.description
    );

    useEffect(() => {
      if (!hovered || !inSelectedCell) {
        closeSidebar();
      }
    }, [hovered, inSelectedCell]);

    const focusFromDirection = (dir: Direction | undefined) => {
      if (dir === "DOWN" || dir === "RIGHT") {
        focusForm();
      } else {
        viewRef.current?.focusName();
      }
    };

    const prevData = useRef<{
      inSelectedCell: boolean;
      modalIsOpen: boolean;
    }>();

    useEffect(() => {
      if (prevData.current) {
        // not first render
        const hasContent = viewRef.current?.hasContent();

        if (!inSelectedCell && isMetricEmpty && !hasContent && !modalIsOpen) {
          handleRemoveMetric();
        }

        if (
          !prevData.current.inSelectedCell &&
          inSelectedCell &&
          props.selectedFrom
        ) {
          focusFromDirection(props.selectedFrom);
        }

        if (modalIsOpen !== prevData.current.modalIsOpen) {
          props.forceFlowGridUpdate();
        }
      }
      prevData.current = {
        inSelectedCell,
        modalIsOpen,
      };
    });

    useEffect(() => {
      if (inSelectedCell && isMetricEmpty) {
        focusFromDirection(props.selectedFrom);
      }
    }, []);

    useImperativeHandle(ref, () => ({
      focus: () => divRef.current?.focus(),
    }));

    const toggleSidebar = () => {
      setSidebarIsOpen(!sidebarIsOpen);
      setModalIsOpen(false);
    };
    const closeSidebar = () => {
      setSidebarIsOpen(false);
    };

    const handleRemoveMetric = () => {
      dispatch(removeMetrics([metric.id]));
    };

    const focusForm = () => {
      editorRef.current?.focus();
    };

    const openModal = () => {
      setModalIsOpen(true);
      setSidebarIsOpen(false);
    };
    const closeModal = () => setModalIsOpen(false);

    const isSelectable = (e: React.MouseEvent) => {
      const selectableEl =
        (e.target as any).parentElement.getAttribute("data-select") !== "false";
      const notYetSelected = !inSelectedCell;
      return selectableEl && notYetSelected;
    };

    const handleInnerMouseDown = (e: React.MouseEvent) => {
      if (
        metricClickMode === "FUNCTION_INPUT_SELECT" &&
        isSelectable(e) &&
        !e.shiftKey
      ) {
        window.dispatchEvent(
          new CustomEvent("functionMetricClicked", {
            detail: metric,
          })
        );
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // If sidebar is expanded, we want to close it if anything else is clicked
    const handleOuterMouseDown = (e: React.MouseEvent) => {
      const isSidebarElement =
        _.get(e.target, "dataset.controlSidebar") === "true";
      if (sidebarIsOpen && !isSidebarElement) {
        toggleSidebar();
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.target === divRef.current && e.key === "Enter" && inSelectedCell) {
        e.preventDefault();
        e.stopPropagation();
        openModal();
      }
    };

    const onChangeMetricName = (name: string) => {
      if (name === metric.name) {
        return;
      }

      const newMetric = withReadableId(
        { id: metric.id, name },
        _.values(idMap)
      );

      dispatch(changeMetric(newMetric));
    };

    const onChangeGuesstimateDescription = (rawDescription: string) => {
      const description = makeURLsMarkdown(rawDescription);
      dispatch(changeGuesstimate(metric.id, { description }));
    };

    const handleMakeFact = () => {
      dispatch(createFactFromMetric(organizationId, metric));
    };

    const handleBeginAnalysis = () => {
      dispatch(analyzeMetricId(metric.id));
    };
    const handleEndAnalysis = () => {
      dispatch(endAnalysis());
    };

    const relType = relationshipType(metric.edges);

    return (
      <ToolTip
        disabled={
          !hovered ||
          inSelectedCell ||
          (!shouldShowSensitivitySection && !metric.guesstimate.description)
        }
        theme="light"
        containerClassName="min-w-0"
        placement="bottom-start"
        withPortal
        render={() =>
          shouldShowSensitivitySection ? (
            <SensitivitySection
              yMetric={analyzedMetric}
              xMetric={metric}
              size="LARGE"
            />
          ) : (
            <MetricToolTip guesstimate={metric.guesstimate} />
          )
        }
      >
        <div
          ref={divRef}
          className="relative flex h-full w-full focus:outline-none"
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <div
            className={clsx(
              "relative flex w-full flex-col overflow-hidden rounded-xs",
              "max-w-[30em]",
              "z-0", // is this necessary?
              "whitespace-normal", // is this necessary?
              "font-light", // TODO - remove, move styling to children
              !isTitleView &&
                (inSelectedCell
                  ? "bg-[#fefefe] hover:bg-white"
                  : [
                      relType === NOEDGE
                        ? "bg-[#edeff3]"
                        : relType === INTERMEDIATE
                        ? "bg-[#f0f2f5]"
                        : "bg-[#fefefe] hover:bg-[#f4f4f4]",
                    ]),
              relationshipClasses[relType] // used by SensitivitySection
            )}
            onKeyDown={
              // key presses on inner fields shouldn't affect FlowGrid
              (e) => e.stopPropagation()
            }
            onMouseDown={handleOuterMouseDown}
          >
            {modalIsOpen && (
              <MetricModal
                metric={metric}
                organizationId={organizationId}
                canUseOrganizationFacts={canUseOrganizationFacts}
                metricClickMode={metricClickMode}
                closeModal={closeModal}
                onChangeGuesstimateDescription={onChangeGuesstimateDescription}
              />
            )}

            <MetricCardViewSection
              canvasState={canvasState}
              metric={metric}
              inSelectedCell={inSelectedCell}
              screenshot={screenshot}
              onChangeName={onChangeMetricName}
              onToggleSidebar={toggleSidebar}
              jumpSection={focusForm}
              onMouseDown={handleInnerMouseDown}
              ref={viewRef}
              isTitle={isTitle}
              titleView={isTitleView}
              connectDragSource={connectDragSource}
              idMap={idMap}
              analyzedMetric={analyzedMetric}
              showSensitivitySection={shouldShowSensitivitySection}
              heightHasChanged={forceFlowGridUpdate}
              hovered={hovered}
              onReturn={props.onReturn}
              onTab={props.onTab}
              exportedAsFact={exportedAsFact}
            />

            {shouldShowDistributionEditor && (
              <div className="border-[#ddd] flex-none border-t p-1">
                <DistributionEditor
                  size="small"
                  ref={editorRef}
                  guesstimate={metric.guesstimate}
                  inputMetrics={metric.edges.inputMetrics}
                  metricClickMode={metricClickMode}
                  metricId={metric.id}
                  organizationId={organizationId}
                  canUseOrganizationFacts={canUseOrganizationFacts}
                  jumpSection={() => {
                    viewRef.current?.focusName();
                  }}
                  onOpen={openModal}
                  onReturn={props.onReturn}
                  onTab={props.onTab}
                />
              </div>
            )}
          </div>
          {inSelectedCell && sidebarIsOpen && (
            <div className="w-[160px] absolute top-1 -right-[163px] z-20">
              <MetricSidebar
                onOpenModal={openModal}
                onRemoveMetric={handleRemoveMetric}
                showAnalysis={canBeAnalyzed}
                onBeginAnalysis={handleBeginAnalysis}
                onEndAnalysis={handleEndAnalysis}
                canBeMadeFact={canBeMadeFact}
                exportedAsFact={exportedAsFact}
                onMakeFact={handleMakeFact}
                isAnalyzedMetric={isAnalyzedMetric}
              />
            </div>
          )}
        </div>
      </ToolTip>
    );
  }
);
