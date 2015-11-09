import React, {Component, PropTypes} from 'react'
import PointForm from './point-form.js'
import RangeForm from './range-form.js'

const PT = PropTypes;

export default class ValueForm extends Component {
  static propTypes = {
    distributionType: PT.object.isRequired,
    onChange: PT.func.isRequired,
  }

  subForm() {
    const type = (this.props.distributionType === 'point') ? PointForm : RangeForm
    return type
  }
  render() {
    const isPoint = (this.props.distributionType.name === 'point')
    return (
      <div className='ui form ValueForm'>
        {isPoint &&
          <PointForm
              distributionType={this.props.distributionType}
              onChange={this.props.onChange}
              ref='subForm'
          />
        }
        {!isPoint &&
          <RangeForm
              distributionType={this.props.distributionType}
              onChange={this.props.onChange}
              ref='subForm'
          />
        }
      </div>
    )
  }
}

