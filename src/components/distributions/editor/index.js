import React, {Component, PropTypes} from 'react'
import HoverButton from './hover-button.js'
import ValueForm from './value-form/index.js'

import Icon from 'react-fa'
import './style.css'

const DistributionInformation = [
  {name: 'point', description: 'An estimate at one point', fields: ['value']},
  {name: 'normal', description: 'A normal Distribution', fields: ['low', 'height']},
  {name: 'lognormal', description: 'A lognormal thing', fields: ['low', 'height']},
  {name: 'uniform', description: 'A lognormal thing', fields: ['low', 'height']},
  {name: 'power', description: 'A lognormal thing', fields: ['low', 'height']}
]

const PT = PropTypes;
export default class DistributionEditor extends Component {
  displayName: 'DistributionEditor'

  static propTypes = {
    close: PT.func,
    distributionType: PT.object,
    onSubmit: PT.func,
  }

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

  _close() {
    this.props.close()
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
                  <HoverButton
                      isSelected={isSelected}
                      key={e}
                      name={e}
                      onClick={this.selected.bind(this)}
                      onHoverChange={this.hovered.bind(this)}
                  />
                )
              })}
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-sm-12'>
            <ValueForm
                distributionType={distributionType}
                onChange={this._onFieldChange.bind(this)}
            />
          </div>
        </div>
        <div className='row'>
          <div className='col-sm-12 actions'>
            <div className='ui button green large'>{'Save'}</div>
            <div
                className='ui button large'
                onClick={this.props.close}
            >
              <Icon name='close'/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
