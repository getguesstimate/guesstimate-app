import React, {Component, PropTypes} from 'react'
import StandardDropdownMenu from 'gComponents/utility/standard-dropdown-menu'
import { connect } from 'react-redux';
import * as canvasStateActions from 'gModules/canvas_state/actions.js'
import Icon from 'react-fa'

function mapStateToProps(state) {
  return {
    edgeView: state.canvasState.edgeView
  }
}

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

const Item = ({name, onSelect}) => (
  <li onMouseDown={onSelect} >
    <button
        data-edge-view={name}
        type='button'>{name.capitalizeFirstLetter()}
    </button>
  </li>
)

const PT = PropTypes
@connect(mapStateToProps)
export default class CanvasCardViewForm extends Component {
  static propTypes = {
    edgeView: PT.oneOf([
      'hidden',
      'visible',
    ]).isRequired,
    dispatch: PropTypes.func
  }

  onSelect(e) {
    const edgeView = e.target.getAttribute('data-edge-view')
    this.props.dispatch(canvasStateActions.change({edgeView}))
  }
  render() {
    return (
        <StandardDropdownMenu toggleButton={<a><Icon name='arrows'/> {this.props.edgeView.capitalizeFirstLetter()} </a>}>
           {['shown', 'hidden'].map(e => {
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
