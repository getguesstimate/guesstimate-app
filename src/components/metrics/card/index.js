import React, {Component} from 'react' 
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import Icon from 'react-fa'
import ReactDOM from 'react-dom'
import $ from 'jquery'

import {MetricModal} from 'gComponents/metrics/modal/index'
import DistributionEditor from 'gComponents/distributions/editor/index'
import MetricToolTip from './tooltip'
import ToolTip from 'gComponents/utility/tooltip/index'
import {MetricCardViewSection} from './MetricCardViewSection/index'
import SensitivitySection from './SensitivitySection/SensitivitySection'

import {hasMetricUpdated} from './updated'
import {removeMetrics, changeMetric} from 'gModules/metrics/actions'
import {changeGuesstimate} from 'gModules/guesstimates/actions'
import {analyzeMetricId, endAnalysis} from 'gModules/canvas_state/actions'
import {createFactFromMetric} from 'gModules/facts/actions'

import * as canvasStateProps from 'gModules/canvas_state/prop_type'
import {withReadableId} from 'lib/generateVariableNames/generateMetricReadableId'
import {shouldTransformName} from 'lib/generateVariableNames/nameToVariableName'

import {INTERMEDIATE, OUTPUT, INPUT, NOEDGE, relationshipType} from 'gEngine/graph'
import {makeURLsMarkdown, allPropsPresent, getClassName} from 'gEngine/utils'

import './style.css'

const relationshipClasses = {}
relationshipClasses[INTERMEDIATE] = 'intermediate'
relationshipClasses[OUTPUT] = 'output'
relationshipClasses[INPUT] = 'input'
relationshipClasses[NOEDGE] = 'noedge'

const ScatterTip = ({yMetric, xMetric}) => (
  <ToolTip size='LARGE'> <SensitivitySection yMetric={yMetric} xMetric={xMetric} size={'LARGE'}/> </ToolTip>
)

@connect(null, dispatch => bindActionCreators({
  changeMetric,
  changeGuesstimate,
  removeMetrics,
  analyzeMetricId,
  endAnalysis,
  createFactFromMetric,
}, dispatch))
export default class MetricCard extends Component {
  displayName: 'MetricCard'

  static propTypes = {
    canvasState: canvasStateProps.canvasState,
    changeMetric: PropTypes.func.isRequired,
    changeGuesstimate: PropTypes.func.isRequired,
    removeMetrics: PropTypes.func.isRequired,
    gridKeyPress: PropTypes.func.isRequired,
    inSelectedCell: PropTypes.bool.isRequired,
    metric: PropTypes.object.isRequired
  }

  state = {
    modalIsOpen: false,
    sidebarIsOpen: false,
  }

  shouldComponentUpdate(nextProps, nextState) {
    return hasMetricUpdated(this.props, nextProps) ||
      (this.state.modalIsOpen !== nextState.modalIsOpen) ||
      (this.state.sidebarIsOpen !== nextState.sidebarIsOpen)
  }

  _beginAnalysis() { this.props.analyzeMetricId(this._id()) }
  _endAnalysis() { this.props.endAnalysis() }

  focusFromDirection(dir) {
    if (dir === 'DOWN' || dir === 'RIGHT') { this._focusForm() }
    else { this.refs.MetricCardViewSection.focusName() }
  }

  componentWillUpdate(nextProps) {
    window.recorder.recordRenderStartEvent(this)
    if (this.props.inSelectedCell && !nextProps.inSelectedCell) { this._closeSidebar() }
    if (this.props.hovered && !nextProps.hovered) { this._closeSidebar() }
  }
  componentWillUnmount() { window.recorder.recordUnmountEvent(this) }

  componentDidUpdate(prevProps, prevState) {
    window.recorder.recordRenderStopEvent(this)

    const hasContent = _.result(this.refs, 'MetricCardViewSection.hasContent')
    const {inSelectedCell, selectedFrom} = this.props
    if (!inSelectedCell && this._isEmpty() && !hasContent && !this.state.modalIsOpen) {
      this.handleRemoveMetric()
    }
    if (!prevProps.inSelectedCell && inSelectedCell && !!selectedFrom) {
      this.focusFromDirection(selectedFrom)
    }

    if (this.state.modalIsOpen !== prevState.modalIsOpen){
      this.props.forceFlowGridUpdate()
    }
  }

  componentDidMount() {
    window.recorder.recordMountEvent(this)
    if (this.props.inSelectedCell && this._isEmpty()) {
      this.focusFromDirection(this.props.selectedFrom)
    }
  }

  openModal() { this.setState({modalIsOpen: true, sidebarIsOpen: false}) }
  closeModal() { this.setState({modalIsOpen: false}) }
  _toggleSidebar() { this.setState({sidebarIsOpen: (!this.state.sidebarIsOpen), modalIsOpen: false}) }

  _closeSidebar() {
    if (this.state.sidebarIsOpen) { this.setState({sidebarIsOpen: false}) }
  }

  _handleKeyDown(e) {
    if (e.target === ReactDOM.findDOMNode(this)) {
      if (e.keyCode == '13' && this.props.inSelectedCell) {
        e.preventDefault()
        e.stopPropagation()
        this.openModal()
      }
    }
  }

  _handleKeyPress(e) {
    if (e.target === ReactDOM.findDOMNode(this)) {
      this.props.gridKeyPress(e)
    }
    e.stopPropagation()
  }

  // TODO(matthew): Maybe use allPropsPresent
  _isEmpty() {
    return !(this._hasGuesstimate() || this._hasName() || this._hasDescription())
  }

  _hasName() {
    return !!this.props.metric.name
  }

  _hasDescription() {
    return !!_.get(this.props.metric, 'guesstimate.description')
  }

  _hasGuesstimate() {
    const has = (item) => !!_.get(this.props.metric, `guesstimate.${item}`)
    return (has('input') || has('data'))
  }

  _isTitle() { return this._hasName() && !this._hasGuesstimate() }

  onChangeMetricName(name) {
    if (name === _.get(this, 'props.metric.name')) { return }

    const metric = withReadableId({id: this._id(), name}, _.values(this.props.idMap))

    this.props.changeMetric(metric)
  }

  onChangeGuesstimateDescription(rawDescription) {
    const description = makeURLsMarkdown(rawDescription)
    this.props.changeGuesstimate(this._id(), {...this.props.metric.guesstimate, description})
  }

  handleRemoveMetric () { this.props.removeMetrics([this._id()]) }
  _id() { return this.props.metric.id }

  _focusForm() {
    _.result(this.refs, 'DistributionEditor.wrappedInstance.focus') }

  _handleMouseDown(e) {
    if (this._isFunctionInputSelectable(e) && !e.shiftKey) {
      $(window).trigger('functionMetricClicked', this.props.metric)
      // TODO(matthew): Why don't these stop the triggering of the flow grid cell?
      e.preventDefault()
      e.stopPropagation()
    }
  }

  _isSelectable(e) {
    const selectableEl = (e.target.parentElement.getAttribute('data-select') !== 'false')
    const notYetSelected = !this.props.inSelectedCell
    return (selectableEl && notYetSelected)
  }

  _isFunctionInputSelectable(e) {
    return this._isSelectable(e) && (this.props.canvasState.metricClickMode === 'FUNCTION_INPUT_SELECT')
  }

  _relationshipType() { return relationshipType(_.get(this, 'props.metric.edges')) }

  _className() {
    const {inSelectedCell, hovered, isInScreenshot} = this.props
    const relationshipClass = relationshipClasses[this._relationshipType()]
    const {canvasState: {metricCardView}} = this.props

    const titleView = !hovered && !inSelectedCell && this._isTitle()
    let className = inSelectedCell ? 'metricCard grid-item-focus' : 'metricCard'
    className += isInScreenshot ? ' display' : ''
    className += titleView ? ' titleView' : ''
    className += ' ' + relationshipClass
    className += ' ' + metricCardView
    return className
  }

  _shouldShowSimulation(metric) {
    const stats = _.get(metric, 'simulation.stats')
    return (stats && _.isFinite(stats.stdev) && (stats.length > 5))
  }

  _shouldShowSensitivitySection() {
    const {metric, analyzedMetric} = this.props
    return !!(analyzedMetric && !this._isAnalyzedMetric() && this._shouldShowSimulation(metric) && this._shouldShowSimulation(analyzedMetric))
  }

  _canBeAnalyzed() {
    const {metric} = this.props
    return this._shouldShowSimulation(metric)
  }

  _isAnalyzedMetric() {
    const {metric, analyzedMetric} = this.props
    return !!analyzedMetric && metric.id === analyzedMetric.id
  }

  _makeFact() { this.props.createFactFromMetric(this.props.organizationId, this.props.metric) }

  // If sidebar is expanded, we want to close it if anything else is clicked
  onMouseDown(e) {
    const isSidebarElement = (_.get(e, 'target.dataset.controlSidebar') === "true")
    if (this.state.sidebarIsOpen && !isSidebarElement) {
      this._toggleSidebar()
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
    } = this.props
    const {guesstimate, name} = metric
    const {metricClickMode} = canvasState
    const shouldShowSensitivitySection = this._shouldShowSensitivitySection()
    const shouldShowDistributionEditor = !!canvasState.expandedViewEnabled || inSelectedCell
    const isAnalyzedMetric = this._isAnalyzedMetric()

    const isFunction = _.get(metric, 'guesstimate.guesstimateType') === 'FUNCTION'
    const canBeMadeFact = shouldTransformName(name) && isFunction && canUseOrganizationFacts

    return (
      <div className='metricCard--Container'
        onKeyPress={this._handleKeyPress.bind(this)}
        onKeyDown={this._handleKeyDown.bind(this)}
        tabIndex='0'
      >
        <div
          className={this._className()}
          onMouseDown={this.onMouseDown.bind(this)}
        >
          {this.state.modalIsOpen &&
            <MetricModal
              metric={metric}
              organizationId={organizationId}
              canUseOrganizationFacts={canUseOrganizationFacts}
              metricClickMode={metricClickMode}
              closeModal={this.closeModal.bind(this)}
              organizationId={organizationId}
              canUseOrganizationFacts={canUseOrganizationFacts}
              onChangeGuesstimateDescription={this.onChangeGuesstimateDescription.bind(this)}
            />
          }

          <MetricCardViewSection
            canvasState={canvasState}
            metric={metric}
            inSelectedCell={inSelectedCell}
            onChangeName={this.onChangeMetricName.bind(this)}
            onToggleSidebar={this._toggleSidebar.bind(this)}
            jumpSection={this._focusForm.bind(this)}
            onMouseDown={this._handleMouseDown.bind(this)}
            ref='MetricCardViewSection'
            isTitle={this._isTitle()}
            isInScreenshot={isInScreenshot}
            connectDragSource={connectDragSource}
            idMap={idMap}
            analyzedMetric={analyzedMetric}
            showSensitivitySection={shouldShowSensitivitySection}
            connectDragSource={connectDragSource}
            heightHasChanged={forceFlowGridUpdate}
            hovered={hovered}
            onReturn={this.props.onReturn}
            onTab={this.props.onTab}
            exportedAsFact={exportedAsFact}
          />

          {shouldShowDistributionEditor && !this.state.modalIsOpen &&
            <div className='section editing'>
              <DistributionEditor
                guesstimate={metric.guesstimate}
                inputMetrics={metric.edges.inputMetrics}
                metricClickMode={metricClickMode}
                metricId={metric.id}
                organizationId={organizationId}
                canUseOrganizationFacts={canUseOrganizationFacts}
                jumpSection={() => {this.refs.MetricCardViewSection.focusName()}}
                onOpen={this.openModal.bind(this)}
                ref='DistributionEditor'
                size='small'
                onReturn={this.props.onReturn}
                onTab={this.props.onTab}
              />
            </div>
          }
        </div>
        {hovered && !inSelectedCell && !shouldShowSensitivitySection && <MetricToolTip guesstimate={guesstimate}/>}
        {hovered && !inSelectedCell && shouldShowSensitivitySection &&
          <ScatterTip yMetric={analyzedMetric} xMetric={metric}/>
        }
        {inSelectedCell && this.state.sidebarIsOpen &&
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
        }
      </div>
    )
  }
}

const MetricSidebar = ({
  onOpenModal,
  onBeginAnalysis,
  onEndAnalysis,
  canBeMadeFact,
  exportedAsFact,
  onMakeFact,
  onRemoveMetric,
  showAnalysis,
  isAnalyzedMetric
}) => (
  <div className='MetricSidebar'>
    <MetricSidebarItem
      icon={<Icon name='expand'/>}
      name={'Expand'}
      onClick={onOpenModal}
    />
    {showAnalysis && !isAnalyzedMetric &&
      <MetricSidebarItem
        icon={<Icon name='bar-chart'/>}
        name={'Sensitivity'}
        onClick={onBeginAnalysis}
      />
    }
    {showAnalysis && isAnalyzedMetric &&
      <MetricSidebarItem
        className='analyzing'
        icon={<Icon name='close'/>}
        name={'Sensitivity'}
        onClick={onEndAnalysis}
      />
    }
    {canBeMadeFact && !exportedAsFact &&
      <MetricSidebarItem
        icon={<i className='ion-ios-redo'/>}
        name={'Export'}
        onClick={onMakeFact}
      />
    }
    <MetricSidebarItem
      icon={<Icon name='trash'/>}
      name={'Delete'}
      onClick={onRemoveMetric}
    />
  </div>
)

const MetricSidebarItem = ({className, onClick, icon, name}) => (
  <a
    href='#'
    className={`MetricSidebarItem ${className && className}`}
    onMouseDown={onClick}
  >
    <span className='MetricSidebarItem--icon'>
      {icon}
    </span>
    <span className='MetricSidebarItem--name'>
      {name}
    </span>
  </a>
)
