import React, {Component, PropTypes} from 'react'

import {DragSource, DragLayer} from 'react-dnd'
import {PTLocation} from 'lib/locationUtils'
import { getEmptyImage } from 'react-dnd-html5-backend';

var layerStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 10000,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
};

function getItemStyles(props) {
  var currentOffset = props.currentOffset;
  if (!currentOffset) {
    return {
      display: 'none'
    };
  }

  var x = currentOffset.x;
  var y = currentOffset.y;
  var transform = 'translate(' + x + 'px, ' + y + 'px)';
  return {
    transform: transform,
    WebkitTransform: transform
  };
}

@DragLayer(monitor => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging()
}))
export default class DragPreview extends Component {
  renderItem(type, item) {
    const styles = {
      marginTop: '-26px',
      width: `${this.props.width}px`
    }
    switch (type) {
    case 'card':
      return (
        <div style={styles}>{this.props.children} </div>
      );
    }
  }

  render() {
    var item = this.props.item;
    var itemType = this.props.itemType;
    var isDragging = this.props.isDragging;
    if (!isDragging) {
      return null;
    }

    return (
      <div style={layerStyles}>
        <div style={getItemStyles(this.props)}>
          {this.renderItem(itemType, item)}
        </div>
      </div>
    );
  }
};

var cardSource = {
  beginDrag: function (props) {
    return {location: props.location}
  },
  endDrag: function(props, monitor) {
    if (monitor.didDrop()){
      const item = monitor.getItem();
      const dropResult = monitor.getDropResult()
      props.onMoveItem({prev: item.location, next: dropResult.location})
      props.onEndDrag(dropResult.location)
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

  state = {
    itemWidth: 0
  }

  componentDidMount() { window.recorder.recordMountEvent(this) }
  componentWillUpdate() { window.recorder.recordRenderStartEvent(this) }
  componentDidUpdate() { window.recorder.recordRenderStopEvent(this) }
  componentWillUnmount() { window.recorder.recordUnmountEvent(this) }

  componentWillReceiveProps(newProps){
    const startedDragging = !this.props.isDragging && newProps.isDragging
    const childItem = this.refs.container && this.refs.container.children[0]

    if (startedDragging && !!childItem){
      this.setState({width: childItem.offsetWidth})
    }
  }

  item() {
    return React.cloneElement(
      this.props.item,
      {
        hovered: this.props.hover,
        inSelectedCell: this.props.inSelectedCell,
        selectedFrom: this.props.selectedFrom,
        gridKeyPress: this.props.gridKeyPress,
        connectDragSource: this.props.connectDragSource,
        forceFlowGridUpdate: this.props.forceFlowGridUpdate,
        onReturn: this.props.onReturn,
        onTab: this.props.onTab,
      }
    )
  }

  render = () => {
    let classes = 'FlowGridFilledCell'
    classes += this.props.isDragging ? ' isDragging' : ''
    // This forces dragging cells to not change their row heights. A bit hacky, but gives a better user experience in my
    // opinion and keeps background layer in sync with real row heights during drag (which skips normal rendering tree).
    const styles = this.props.isDragging ? {minHeight: `${this.props.getRowHeight()-1}`} : {}
    const item = this.item()
    this.props.connectDragPreview(getEmptyImage());
    return (
      <div className={classes} style={styles} ref='container'>
        {this.props.isDragging && <DragPreview width={this.state.width}>{item}</DragPreview>}
        {!this.props.isDragging && item}
      </div>
    )
  }
}
