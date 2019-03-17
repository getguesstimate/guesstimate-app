import React, {Component} from 'react'
import PropTypes from 'prop-types'

import ReactDOM from 'react-dom'
import ReactTooltip from 'react-tooltip'

import {Guesstimator} from 'lib/guesstimator/index'

import {getClassName} from 'gEngine/utils'

import * as elev from 'servers/elev/index'

// We use onMouseUp to make sure that the onMouseUp
// does not get called once another metric is underneath

const ReactTooltipParams = {class: 'header-action-tooltip', delayShow: 0, delayHide: 0, place: 'top', effect: 'solid'}

const Descriptions = {
  'LOGNORMAL': {
    name: 'Lognormal'
  },
  'NORMAL': {
    name: 'Normal'
  },
  'UNIFORM': {
    name: 'Uniform'
  }
}

const DistributionIcon = ({isSelected, isDisabled, type, icon, onSubmit}) => (
  <div
    className={getClassName(
      'ui',
      'button',
      'tinyhover-toggle',
      'DistributionIcon',
      isSelected ? 'selected' : null,
      isDisabled ? 'disabled' : null,
    )}
    onClick={() => onSubmit(type)}
    data-tip
    data-for={type}
  >
    <ReactTooltip {...ReactTooltipParams} id={type}> {Descriptions[type].name} </ReactTooltip>
    <img src={icon}/>
  </div>
)

export class DistributionSelector extends Component{
  static defaultProps = {
    disabledTypes: [],
  }

  _handleShowMore() {
    elev.open(elev.ADDITIONAL_DISTRIBUTIONS)
  }

  render() {
    const {selected, disabledTypes} = this.props
    return (
      <div className='DistributionSelector'>
        <hr/>
        <a className='more-distributions' onClick={this._handleShowMore.bind(this)}> More </a>
        <div className='DistributionList'>
          {['LOGNORMAL', 'NORMAL', 'UNIFORM'].map(type => (
            <DistributionIcon
              type={type}
              onSubmit={this.props.onSubmit}
              isSelected={selected === type}
              isDisabled={disabledTypes.includes(type)}
              icon={Guesstimator.samplerTypes.find(type).icon}
              key={type}
            />
          ))}
        </div>
      </div>
    )
  }
}
