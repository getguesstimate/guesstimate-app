import React, {Component, PropTypes} from 'react'
import {DragSource, DropTarget} from 'react-dnd'

var cardSource = {
  beginDrag: function (props) {
    return {location: props.location}
  },
  endDrag: function(props, monitor) {
    if (monitor.didDrop()){
      const item = monitor.getItem();
      const dropResult = monitor.getDropResult()
      props.onMultipleSelect(item.location, dropResult.location)
      //props.onEndDrag()
    }
  }
}
const squareTarget = {
  //For partial highlight.
  hover: function(props, monitor, component) {
    props.onHoverSelect(monitor.getItem().location, props.location)
  },
  drop: function(props) {
    return {location: props.location}
  }
}
function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
}

@DragSource('select', cardSource, (connect, monitor) => {
  return ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  })
})
@DropTarget('select', squareTarget, collect)
export default class EmptyCell extends Component {
  static propTypes = {
    gridKeyPress: PropTypes.func.isRequired,
    handleSelect: PropTypes.func.isRequired,
    onHoverSelect: PropTypes.func,
    isOver: PropTypes.bool.isRequired,
    isSelected: PropTypes.bool.isRequired,
    location: PropTypes.shape({
      row: PropTypes.number.isRequired,
      column: PropTypes.number.isRequired
    }).isRequired,
    onAddItem: PropTypes.func.isRequired,
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
        this.props.onMultipleSelect(this.props.location, this.props.location)
      } else {
        this.props.onAddItem(this.props.location)
      }
    }
  }

  render() {
    let className = 'FlowGridEmptyCell grid-item-focus'
    return this.props.connectDropTarget(this.props.connectDragSource(
      <div
          className={className}
          onKeyDown={this._handleKeyPress.bind(this)}
          onMouseDown={this.handleClick.bind(this)}
          tabIndex='0'
      />
    ))
  }
}

