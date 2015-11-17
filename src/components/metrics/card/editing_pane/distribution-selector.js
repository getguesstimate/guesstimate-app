import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom'
import $ from 'jquery'
import Icon from 'react-fa'

export default class DistributionSelector extends Component{
  render() {
    return (
      <div>
        <div
              className='ui button tinyhover-toggle'
        >
          <Icon name='bar-chart'/>
        </div>

        <div
              className='ui button tinyhover-toggle'
        >
          <Icon name='line-chart'/>
        </div>

        <div
              className='ui button tinyhover-toggle'
        >
          <Icon name='pie-chart'/>
        </div>
      </div>
    )
  }
}
