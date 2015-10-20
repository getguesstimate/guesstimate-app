import React, {Component, PropTypes} from 'react'
import $ from 'jquery'
import { DropTarget } from 'react-dnd';
import ItemCell from './filled-cell.js';


export default class EmptyCell extends Component {
  static propTypes = {
    gridKeyPress: PropTypes.func.isRequired,
    handleSelect: PropTypes.func.isRequired,
    isSelected: PropTypes.bool.isRequired,
    location: PropTypes.shape({
      row: PropTypes.number.isRequired,
      column: PropTypes.number.isRequired
    }).isRequired,
    onAddItem: PropTypes.func.isRequired
  }

  shouldComponentUpdate(nextProps) {
    return (nextProps.isOver !== this.props.isOver)
  }

  _handleKeyPress(e) {
    if (e.keyCode == '13') { //enter
      this.props.onAddItem(this.props.location)
    }
    if (e.keyCode == '8') { //delete
      e.preventDefault()
    }
    this.props.gridKeyPress(e)
  }

  handleClick(e) {
    if (e.button === 0){
      if (!this.props.isSelected) {
        this.props.handleSelect(this.props.location)
      } else {
        this.props.onAddItem(this.props.location)
      }
    }
  }

  render() {
    const {connectDropTarget, isOver} = this.props

    let className = 'GiantEmptyCell grid-item-focus'
    className += isOver ? ' IsOver' : ''
    return connectDropTarget(
      <div
          className={className}
          onKeyDown={this._handleKeyPress.bind(this)}
          onMouseDown={this.handleClick.bind(this)}
          tabIndex='0'
          >
      </div>
    )
  }
}

const squareTarget = {
  drop(props) {
    return {location: props.location}
  }
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
}

@DropTarget('card', squareTarget, collect)
export default class Cell extends Component {
  static propTypes = {
    gridKeyPress: PropTypes.func.isRequired,
    handleSelect: PropTypes.func.isRequired,
    isSelected: PropTypes.bool.isRequired,
    item: PropTypes.object,
    location: PropTypes.shape({
      row: PropTypes.number.isRequired,
      column: PropTypes.number.isRequired
    }).isRequired,
    onAddItem: PropTypes.func.isRequired,
    onMoveItem: PropTypes.func.isRequired
  }

  getPosition() {
    let $el = $(this.refs.dom)
    if ($el.length) {
      const position = $el.position()
      return {
        top: position.top,
        left: position.left,
        height: $el.height(),
        width: $el.width()
      }
    } else {
      return {}
    }
  }

  componentDidMount = () => {
    if (this.props.isSelected){
      this._focus()
    }
  }

  componentDidUpdate = (prevProps) => {
    const newlySelected = (this.props.isSelected && !prevProps.isSelected)
    const changeInItem = (!!prevProps.item !== !!this.props.item)
    if (newlySelected || changeInItem){
      this._focus()
    }
  }

  _focus = () => {
     $('.selected .grid-item-focus').focus();
  }

  _cellElement = () => {
    if (this.props.item) {
      return (<ItemCell {...this.props} />)
    } else {
      return (<EmptyCell {...this.props} />)
    }
  }

  _classes = () => {
    let classes = 'GiantCell'
    classes += (this.props.isSelected ? ' selected' : ' nonSelected')
    return classes
  }

  render = () => {
    return (
      <div className={this._classes()}
          ref='dom'
      >
      {this._cellElement()}
      </div>
    )
  }
}
