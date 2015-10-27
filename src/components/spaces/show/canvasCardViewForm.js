import React, {Component, PropTypes} from 'react'
import StandardDropdownMenu from 'gComponents/utility/standard-dropdown-menu'
import { connect } from 'react-redux';
import * as canvasStateActions from 'gModules/canvas_state/actions.js'
import Icon from 'react-fa'

function mapStateToProps(state) {
  return {
    metricCardView: state.canvasState.metricCardView
  }
}

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
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
export default class CanvasCardViewForm extends Component {
  static propTypes = {
    metricCardView: PT.oneOf([
      'normal',
      'basic',
      'scientific',
      'debugging',
    ]).isRequired,
    dispatch: PropTypes.func
  }

  onSelect(e) {
    const metricCardView = e.target.getAttribute('data-card-view')
    this.props.dispatch(canvasStateActions.change({metricCardView}))
  }
  render() {
    return (
        <StandardDropdownMenu toggleButton={<a><Icon name='th-large'/> {this.props.metricCardView.capitalizeFirstLetter()} </a>}>
           {['normal', 'basic', 'scientific', 'debugging'].map(e => {
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
