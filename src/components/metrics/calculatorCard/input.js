import React, {Component} from 'react'

import ReactDOM from 'react-dom'
import $ from 'jquery'

import DistributionEditor from 'gComponents/distributions/editor/index'
import MetricCardViewSection from './MetricCardViewSection/index'

import './style.css'

export class CalculatorInputCard extends Component {
  displayName: 'MetricCard'

  _isEmpty(){
    return !(this._hasGuesstimate() || this._hasName() || this._hasDescription())
  }

  _hasName(){
    return !!this.props.metric.name
  }

  _hasDescription(){
    return !!_.get(this.props.metric, 'guesstimate.description')
  }

  _hasGuesstimate(){
    const has = (item) => !!_.get(this.props.metric, `guesstimate.${item}`)
    return (has('input') || has('data'))
  }

  _isTitle(){
    return (this._hasName() && !this._hasGuesstimate())
  }

  _id(){
    return this.props.metric.id
  }

  focus() {
    $(this.refs.dom).focus();
  }

  _focusForm() {
    const editorRef = _.get(this.refs, 'DistributionEditor.refs.wrappedInstance')
    editorRef && editorRef.focus()
  }

  _className() {
    const {metric} = this.props

    const titleView = this._isTitle()
    let className = 'metricCard noedge'
    className += titleView ? ' titleView' : ''
    return className
  }

  _errors() {
    if (this.props.isTitle){ return [] }
    let errors = _.get(this.props.metric, 'simulation.sample.errors')
    return errors ? errors.filter(e => !!e) : []
  }

  _shouldShowSimulation(metric) {
    const stats = _.get(metric, 'simulation.stats')
    return (stats && _.isFinite(stats.stdev) && (stats.length > 5))
  }

  render() {
    const {metric} = this.props
    const {guesstimate} = metric
    const errors = this._errors()

    return (
      <div className='metricCard--Container'
        ref='dom'
        tabIndex='0'
      >
        <div className={this._className()}>
          <MetricCardViewSection
            metric={metric}
            jumpSection={this._focusForm.bind(this)}
            ref='MetricCardViewSection'
            isTitle={this._isTitle()}
            onEscape={this.focus.bind(this)}
          />

          <div className='section editing'>
            <DistributionEditor
              guesstimate={metric.guesstimate}
              metricId={metric.id}
              metricFocus={this.focus.bind(this)}
              jumpSection={() => {this.refs.MetricCardViewSection.focusName()}}
              ref='DistributionEditor'
              size='small'
              errors={errors}
            />
          </div>
        </div>
      </div>
    );
  }
}
