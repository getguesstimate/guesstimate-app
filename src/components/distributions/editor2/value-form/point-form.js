import React, {Component, PropTypes} from 'react'
import $ from 'jquery'

const PT = PropTypes;

export default class PointForm extends Component {
  static propTypes = {
    guesstimate: PT.object.isRequired,
    onChange: PT.func.isRequired,
    value: PT.number,
  }

  values() {
    let results = {}
    $(this.refs.el).find('input').map(function() { results[this.name] = $(this).val() })
    return results
  }
  onChange() {
    this.props.onChange(this.values())
  }
  render() {
    return (
      <div className='PointForm' ref='el'>
        <div className='row primary'>
          <div className='col-sm-2'>
          </div>
          <div className='col-sm-8'>
            <div className='field'>
              <input
                  defaultValue={this.props.guesstimate.value}
                  name='value'
                  onChange={this.onChange.bind(this)}
                  placeholder='value'
                  type='text'
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
