import React, {Component, PropTypes} from 'react'
import {DragSource} from 'react-dnd'

var cardSource = {
  beginDrag: function (props) {
    return {location: props.location}
  },
  endDrag: function(props, monitor, component) {
    if (monitor.didDrop()){
      const item = monitor.getItem();
      const dropResult = monitor.getDropResult()
      props.onMoveItem({prev: item.location, next: dropResult.location})
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
    isSelected: PropTypes.bool.isRequired,
    item: PropTypes.object,
    location: PropTypes.shape({
      row: PropTypes.number.isRequired,
      column: PropTypes.number.isRequired
    }).isRequired,
  }

  item() {
    return React.cloneElement(
          this.props.item,
          {
            isSelected: this.props.isSelected,
            gridKeyPress: this.props.gridKeyPress
          }
        )
  }
  render = () => {
    return this.props.connectDragSource(
      <div>
      {this.item()}
    </div>
    )
  }
}
