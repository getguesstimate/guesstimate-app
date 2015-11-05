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
    className = className + (this.props.isSelected ? ' black' : '')
    return (
      <div className={className}
          onMouseOver={this.handleMouseOver.bind(this)}
          onMouseOut={this.handleMouseOut.bind(this)}
          onClick={this.handleClick.bind(this)}
      >
        {this.props.name}
      </div>
    )
  }
}

export default class DistributionEditor extends Component {
  displayName: 'DistributionEditor'

  state = {
    hoveredDistribution: null,
    distribution: {type: 'lognormal'}
  }

  hovered(e) {
    this.setState({hoveredDistribution: e})
  }

  selected(e) {
    this.setState({selectedDistribution: e})
    const newDistribution = Object.assign(this.state.distribution, {type: e})
    this.setState(newDistribution)
  }

  distributionType() {
    let showType = this.state.hoveredDistribution || this.state.distribution.type
    return DistributionInformation.find(e => e.name === showType)
  }

  _onFieldChange(values) {
    const newDistribution = Object.assign(this.state.distribution, values)
    this.setState(newDistribution)
  }

  render() {
    const distributionType = this.distributionType()
    return (
      <div className='DistributionEditor'>
        <div className='row'>
          <div className='col-sm-12'>
            <div className='four ui attached buttons'>
              {['point', 'normal', 'lognormal', 'uniform'].map(e => {
                const isSelected = (e === this.state.distribution.type)
                return (
                  <HoverButton onHoverChange={this.hovered.bind(this)} onClick={this.selected.bind(this)} name={e} isSelected={isSelected} key={e}/>
                )
              })}
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-sm-12'>
            <ValueForm distributionType={distributionType} onChange={this._onFieldChange.bind(this)}/>
          </div>
        </div>
        <div className='row'>
          <div className='col-sm-12 actions'>
            <div className='ui button green large'>{'Save'}</div>
            <div className='ui button large'><Icon name='close'/></div>
          </div>
        </div>
      </div>
    );
  }
}

class ValueForm extends Component {
  subForm() {
    const type = (this.props.distributionType === 'point') ? PointForm : RangeForm
    return type
  }
  render() {
    const isPoint = (this.props.distributionType.name === 'point')
    return (
      <div className='ui form ValueForm'>
        { isPoint &&
          <PointForm ref='subForm' onChange={this.props.onChange} distributionType={this.props.distributionType}/>
        }
        { !isPoint &&
          <RangeForm ref='subForm' onChange={this.props.onChange} distributionType={this.props.distributionType}/>
        }
      </div>
    )
  }
}

class PointForm extends Component {
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
              <input onChange={this.onChange.bind(this)} name='value' type='text' placeholder='value'></input>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

class RangeForm extends Component {
  values() {
    let results = {}
    $(this.refs.el).find('input').map(function() { results[this.name] = $(this).val() })
    return results
  }
  onChange() {
    this.props.onChange(this.values())
  }
  render() {
    const hasTails = (this.props.distributionType.name !== 'uniform')
    return (
      <div className='RangeForm' ref='el'>
        <div className='row primary'>
          <div className='col-sm-5'>
            <div className='field'>
              <input onChange={this.onChange.bind(this)} ref='low' name='low' type='text' placeholder='low'></input>
              {hasTails &&
                <label> {'10th Percentile'} </label>
              }
            </div>
          </div>
          <div className='col-sm-2 arrow'>
            <Icon name='arrow-circle-right'/>
          </div>
          <div className='col-sm-5'>
            <div className='field'>
              <input onChange={this.onChange.bind(this)} ref='high' name='high' type='text' placeholder='high'></input>
              {hasTails &&
                <label> {'90th Percentile'} </label>
              }
            </div>
          </div>
        </div>

        <div className='row secondary'>
          <div className='col-sm-4'>
            <div className='field'>
              <label> {'Precision'} </label>
              <input onChange={this.onChange.bind(this)} type='text' name='precision' value='0.01' ref='precision'></input>
            </div>
          </div>

          {hasTails &&
            <div className='col-sm-4'>
              <div className='field'>
                <label> {'Minimum'} </label>
                <input onChange={this.onChange.bind(this)} type='text' name='minimum' ref='minimum'></input>
              </div>
            </div>
          }

          {hasTails &&
            <div className='col-sm-4'>
              <div className='field'>
                <label> {'Maximum'} </label>
                <input onChange={this.onChange.bind(this)} type='text' name='maximum' ref='maximum'></input>
              </div>
            </div>
          }
        </div>
      </div>
    )
  }
}
