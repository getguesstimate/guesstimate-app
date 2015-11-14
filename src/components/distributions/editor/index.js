import React, {Component, PropTypes} from 'react'
import HoverButton from './hover-button.js'
import ValueForm from './value-form/index.js'

import Icon from 'react-fa'
import './style.css'

const GuesstimateInformation = [
  {name: 'POINT', description: 'An estimate at one point', fields: ['value']},
  {name: 'NORMAL', description: 'A normal Guesstimate', fields: ['low', 'height']},
  {name: 'LOGNORMAL', description: 'A lognormal thing', fields: ['low', 'height']},
  {name: 'UNIFORM', description: 'A lognormal thing', fields: ['low', 'height']}
]

const PT = PropTypes;
export default class GuesstimateEditor extends Component {
  displayName: 'GuesstimateEditor'

  static propTypes = {
    close: PT.func,
    guesstimate: PT.object,
    guesstimateType: PT.object,
    onSubmit: PT.func,
  }

  state = {
    hoveredGuesstimate: null,
    guesstimate: Object.assign({},{type: 'NORMAL'}, this.props.guesstimate)
  }

  hovered(e) {
    this.setState({hoveredGuesstimate: e})
  }

  selected(e) {
    this.setState({selectedGuesstimate: e})
    const newGuesstimate = Object.assign(this.state.guesstimate, {type: e})
    this.setState(newGuesstimate)
  }

  guesstimateType() {
    let showType = this.state.hoveredGuesstimate || this.state.guesstimate.type
    return GuesstimateInformation.find(e => e.name === showType)
  }

  _onFieldChange(values) {
    const newGuesstimate = Object.assign(this.state.guesstimate, values)
    this.setState({guesstimate: newGuesstimate})
  }

  _close() {
    this.props.close()
  }

  _onSubmit() {
    let guesstimate = this.state.guesstimate
    guesstimate.guesstimateType = guesstimate.type
    guesstimate.input = null
    this.props.onSubmit(guesstimate)
  }

  render() {
    const guesstimateType = this.guesstimateType()
    return (
      <div className='GuesstimateEditor'>
        <div className='row'>
          <div className='col-sm-12'>
            <div className='four ui attached buttons'>
              {['POINT', 'NORMAL', 'LOGNORMAL', 'UNIFORM'].map(e => {
                const isSelected = (e === this.state.guesstimate.type)
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
                guesstimate={this.state.guesstimate}
                guesstimateType={guesstimateType}
                onChange={this._onFieldChange.bind(this)}
            />
          </div>
        </div>
        <div className='row'>
          <div className='col-sm-12 actions'>
            <div
                className='ui button green'
                onClick={this._onSubmit.bind(this)}
            >
              {'Save'}
            </div>
            <div
                className='ui button'
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
