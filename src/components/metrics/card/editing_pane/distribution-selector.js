import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom'
import $ from 'jquery'
import Icon from 'react-fa'
import NormalImage from 'assets/distribution-icons/normal.png'
import LogNormalImage from 'assets/distribution-icons/lognormal.png'
import ExponentialImage from 'assets/distribution-icons/exponential.png'
import PointImage from 'assets/distribution-icons/point.png'
import UniformImage from 'assets/distribution-icons/uniform.png'

class DistributionIcon extends Component{
  _handleSubmit() {
    this.props.onSubmit(this.props.type)
  }
  render() {
    return (
      <div
            className='ui button tinyhover-toggle DistributionIcon'
            onMouseDown={this._handleSubmit.bind(this)}
      >
        <img src={this.props.image}/>
      </div>
    )
  }
}

export default class DistributionSelector extends Component{
  render() {
    return (
      <div className='DistributionSelector'>
        <DistributionIcon type={'NORMAL'} image={NormalImage} onSubmit={this.props.onSubmit}/>
        <DistributionIcon type={'UNIFORM'} image={UniformImage} onSubmit={this.props.onSubmit}/>
        <DistributionIcon type={'EXPONENTIAL'} image={ExponentialImage} onSubmit={this.props.onSubmit}/>
        <DistributionIcon type={'POINT'} image={PointImage} onSubmit={this.props.onSubmit}/>
        <DistributionIcon type={'LOGNORMAL'} image={LogNormalImage} onSubmit={this.props.onSubmit}/>
      </div>
    )
  }
}
