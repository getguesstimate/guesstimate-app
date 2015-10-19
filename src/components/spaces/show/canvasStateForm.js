import React, {Component, PropTypes} from 'react'
import StandardDropdownMenu from 'gComponents/utility/standard-dropdown-menu'
import { connect } from 'react-redux';
import * as canvasStateActions from 'gModules/canvas_state/actions.js'
import Icon from 'react-fa'

function mapStateToProps(state) {
  return {
    canvasState: state.canvasState
  }
}

const Item = ({name, onSelect}) => (
  <li onMouseDown={onSelect} >
    <button
        data-card-view={name}
        type='button'>{name}
    </button>
  </li>
)

const PT = PropTypes
@connect(mapStateToProps)
export default class CanvasStateForm extends Component {
  static propTypes = {
    canvasState: PT.shape({
      metricCardView: PT.oneOf([
        'normal',
        'scientific',
        'debugging',
      ]).isRequired,
    }),
    dispatch: PropTypes.func
  }

  onSelect(e) {
    const metricCardView = e.target.getAttribute('data-card-view')
    this.props.dispatch(canvasStateActions.change({metricCardView}))
  }
  render() {
    return (
        <StandardDropdownMenu toggleButton={<a><Icon name='eye'/> {this.props.canvasState.metricCardView} </a>}>
           {['normal', 'scientific', 'debugging'].map(e => {
             return (
               <Item
                   key={e}
                   name={e}
                   onSelect={this.onSelect.bind(this)}
               />)
           })}
        </StandardDropdownMenu>
    )
  }
}
