import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom'
import $ from 'jquery'
import Icon from 'react-fa'
import NormalImage from 'assets/distribution-icons/normal.png'
import LogNormalImage from 'assets/distribution-icons/lognormal.png'
import ExponentialImage from 'assets/distribution-icons/exponential.png'
import PointImage from 'assets/distribution-icons/point.png'
import UniformImage from 'assets/distribution-icons/uniform.png'
import * as guesstimator from 'lib/guesstimator/index.js'

class DistributionIcon extends Component{
  _handleSubmit() {
    this.props.onSubmit(this.props.type)
  }
  render() {
    const guesstimateType = guesstimator.find(this.props.type)
    return (
      <div
            className='ui button tinyhover-toggle DistributionIcon'
            onMouseDown={this._handleSubmit.bind(this)}
      >
        <img src={guesstimateType.icon}/>
      </div>
    )
  }
}

export default class DistributionSelector extends Component{
  render() {
    return (
      <div className='DistributionSelector'>
        <DistributionIcon type={'NORMAL'} onSubmit={this.props.onSubmit}/>
        <DistributionIcon type={'UNIFORM'} onSubmit={this.props.onSubmit}/>
        <DistributionIcon type={'LOGNORMAL'} onSubmit={this.props.onSubmit}/>
      </div>
    )
  }
}
