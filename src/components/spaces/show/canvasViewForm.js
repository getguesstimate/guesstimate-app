import React, {Component} from 'react' 
import PropTypes from 'prop-types'
import {connect} from 'react-redux';

import DropDown from 'gComponents/utility/drop-down/index.js'
import {CardListElement} from 'gComponents/utility/card/index.js'

import * as canvasStateActions from 'gModules/canvas_state/actions.js'
import * as canvasStateProps from 'gModules/canvas_state/prop_type.js'

import {trackToggledViewMode} from 'servers/segment/index'

import debuggingImage from '../../../assets/metric-icons/blue/debugging.png'
import scientificImage from '../../../assets/metric-icons/blue/scientific.png'
import arrowsHiddenImage from '../../../assets/metric-icons/blue/arrows-hidden.png'
import arrowsVisibleImage from '../../../assets/metric-icons/blue/arrows-visible.png'

import './style.css'

function mapStateToProps(state) {
  return {
    canvasState: state.canvasState,
  }
}

const Item = ({name, onSelect}) => (
  <li onMouseDown={onSelect} >
    <button
      data-card-view={name}
      type='button'
    >
      {name.capitalizeFirstLetter()}
    </button>
  </li>
)

@connect(mapStateToProps)
export default class CanvasViewForm extends Component {
  displayName: 'CanvasViewForm'

  static propTypes = {
    canvasState: canvasStateProps.canvasViewState,
    dispatch: PropTypes.func
  }

  _selectMetricCardView(e) {
    trackToggledViewMode(e)
    this.props.dispatch(canvasStateActions.toggleView(e))
  }

  _selectEdgeView(e) {
    this.props.dispatch(canvasStateActions.change({edgeView: e}))
  }

  render () {
    let metricCardViewOptions = [
      {name: 'scientific', image: scientificImage, key: 'scientificViewEnabled'},
      {name: 'expanded', image: debuggingImage, key: 'expandedViewEnabled'},
    ]

    let arrowViewOptions = [
      {name: 'hidden', image: arrowsHiddenImage},
      {name: 'visible', image: arrowsVisibleImage},
    ]

    metricCardViewOptions = metricCardViewOptions.map(e => {
      const isSelected = !!this.props.canvasState[e.key]
      return Object.assign(e, {isSelected, onClick: () => {this._selectMetricCardView(e.name)}})
    })

    arrowViewOptions = arrowViewOptions.map(e => {
      const isSelected = (e.name === this.props.canvasState.edgeView)
      return Object.assign(e, {isSelected, onClick: () => {this._selectEdgeView(e.name)}})
    })

    return (
      <DropDown
        headerText={'View Options'}
        openLink={<a className='header-action'>View</a>}
        position='right'
      >
        <div className='section' closeOnClick={false}>
          <div className='header-divider' onClick={e => {e.stopPropagation()}}>
            <h3> Metric Style </h3>
          </div>
          <ul>
            {metricCardViewOptions.map(o => {
              return(
                <CardListElement key={o.name} icon={o.icon} header={o.name} isSelected={o.isSelected} onMouseDown={o.onClick} image={o.image}/>
              )
            })}
          </ul>
        </div>
        <hr/>

        <div className='section' closeOnClick={false}>
          <div className='header-divider' onClick={e => {e.stopPropagation()}}>
            <h3> Arrows </h3>
          </div>
          <ul>
            {arrowViewOptions.map(o => {
              return(
                <CardListElement key={o.name} icon={o.icon} header={o.name} isSelected={o.isSelected} onMouseDown={o.onClick} image={o.image}/>
              )
            })}
          </ul>
        </div>
      </DropDown>
    )
  }
}
