import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";

import Icon from "gComponents/react-fa-patched";
import $ from "jquery";
import ReactDOM from "react-dom";

import MetricToolTip from "./tooltip";
import { hasMetricUpdated } from "./updated";

import DistributionEditor, {
  UnwrappedDistributionEditor,
} from "gComponents/distributions/editor/index";
import { MetricModal } from "gComponents/metrics/modal/index";
import ToolTip from "gComponents/utility/tooltip/index";
import { MetricCardViewSection } from "./MetricCardViewSection/index";
import SensitivitySection from "./SensitivitySection/SensitivitySection";

import { analyzeMetricId, endAnalysis } from "gModules/canvas_state/actions";
import { createFactFromMetric } from "gModules/facts/actions";
import { changeGuesstimate } from "gModules/guesstimates/actions";
import { changeMetric, removeMetrics } from "gModules/metrics/actions";

import { withReadableId } from "lib/generateVariableNames/generateMetricReadableId";
import { shouldTransformName } from "lib/generateVariableNames/nameToVariableName";

import { GridContext } from "gComponents/lib/FlowGrid/filled-cell";
import { CanvasState } from "gComponents/lib/FlowGrid/types";
import {
  INPUT,
  INTERMEDIATE,
  NOEDGE,
  OUTPUT,
  relationshipType,
} from "gEngine/graph";
import { makeURLsMarkdown } from "gEngine/utils";
import { AppDispatch } from "gModules/store";

const relationshipClasses = {};
relationshipClasses[INTERMEDIATE] = "intermediate";
relationshipClasses[OUTPUT] = "output";
relationshipClasses[INPUT] = "input";
relationshipClasses[NOEDGE] = "noedge";

const ScatterTip = ({ yMetric, xMetric }) => (
  <ToolTip size="LARGE">
    {" "}
    <SensitivitySection yMetric={yMetric} xMetric={xMetric} size="LARGE" />{" "}
  </ToolTip>
);

type Props = {
  canvasState: CanvasState;
  isInScreenshot: boolean;
  metric: any; // FIXME
  organizationId?: string | number;
  canUseOrganizationFacts: boolean;
  exportedAsFact: boolean;
  idMap: object;
  analyzedMetric: any;
} & GridContext & { dispatch: AppDispatch };

type State = {
  modalIsOpen: boolean;
  sidebarIsOpen: boolean;
};

class MetricCard extends Component<Props, State> {
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

  focusFromDirection(dir) {
    if (dir === "DOWN" || dir === "RIGHT") {
      this._focusForm();
    } else {
      this.viewRef.current?.focusName();
    }
  }

  componentWillUpdate(nextProps) {
    window.recorder.recordRenderStartEvent(this);
    if (this.props.inSelectedCell && !nextProps.inSelectedCell) {
      this._closeSidebar();
    }
    if (this.props.hovered && !nextProps.hovered) {
      this._closeSidebar();
    }
  }
  componentWillUnmount() {
    window.recorder.recordUnmountEvent(this);
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    window.recorder.recordRenderStopEvent(this);

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
    if (!prevProps.inSelectedCell && inSelectedCell && !!selectedFrom) {
      this.focusFromDirection(selectedFrom);
    }

    if (this.state.modalIsOpen !== prevState.modalIsOpen) {
      this.props.forceFlowGridUpdate();
    }
  }

  componentDidMount() {
    window.recorder.recordMountEvent(this);
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
    return !!_.get(this.props.metric, "guesstimate.description");
  }

  _hasGuesstimate() {
    const has = (item) => !!_.get(this.props.metric, `guesstimate.${item}`);
    return has("input") || has("data");
  }

  _isTitle() {
    return this._hasName() && !this._hasGuesstimate();
  }

  onChangeMetricName(name) {
    if (name === _.get(this, "props.metric.name")) {
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
      $(window).trigger("functionMetricClicked", this.props.metric);
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
    return relationshipType(_.get(this, "props.metric.edges"));
  }

  _className() {
    const { inSelectedCell, hovered, isInScreenshot } = this.props;
    const relationshipClass = relationshipClasses[this._relationshipType()];
    const {
      canvasState: { metricCardView },
    } = this.props;

    const titleView = !hovered && !inSelectedCell && this._isTitle();
    let className = inSelectedCell
      ? "metricCard grid-item-focus"
      : "metricCard";
    className += isInScreenshot ? " display" : "";
    className += titleView ? " titleView" : "";
    className += " " + relationshipClass;
    className += " " + metricCardView;
    return className;
  }

  _shouldShowSimulation(metric) {
    const stats = _.get(metric, "simulation.stats");
    return Boolean(stats && _.isFinite(stats.stdev) && stats.length > 5);
  }

  _shouldShowSensitivitySection() {
    const { metric, analyzedMetric } = this.props;
    return !!(
      analyzedMetric &&
      !this._isAnalyzedMetric() &&
      this._shouldShowSimulation(metric) &&
      this._shouldShowSimulation(analyzedMetric)
    );
  }

  _canBeAnalyzed() {
    const { metric } = this.props;
    return this._shouldShowSimulation(metric);
  }

  _isAnalyzedMetric() {
    const { metric, analyzedMetric } = this.props;
    return !!analyzedMetric && metric.id === analyzedMetric.id;
  }

  _makeFact() {
    this.props.dispatch(
      createFactFromMetric(this.props.organizationId, this.props.metric)
    );
  }

  // If sidebar is expanded, we want to close it if anything else is clicked
  onMouseDown(e: React.MouseEvent) {
    const isSidebarElement =
      _.get(e, "target.dataset.controlSidebar") === "true";
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
    const { guesstimate, name } = metric;
    const { metricClickMode } = canvasState;
    const shouldShowSensitivitySection = this._shouldShowSensitivitySection();
    const shouldShowDistributionEditor =
      !!canvasState.expandedViewEnabled || inSelectedCell;
    const isAnalyzedMetric = this._isAnalyzedMetric();

    const isFunction =
      _.get(metric, "guesstimate.guesstimateType") === "FUNCTION";
    const canBeMadeFact =
      shouldTransformName(name) && isFunction && canUseOrganizationFacts;

    return (
      <div
        className="metricCard--Container"
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
        {hovered && !inSelectedCell && !shouldShowSensitivitySection && (
          <MetricToolTip guesstimate={guesstimate} />
        )}
        {hovered && !inSelectedCell && shouldShowSensitivitySection && (
          <ScatterTip yMetric={analyzedMetric} xMetric={metric} />
        )}
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
    );
  }
}

export default connect(null)(MetricCard);

const MetricSidebar: React.FC<{
  onOpenModal(): void;
  onRemoveMetric(): void;
  showAnalysis: boolean;
  onBeginAnalysis(): void;
  onEndAnalysis(): void;
  canBeMadeFact: boolean;
  exportedAsFact: boolean;
  onMakeFact(): void;
  isAnalyzedMetric: boolean;
}> = ({
  onOpenModal,
  onBeginAnalysis,
  onEndAnalysis,
  canBeMadeFact,
  exportedAsFact,
  onMakeFact,
  onRemoveMetric,
  showAnalysis,
  isAnalyzedMetric,
}) => (
  <div className="MetricSidebar">
    <MetricSidebarItem
      icon={<Icon name="expand" />}
      name="Expand"
      onClick={onOpenModal}
    />
    {showAnalysis && !isAnalyzedMetric && (
      <MetricSidebarItem
        icon={<Icon name="bar-chart" />}
        name="Sensitivity"
        onClick={onBeginAnalysis}
      />
    )}
    {showAnalysis && isAnalyzedMetric && (
      <MetricSidebarItem
        className="analyzing"
        icon={<Icon name="close" />}
        name={"Sensitivity"}
        onClick={onEndAnalysis}
      />
    )}
    {canBeMadeFact && !exportedAsFact && (
      <MetricSidebarItem
        icon={<i className="ion-ios-redo" />}
        name="Export"
        onClick={onMakeFact}
      />
    )}
    <MetricSidebarItem
      icon={<Icon name="trash" />}
      name="Delete"
      onClick={onRemoveMetric}
    />
  </div>
);

const MetricSidebarItem: React.FC<{
  className?: string;
  onClick: () => void;
  icon: React.ReactElement;
  name: string;
}> = ({ className, onClick, icon, name }) => (
  <a
    href="#"
    className={`MetricSidebarItem ${className && className}`}
    onMouseDown={onClick}
  >
    <span className="MetricSidebarItem--icon">{icon}</span>
    <span className="MetricSidebarItem--name">{name}</span>
  </a>
);
