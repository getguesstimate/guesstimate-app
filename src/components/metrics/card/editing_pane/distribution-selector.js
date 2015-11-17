import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom'
import $ from 'jquery'
import Icon from 'react-fa'

export default class DistributionSelector extends Component{
  _handleSubmit(e) {
    this.props.onSubmit(e)
  }

  render() {
    return (
      <div>
        <div
              className='ui button tinyhover-toggle'
              onMouseDown={() => {this._handleSubmit.bind(this)('NORMAL')}}
        >
          <Icon name='bar-chart'/>
        </div>

        <div
              className='ui button tinyhover-toggle'
              onMouseDown={() => {this._handleSubmit.bind(this)('UNIFORM')}}
        >
          <Icon name='line-chart'/>
        </div>

        <div
              className='ui button tinyhover-toggle'
              onMouseDown={this._handleSubmit.bind(this)}
        >
          <Icon name='pie-chart'/>
        </div>
      </div>
    )
  }
}
