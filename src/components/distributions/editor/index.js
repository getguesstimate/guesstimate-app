import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { createGuesstimateForm, changeGuesstimateForm, saveGuesstimateForm } from 'gModules/guesstimate_form/actions'
import { changeMetricClickMode } from 'gModules/canvas_state/actions'
import * as guesstimator from 'lib/guesstimator/index.js'
import './style.css'
import TextForm from './TextForm/TextForm.js'
import DataForm from './DataForm/DataForm.js'

function select(state) {
  return {
    guesstimateForm: state.guesstimateForm
  }
}

@connect(select, null, null, {withRef: true})
export default class GuesstimateForm extends Component{
  displayName: 'GuesstimateForm'
  static propTypes = {
    dispatch: PropTypes.func,
    guesstimateForm: PropTypes.object.isRequired,
    metricId: PropTypes.string.isRequired,
    metricFocus: PropTypes.func.isRequired,
    size: PropTypes.string,
    onOpen: PropTypes.func
  }

  static defaultProps = {
    metricFocus: () => { }
  }

  componentWillMount() { this.props.dispatch(createGuesstimateForm(this.props.metricId)) }
  focus() { this.refs.TextForm.focus() }
  _handleChange(params) { this.props.dispatch(changeGuesstimateForm(params)) }
  _handleSave(params) {
    if (!_.isEmpty(params)) {this._handleChange(params)}
    this.props.dispatch(saveGuesstimateForm())
  }
  _changeMetricClickMode(newMode) { this.props.dispatch(changeMetricClickMode(newMode)) }
  _addDefaultData() { this._handleSave({guesstimateType: 'DATA', data:[1,2,3], input: null}) }

  render () {
    const {size, guesstimateForm, onOpen} = this.props
    const isLarge = (size === 'large')
    const hasData = !!guesstimateForm.data

    let formClasses = 'GuesstimateForm'
    formClasses += isLarge ? ' large' : ''

    return (
    <div className={formClasses}>
        {hasData &&
          <DataForm
            data={guesstimateForm.data}
            size={size}
            onSave={this._handleSave.bind(this)}
            onOpen={onOpen}
          />
        }
        {!hasData &&
          <TextForm
            guesstimateForm={guesstimateForm}
            onChange={this._handleChange.bind(this)}
            onSave={this._handleSave.bind(this)}
            onChangeClickMode={this._changeMetricClickMode.bind(this)}
            onAddDefaultData={this._addDefaultData.bind(this)}
            onEscape={this.props.metricFocus}
            size={size}
            ref='TextForm'
          />
        }
      </div>
    )
  }
}
