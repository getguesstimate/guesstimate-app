import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux';
import DropDown from 'gComponents/utility/drop-down/index.js'
import {DropDownListElement} from 'gComponents/utility/drop-down/index.js'
import * as canvasStateActions from 'gModules/canvas_state/actions.js'

import basicImage from '../../../assets/metric-icons/blue/basic.png'
import debuggingImage from '../../../assets/metric-icons/blue/debugging.png'
import normalImage from '../../../assets/metric-icons/blue/normal.png'
import scientificImage from '../../../assets/metric-icons/blue/scientific.png'
import arrowsHiddenImage from '../../../assets/metric-icons/blue/arrows-hidden.png'
import arrowsVisibleImage from '../../../assets/metric-icons/blue/arrows-visible.png'

import './style.css'
import Icon from 'react-fa'

function mapStateToProps(state) {
  return {
    metricCardView: state.canvasState.metricCardView,
    edgeView: state.canvasState.edgeView
  }
}

const Item = ({name, onSelect}) => (
  <li onMouseDown={onSelect} >
    <button
        data-card-view={name}
        type='button'>{name.capitalizeFirstLetter()}
    </button>
  </li>
)

const PT = PropTypes
@connect(mapStateToProps)
export default class CanvasViewForm extends Component {
  displayName: 'CanvasViewForm'

  static propTypes = {
    edgeView: PT.oneOf([
      'hidden',
      'visible',
    ]).isRequired,
    metricCardView: PT.oneOf([
      'normal',
      'basic',
      'scientific',
      'debugging',
    ]).isRequired,
    dispatch: PropTypes.func
  }

  _selectMetricCardView(e) {
    this.props.dispatch(canvasStateActions.change({metricCardView: e}))
  }

  _selectEdgeView(e) {
    this.props.dispatch(canvasStateActions.change({edgeView: e}))
  }

  render () {
    let metricCardViewOptions = [
      {name: 'normal', image: normalImage},
      {name: 'basic', image: basicImage},
      {name: 'scientific', image: scientificImage},
      {name: 'debugging', image: debuggingImage},
    ]

    let arrowViewOptions = [
      {name: 'hidden', image: arrowsHiddenImage},
      {name: 'visible', image: arrowsVisibleImage},
    ]

    metricCardViewOptions = metricCardViewOptions.map(e => {
      const isSelected = (e.name === this.props.metricCardView)
      const select = () => {this._selectMetricCardView(e.name)}
      return Object.assign(e, {isSelected, onClick:select})
    })

    arrowViewOptions = arrowViewOptions.map(e => {
      const isSelected = (e.name === this.props.edgeView)
      const select = () => {this._selectEdgeView(e.name)}
      return Object.assign(e, {isSelected, onClick:select})
    })

    return (
      <DropDown
          headerText={'View Options'}
          openLink={<a className='relative space-header-action'>View Options</a>}
          position='right'
      >

        <div className='section'>
          <div className='header-divider'>
            <h3> Metric Style </h3>
          </div>
          <ul>
            {metricCardViewOptions.map(o => {
              return(
                <DropDownListElement key={o.name} icon={o.icon} header={o.name} isSelected={o.isSelected} onMouseDown={o.onClick} image={o.image}/>
              )
            })}
          </ul>
        </div>
        <hr/>

        <div className='section'>
          <div className='header-divider'>
            <h3> Arrows </h3>
          </div>
          <ul>
            {arrowViewOptions.map(o => {
              return(
                <DropDownListElement key={o.name} icon={o.icon} header={o.name} isSelected={o.isSelected} onMouseDown={o.onClick} image={o.image}/>
              )
            })}
          </ul>
        </div>
      </DropDown>
    )
  }
}
