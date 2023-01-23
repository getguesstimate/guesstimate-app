import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";

import ReactDOM from "react-dom";
import Icon from "~/components/react-fa-patched";

import { MetricToolTip } from "./MetricToolTip";
import { hasMetricUpdated } from "./updated";

import {
  DistributionEditor,
  UnwrappedDistributionEditor,
} from "~/components/distributions/editor/index";
import { MetricModal } from "~/components/metrics/MetricModal";
import { ToolTip } from "~/components/utility/ToolTip";
import { MetricCardViewSection } from "./MetricCardViewSection";
import { SensitivitySection } from "./SensitivitySection/SensitivitySection";

import { analyzeMetricId, endAnalysis } from "~/modules/canvas_state/actions";
import { createFactFromMetric } from "~/modules/facts/actions";
import { changeGuesstimate } from "~/modules/guesstimates/actions";
import { changeMetric, removeMetrics } from "~/modules/metrics/actions";

import { withReadableId } from "~/lib/generateVariableNames/generateMetricReadableId";
import { shouldTransformName } from "~/lib/generateVariableNames/nameToVariableName";

import { GridContext } from "~/components/lib/FlowGrid/FilledCell";
import {
  INPUT,
  INTERMEDIATE,
  NOEDGE,
  OUTPUT,
  relationshipType,
} from "~/lib/engine/graph";
import { FullDenormalizedMetric } from "~/lib/engine/space";
import { makeURLsMarkdown } from "~/lib/engine/utils";
import { CanvasState } from "~/modules/canvas_state/reducer";
import { AppDispatch } from "~/modules/store";
import clsx from "clsx";
import { Direction } from "~/lib/locationUtils";
import { MetricSidebar } from "./MetricSidebar";

const relationshipClasses = {
  [INTERMEDIATE]: "intermediate",
  [OUTPUT]: "output",
  [INPUT]: "input",
  [NOEDGE]: "noedge",
};

type Props = {
  canvasState: CanvasState;
  isInScreenshot: boolean;
  metric: FullDenormalizedMetric;
  organizationId?: string | number;
  canUseOrganizationFacts: boolean;
  exportedAsFact: boolean;
  idMap: object;
  analyzedMetric: FullDenormalizedMetric | null;
} & GridContext & { dispatch: AppDispatch };

type State = {
  modalIsOpen: boolean;
  sidebarIsOpen: boolean;
};

class UnconnectedMetricCard extends Component<Props, State> {
  state = {
    modalIsOpen: false,
    sidebarIsOpen: false,
  };

  viewRef: React.RefObject<MetricCardViewSection>;
  editorRef: React.RefObject<UnwrappedDistributionEditor>;

  constructor(props: Props) {
    super(props);
    this.viewRef = React.createRef();
    this.editorRef = React.createRef();
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return (
      hasMetricUpdated(this.props, nextProps) ||
      this.state.modalIsOpen !== nextState.modalIsOpen ||
      this.state.sidebarIsOpen !== nextState.sidebarIsOpen
    );
  }

  _beginAnalysis() {
    this.props.dispatch(analyzeMetricId(this._id()));
  }
  _endAnalysis() {
    this.props.dispatch(endAnalysis());
  }

  focusFromDirection(dir: Direction | undefined) {
    if (dir === "DOWN" || dir === "RIGHT") {
      this._focusForm();
    } else {
      this.viewRef.current?.focusName();
    }
  }

  componentWillUpdate(nextProps: Props) {
    if (this.props.inSelectedCell && !nextProps.inSelectedCell) {
      this._closeSidebar();
    }
    if (this.props.hovered && !nextProps.hovered) {
      this._closeSidebar();
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const hasContent = _.result(this.viewRef.current, "hasContent");
    const { inSelectedCell, selectedFrom } = this.props;
    if (
      !inSelectedCell &&
      this._isEmpty() &&
      !hasContent &&
      !this.state.modalIsOpen
    ) {
      this.handleRemoveMetric();
    }
    if (!prevProps.inSelectedCell && inSelectedCell && selectedFrom) {
      this.focusFromDirection(selectedFrom);
    }

    if (this.state.modalIsOpen !== prevState.modalIsOpen) {
      this.props.forceFlowGridUpdate();
    }
  }

  componentDidMount() {
    if (this.props.inSelectedCell && this._isEmpty()) {
      this.focusFromDirection(this.props.selectedFrom);
    }
  }

  openModal() {
    this.setState({ modalIsOpen: true, sidebarIsOpen: false });
  }
  closeModal() {
    this.setState({ modalIsOpen: false });
  }
  _toggleSidebar() {
    this.setState({
      sidebarIsOpen: !this.state.sidebarIsOpen,
      modalIsOpen: false,
    });
  }

  _closeSidebar() {
    if (this.state.sidebarIsOpen) {
      this.setState({ sidebarIsOpen: false });
    }
  }

  _handleKeyDown(e: React.KeyboardEvent) {
    if (e.target === ReactDOM.findDOMNode(this)) {
      if (e.keyCode === 13 && this.props.inSelectedCell) {
        e.preventDefault();
        e.stopPropagation();
        this.openModal();
      }
    }
  }

  _handleKeyPress(e: React.KeyboardEvent) {
    if (e.target === ReactDOM.findDOMNode(this)) {
      this.props.gridKeyPress(e);
    }
    e.stopPropagation();
  }

  // TODO(matthew): Maybe use allPropsPresent
  _isEmpty() {
    return !(
      this._hasGuesstimate() ||
      this._hasName() ||
      this._hasDescription()
    );
  }

  _hasName() {
    return !!this.props.metric.name;
  }

  _hasDescription() {
    return !!this.props.metric.guesstimate.description;
  }

  _hasGuesstimate() {
    const has = (item: string) => !!_.get(this.props.metric.guesstimate, item);
    return has("input") || has("data");
  }

  _isTitle() {
    return this._hasName() && !this._hasGuesstimate();
  }

  onChangeMetricName(name: string) {
    if (name === this.props.metric.name) {
      return;
    }

    const metric = withReadableId(
      { id: this._id(), name },
      _.values(this.props.idMap)
    );

    this.props.dispatch(changeMetric(metric));
  }

  onChangeGuesstimateDescription(rawDescription: string) {
    const description = makeURLsMarkdown(rawDescription);
    this.props.dispatch(
      changeGuesstimate(this._id(), {
        ...this.props.metric.guesstimate,
        description,
      })
    );
  }

  handleRemoveMetric() {
    this.props.dispatch(removeMetrics([this._id()]));
  }
  _id() {
    return this.props.metric.id;
  }

  _focusForm() {
    this.editorRef.current?.focus();
  }

  _handleMouseDown(e: React.MouseEvent) {
    if (this._isFunctionInputSelectable(e) && !e.shiftKey) {
      window.dispatchEvent(
        new CustomEvent("functionMetricClicked", { detail: this.props.metric })
      );
      // TODO(matthew): Why don't these stop the triggering of the flow grid cell?
      e.preventDefault();
      e.stopPropagation();
    }
  }

  _isSelectable(e: React.MouseEvent) {
    const selectableEl =
      (e.target as any).parentElement.getAttribute("data-select") !== "false";
    const notYetSelected = !this.props.inSelectedCell;
    return selectableEl && notYetSelected;
  }

  _isFunctionInputSelectable(e: React.MouseEvent) {
    return (
      this._isSelectable(e) &&
      this.props.canvasState.metricClickMode === "FUNCTION_INPUT_SELECT"
    );
  }

  _relationshipType() {
    return relationshipType(this.props.metric.edges);
  }

  _className() {
    const { inSelectedCell, hovered, isInScreenshot } = this.props;
    const relationshipClass = relationshipClasses[this._relationshipType()];

    const titleView = !hovered && !inSelectedCell && this._isTitle();
    return clsx(
      "metricCard",
      isInScreenshot && "display",
      titleView && "titleView",
      relationshipClass
    );
  }

  _shouldShowSimulation(metric: FullDenormalizedMetric) {
    const stats = metric.simulation?.stats;
    return Boolean(stats && _.isFinite(stats.stdev) && stats.length > 5);
  }

  _canBeAnalyzed() {
    const { metric } = this.props;
    return this._shouldShowSimulation(metric);
  }

  _makeFact() {
    this.props.dispatch(
      createFactFromMetric(this.props.organizationId, this.props.metric)
    );
  }

  // If sidebar is expanded, we want to close it if anything else is clicked
  onMouseDown(e: React.MouseEvent) {
    const isSidebarElement =
      _.get(e.target, "dataset.controlSidebar") === "true";
    if (this.state.sidebarIsOpen && !isSidebarElement) {
      this._toggleSidebar();
    }
  }

  render() {
    const {
      inSelectedCell,
      metric,
      organizationId,
      canUseOrganizationFacts,
      canvasState,
      hovered,
      idMap,
      connectDragSource,
      analyzedMetric,
      forceFlowGridUpdate,
      isInScreenshot,
      exportedAsFact,
    } = this.props;

    const { metricClickMode } = canvasState;

    const isAnalyzedMetric =
      !!analyzedMetric && metric.id === analyzedMetric.id;

    const shouldShowSensitivitySection = !!(
      analyzedMetric &&
      !isAnalyzedMetric &&
      this._shouldShowSimulation(metric) &&
      this._shouldShowSimulation(analyzedMetric)
    );

    const shouldShowDistributionEditor =
      canvasState.expandedViewEnabled || inSelectedCell;

    const isFunction = metric.guesstimate.guesstimateType === "FUNCTION";

    const canBeMadeFact =
      shouldTransformName(metric.name) && isFunction && canUseOrganizationFacts;

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
          className="h-full w-full relative flex focus:outline-none"
          onKeyPress={this._handleKeyPress.bind(this)}
          onKeyDown={this._handleKeyDown.bind(this)}
          tabIndex={0}
        >
          <div
            className={this._className()}
            onMouseDown={this.onMouseDown.bind(this)}
          >
            {this.state.modalIsOpen && (
              <MetricModal
                metric={metric}
                organizationId={organizationId}
                canUseOrganizationFacts={canUseOrganizationFacts}
                metricClickMode={metricClickMode}
                closeModal={this.closeModal.bind(this)}
                onChangeGuesstimateDescription={this.onChangeGuesstimateDescription.bind(
                  this
                )}
              />
            )}

            <MetricCardViewSection
              canvasState={canvasState}
              metric={metric}
              inSelectedCell={inSelectedCell}
              onChangeName={this.onChangeMetricName.bind(this)}
              onToggleSidebar={this._toggleSidebar.bind(this)}
              jumpSection={this._focusForm.bind(this)}
              onMouseDown={this._handleMouseDown.bind(this)}
              ref={this.viewRef}
              isTitle={this._isTitle()}
              isInScreenshot={isInScreenshot}
              connectDragSource={connectDragSource}
              idMap={idMap}
              analyzedMetric={analyzedMetric}
              showSensitivitySection={shouldShowSensitivitySection}
              heightHasChanged={forceFlowGridUpdate}
              hovered={hovered}
              onReturn={this.props.onReturn}
              onTab={this.props.onTab}
              exportedAsFact={exportedAsFact}
            />

            {shouldShowDistributionEditor && !this.state.modalIsOpen && (
              <div className="section editing">
                <DistributionEditor
                  guesstimate={metric.guesstimate}
                  inputMetrics={metric.edges.inputMetrics}
                  metricClickMode={metricClickMode}
                  metricId={metric.id}
                  organizationId={organizationId}
                  canUseOrganizationFacts={canUseOrganizationFacts}
                  jumpSection={() => {
                    this.viewRef.current?.focusName();
                  }}
                  onOpen={this.openModal.bind(this)}
                  ref={this.editorRef}
                  size="small"
                  onReturn={this.props.onReturn}
                  onTab={this.props.onTab}
                />
              </div>
            )}
          </div>
          {inSelectedCell && this.state.sidebarIsOpen && (
            <MetricSidebar
              onOpenModal={this.openModal.bind(this)}
              onRemoveMetric={this.handleRemoveMetric.bind(this)}
              showAnalysis={this._canBeAnalyzed()}
              onBeginAnalysis={this._beginAnalysis.bind(this)}
              onEndAnalysis={this._endAnalysis.bind(this)}
              canBeMadeFact={canBeMadeFact}
              exportedAsFact={exportedAsFact}
              onMakeFact={this._makeFact.bind(this)}
              isAnalyzedMetric={isAnalyzedMetric}
            />
          )}
        </div>
      </ToolTip>
    );
  }
}

export const MetricCard = connect(null)(UnconnectedMetricCard);
