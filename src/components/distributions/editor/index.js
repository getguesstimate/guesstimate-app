import React, {Component, PropTypes} from 'react'

import { connect } from 'react-redux';

import Histogram from 'gComponents/simulations/histogram'
import Icon from 'react-fa'
import $ from 'jquery'
import './style.css'

const PT = PropTypes
const DistributionInformation = [
  {name: 'point', description: 'An estimate at one point', fields: ['value']},
  {name: 'normal', description: 'A normal Distribution', fields: ['low', 'height']},
  {name: 'lognormal', description: 'A lognormal thing', fields: ['low', 'height']},
  {name: 'uniform', description: 'A lognormal thing', fields: ['low', 'height']},
  {name: 'power', description: 'A lognormal thing', fields: ['low', 'height']}
]

class HoverButton extends Component {
  handleMouseOver() {
    this.props.onHoverChange(this.props.name)
  }
  handleMouseOut() {
    this.props.onHoverChange(null)
  }
  handleClick() {
    this.props.onClick(this.props.name)
  }
  render() {
    let className = 'ui button'
    className = className + (this.props.isSelected ? ' primary' : '')
    console.log(className)
    return (
      <div className={className}
          onMouseOver={this.handleMouseOver.bind(this)}
          onMouseOut={this.handleMouseOut.bind(this)}
          onClick={this.handleClick.bind(this)}
      >
        <Icon name='gear'/> {this.props.name}
      </div>
    )
  }
}

export default class DistributionEditor extends Component {
  displayName: 'DistributionEditor'

  state = {
    hoveredDistribution: null,
    selectedDistribution: 'lognormal'
  }

  hovered(e) {
    this.setState({hoveredDistribution: e})
  }

  selected(e) {
    this.setState({selectedDistribution: e})
  }

  distributionType() {
    let showType = this.state.hoveredDistribution || this.state.selectedDistribution
    return DistributionInformation.find(e => e.name === showType)
  }

  render() {
    const distributionType = this.distributionType()
    return (
      <div className='row'>
        <div className='col-sm-4'>
          {['point', 'normal', 'lognormal', 'uniform'].map(e => {
            const isSelected = (e === this.state.selectedDistribution)
            return (
              <HoverButton onHoverChange={this.hovered.bind(this)} onClick={this.selected.bind(this)} name={e} isSelected={isSelected}/>
            )
          })}
        </div>
        <div className='col-sm-8'>
          <div className='ui form'>
            <RangeForm/>
          </div>
          <h3>{distributionType.name}</h3>
          {distributionType.description}
        </div>
      </div>
    );
  }
}

class RangeForm extends Component {
  render() {
    return (
      <div className='RangeForm'>
        <div className='row'>
          <div className='col-sm-5'>
            <div className='field'>
              <input type='text' name={'first'} ></input>
              <label> {'10th Percentile'} </label>
            </div>
          </div>
          <div className='col-sm-2 arrow'>
            <Icon name='arrow-circle-right'/>
          </div>
          <div className='col-sm-5'>
            <div className='field'>
              <input type='text' name={'second'} ></input>
              <label> {'90th Percentile'} </label>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
