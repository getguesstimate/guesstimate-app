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
    let classes = 'ui button tinyhover-toggle DistributionIcon'
    classes += this.props.isSelected ? ' selected' : ''
    return (
      <div
            className={classes}
            onMouseDown={this._handleSubmit.bind(this)}
      >
        <img src={this.props.icon}/>
      </div>
    )
  }
}

export default class DistributionSelector extends Component{
  render() {
    const {selected} = this.props
    return (
      <div className='DistributionSelector'>
        <hr/>
        <div className='DistributionList'>
          {['NORMAL', 'UNIFORM', 'LOGNORMAL'].map(type => {
            const isSelected = (selected === type)
            const icon = guesstimator.find(type).icon
            return (
              <DistributionIcon
                type={type}
                onSubmit={this.props.onSubmit}
                isSelected={isSelected}
                icon={icon}
              />
            )
          })}
        </div>
      </div>
    )
  }
}
