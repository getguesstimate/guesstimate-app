import React, {Component, PropTypes} from 'react';
import * as elev from 'server/elev/index.js'
import Icon from 'react-fa'

export default class GuesstimateTypeIcon extends Component{
  displayName: 'GuesstimateTypeIcon'

  _handleShowInfo() {
    elev.open(elev.GUESSTIMATE_TYPES)
  }

  _handleMouseDown() {
    if (this.props.guesstimateType.isRangeDistribution){
      this.props.toggleDistributionSelector()
    }
  }

  render() {
    const {guesstimateType} = this.props
    if (!guesstimateType){ return (false) }
    const {isRangeDistribution, icon} = guesstimateType
    const showIcon = guesstimateType && guesstimateType.icon

    let className='DistributionSelectorToggle DistributionIcon'
    className += isRangeDistribution ? ' button' : ''
    if (showIcon) {
      return(
        <div
            className={className}
            onMouseDown={this._handleMouseDown.bind(this)}
        >
          <img src={icon}/>
        </div>
      )
    } else {
      return (
        <div className='GuesstimateTypeQuestion' onMouseDown={this._handleShowInfo.bind(this)}>
          <Icon name='question-circle'/>
        </div>
      )
    }
  }
}
