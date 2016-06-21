import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import {TextForm} from './TextForm/TextForm'

import {changeGuesstimate} from 'gModules/guesstimates/actions'
import {changeMetricClickMode} from 'gModules/canvas_state/actions'

import {Guesstimator} from 'lib/guesstimator/index'

import './style.css'

@connect(null, null, null, {withRef: true})
export class CalculatorGuesstimateForm extends Component{
  displayName: 'Guesstimate'
  static propTypes = {
    dispatch: PropTypes.func,
    guesstimate: PropTypes.object,
    metricId: PropTypes.string.isRequired,
    metricFocus: PropTypes.func.isRequired,
    size: PropTypes.string,
    hideGuesstimateType: PropTypes.bool,
    skipSave: PropTypes.bool,
    onOpen: PropTypes.func,
  }

  static defaultProps = {
    metricFocus: () => { },
    hideGuesstimateType: false,
    skipSave: false,
  }

  componentDidUpdate(prevProps) {
    const {guesstimate: {input, guesstimateType}} = this.props
    const sameInput = input === prevProps.guesstimate.input
    if (!sameInput && prevProps.guesstimate.guesstimateType === 'FUNCTION' && guesstimateType !== 'FUNCTION') {
      this._changeMetricClickMode('')
    }
  }

  focus() { this.refs.TextForm.focus() }

  _guesstimateType(changes) {
    return Guesstimator.parse({...this.props.guesstimate, ...changes})[1].samplerType().referenceName
  }

  changeGuesstimate(changes, runSims, saveToServer) {
    this.props.dispatch(changeGuesstimate(
      this.props.metricId,
      {...this.props.guesstimate, ...changes},
      runSims,
      !this.props.skipSaves && saveToServer
    ))
  }

  changeDescriptionAndSave(description) {
    this.changeGuesstimate({description}, false, true)
  }
  changeInput(input) {
    const guesstimateType = this._guesstimateType({input})
    this.changeGuesstimate({data: null, input, guesstimateType}, true, false)
    if (guesstimateType === 'FUNCTION' && this.props.guesstimateType !== 'FUNCTION') {
      this._changeMetricClickMode('FUNCTION_INPUT_SELECT')
    }
  }
  changeGuesstimateTypeAndSave(guesstimateType) {
    this.changeGuesstimate({guesstimateType}, true, true)
  }
  addDataAndSave(data) {
    this.changeGuesstimate({guesstimateType: 'DATA', data, input: null}, true, true)
  }
  saveToServer() {
    this.changeGuesstimate({}, false, true)
  }

  _changeMetricClickMode(newMode) { this.props.dispatch(changeMetricClickMode(newMode)) }

  handleReturn(shifted) {
    if (shifted) {
      this.props.jumpSection()
    } else {
      this.props.onReturn()
    }
    return true
  }

  handleTab(shifted) {
    if (shifted) {
      this.props.jumpSection()
    } else {
      this.props.onTab()
    }
    return true
  }

  render () {
    const {size, guesstimate, onOpen, errors, hideGuesstimateType, metricId} = this.props
    if(guesstimate.metric !== metricId) { return false }

    const isLarge = (size === 'large')

    return (
      <div className={'Guesstimate'}>
        <TextForm
          hideGuesstimateType={hideGuesstimateType}
          guesstimate={guesstimate}
          onChangeInput={this.changeInput.bind(this)}
          onSave={this.saveToServer.bind(this)}
          size={size}
          hasErrors={errors && (errors.length !== 0)}
        />
      </div>
    )
  }
}
