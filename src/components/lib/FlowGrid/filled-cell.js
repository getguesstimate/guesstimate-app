import React, {Component, PropTypes} from 'react'
import {DragSource} from 'react-dnd'
import {PTLocation} from 'lib/locationUtils.js'

var cardSource = {
  beginDrag: function (props) {
    return {location: props.location}
  },
  endDrag: function(props, monitor) {
    if (monitor.didDrop()){
      const item = monitor.getItem();
      const dropResult = monitor.getDropResult()
      props.onMoveItem({prev: item.location, next: dropResult.location})
      props.onEndDrag()
    }
  }
};

@DragSource('card', cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging()
}))
export default class ItemCell extends Component {
  static propTypes = {
    gridKeyPress: PropTypes.func.isRequired,
    handleSelect: PropTypes.func.isRequired,
    inSelectedCell: PropTypes.bool.isRequired,
    item: PropTypes.object,
    location: PTLocation.isRequired,
  }

  item() {
    return React.cloneElement(
        this.props.item,
        {
          hovered: this.props.hover,
          inSelectedCell: this.props.inSelectedCell,
          gridKeyPress: this.props.gridKeyPress,
          connectDragSource: this.props.connectDragSource
        }
    )
  }

  render = () => {
    let classes = 'FlowGridFilledCell'
    classes += this.props.isDragging ? ' isDragging' : ''
    return this.props.connectDragPreview(
      <div className={classes}>
        {!this.props.isDragging && this.item()}
      </div>
    )
  }
}
