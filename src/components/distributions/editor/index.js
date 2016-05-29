import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import TextForm from './TextForm/TextForm'
import DataForm from './DataForm/DataForm'

import {createGuesstimateForm, changeGuesstimateForm, saveGuesstimateForm} from 'gModules/guesstimate_form/actions'
import {changeMetricClickMode} from 'gModules/canvas_state/actions'

import './style.css'

@connect()
export default class GuesstimateForm extends Component{
  displayName: 'GuesstimateForm'
  static propTypes = {
    dispatch: PropTypes.func,
    guesstimate: PropTypes.object,
    metricId: PropTypes.string.isRequired,
    metricFocus: PropTypes.func.isRequired,
    size: PropTypes.string,
    onOpen: PropTypes.func,
  }

  static defaultProps = {
    metricFocus: () => { }
  }

  componentWillMount() {
    this.props.dispatch(createGuesstimateForm(this.props.metricId))
  }

  focus() { this.refs.TextForm.focus() }
  _handleChange(params) { this.props.dispatch(changeGuesstimateForm(params)) }
  _handleSave(params) {
    if (!_.isEmpty(params)) {this._handleChange(params)}
    this.props.dispatch(saveGuesstimateForm())
  }
  _changeMetricClickMode(newMode) { this.props.dispatch(changeMetricClickMode(newMode)) }
  _addDefaultData() { this._handleSave({guesstimateType: 'DATA', data:[1,2,3], input: null}) }

  render () {
    const {size, guesstimate, onOpen, errors} = this.props
    if(guesstimate.metric !== this.props.metricId) { return false }

    const isLarge = (size === 'large')
    const hasData = !!guesstimate.data

    let formClasses = 'GuesstimateForm'
    formClasses += isLarge ? ' large' : ''

    return (
      <div className={formClasses}>
        {hasData &&
          <DataForm
            data={guesstimate.data}
            size={size}
            onSave={this._handleSave.bind(this)}
            onOpen={onOpen}
          />
        }
        {!hasData &&
          <TextForm
            guesstimate={guesstimate}
            onChange={this._handleChange.bind(this)}
            onSave={this._handleSave.bind(this)}
            onChangeClickMode={this._changeMetricClickMode.bind(this)}
            onAddDefaultData={this._addDefaultData.bind(this)}
            onEscape={this.props.metricFocus}
            size={size}
            hasErrors={errors && (errors.length !== 0)}
            ref='TextForm'
          />
        }
      </div>
    )
  }
}
