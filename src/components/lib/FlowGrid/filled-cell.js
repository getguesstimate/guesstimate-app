import React, { Component } from "react";
import PropTypes from "prop-types";

import { DragSource, DragLayer } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";

import { PTLocation } from "lib/locationUtils";

import { getClassName } from "gEngine/utils";

var layerStyles = {
  position: "fixed",
  pointerEvents: "none",
  zIndex: 10000,
  left: 0,
  top: 0,
  width: "100%",
  height: "100%",
};

function getItemStyles(props) {
  var currentOffset = props.currentOffset;
  if (!currentOffset) {
    return { display: "none" };
  }

  var x = currentOffset.x;
  var y = currentOffset.y;
  var transform = `translate(${x}px, ${y}px)`;
  return { transform: transform, WebkitTransform: transform };
}

@DragLayer((monitor) => ({
  item: monitor.getItem(),
  itemType: monitor.getItemType(),
  currentOffset: monitor.getSourceClientOffset(),
  isDragging: monitor.isDragging(),
}))
class DragPreview extends Component {
  renderItem(type, item) {
    const styles = {
      marginTop: "-26px",
      width: `${this.props.width}px`,
    };
    switch (type) {
      case "card":
        return <div style={styles}>{this.props.children} </div>;
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
}

var cardSource = {
  beginDrag: function (props) {
    return { location: props.location };
  },
  endDrag: function (props, monitor) {
    if (!monitor.didDrop()) {
      return;
    }

    const { location: startLocation } = monitor.getItem();
    const { location: dropLocation, item: dropItem } = monitor.getDropResult();
    if (!dropItem) {
      props.onMoveItem({ prev: startLocation, next: dropLocation });
      props.onEndDrag(dropLocation);
    }
  },
};

class ItemCell extends Component {
  static propTypes = {
    gridKeyPress: PropTypes.func.isRequired,
    handleSelect: PropTypes.func.isRequired,
    inSelectedCell: PropTypes.bool.isRequired,
    item: PropTypes.object,
    location: PTLocation.isRequired,
  };

  state = {
    itemWidth: 0,
  };

  componentDidMount() {
    window.recorder.recordMountEvent(this);
  }
  componentWillUpdate() {
    window.recorder.recordRenderStartEvent(this);
  }
  componentDidUpdate() {
    window.recorder.recordRenderStopEvent(this);
  }
  componentWillUnmount() {
    window.recorder.recordUnmountEvent(this);
  }

  componentWillReceiveProps(newProps) {
    const startedDragging = !this.props.isDragging && newProps.isDragging;
    const childItem = this.refs.container && this.refs.container.children[0];

    if (startedDragging && !!childItem) {
      this.setState({ width: childItem.offsetWidth });
    }
  }

  item() {
    return React.cloneElement(this.props.item, {
      hovered: this.props.hover,
      inSelectedCell: this.props.inSelectedCell,
      selectedFrom: this.props.selectedFrom,
      gridKeyPress: this.props.gridKeyPress,
      connectDragSource: this.props.connectDragSource,
      forceFlowGridUpdate: this.props.forceFlowGridUpdate,
      onReturn: this.props.onReturn,
      onTab: this.props.onTab,
      ref: "item",
    });
  }

  onMouseUp(e) {
    if (e.button === 0 && e.target.className === "FlowGridFilledCell") {
      this.props.focusCell();
    }
  }

  render() {
    const className = getClassName(
      "FlowGridFilledCell",
      this.props.isDragging ? "isDragging" : null
    );
    // This forces dragging cells to not change their row heights. A bit hacky, but gives a better user experience in my
    // opinion and keeps background layer in sync with real row heights during drag (which skips normal rendering tree).
    const styles = this.props.isDragging
      ? { minHeight: `${this.props.getRowHeight() - 1}px` }
      : {};
    this.props.connectDragPreview(getEmptyImage());
    return (
      <div
        className={className}
        style={styles}
        ref="container"
        onMouseUp={this.onMouseUp.bind(this)}
      >
        {this.props.isDragging && (
          <DragPreview width={this.state.width}>{this.item()}</DragPreview>
        )}
        {!this.props.isDragging && this.item()}
      </div>
    );
  }
}

export default DragSource("card", cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging(),
}))(ItemCell);
