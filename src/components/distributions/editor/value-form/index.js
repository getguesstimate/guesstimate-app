import React, {Component, PropTypes} from 'react'
import PointForm from './point-form.js'
import RangeForm from './range-form.js'

const PT = PropTypes;

export default class ValueForm extends Component {
  static propTypes = {
    guesstimateType: PT.object.isRequired,
    guesstimate: PT.object.isRequired,
    onChange: PT.func.isRequired,
  }

  subForm() {
    const type = (this.props.guesstimateType === 'POINT') ? PointForm : RangeForm
    return type
  }
  render() {
    const isPoint = (this.props.guesstimateType.name === 'POINT')
    return (
      <div className='ui form ValueForm'>
        {isPoint &&
          <PointForm
              guesstimate={this.props.guesstimate}
              guesstimateType={this.props.guesstimateType}
              onChange={this.props.onChange}
              ref='subForm'
          />
        }
        {!isPoint &&
          <RangeForm
              guesstimate={this.props.guesstimate}
              guesstimateType={this.props.guesstimateType}
              onChange={this.props.onChange}
              ref='subForm'
          />
        }
      </div>
    )
  }
}

