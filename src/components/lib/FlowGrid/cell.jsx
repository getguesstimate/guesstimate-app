import React, {Component, PropTypes} from 'react'
import $ from 'jquery'
import { DropTarget } from 'react-dnd';
import ItemCell from './filled-cell.js';
import EmptyCell from './cell-empty.js';

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
    connectDropTarget: PropTypes.func.isRequired,
    gridKeyPress: PropTypes.func.isRequired,
    handleSelect: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    isSelected: PropTypes.bool.isRequired,
    item: PropTypes.object,
    location: PropTypes.shape({
      row: PropTypes.number.isRequired,
      column: PropTypes.number.isRequired
    }).isRequired,
    onAddItem: PropTypes.func.isRequired,
    onMoveItem: PropTypes.func.isRequired,
  }

  shouldComponentUpdate(newProps, newState) {
    if (this.props.location.row == 0 && this.props.location.column == 0) {
      console.log("FlowGrid Cell:")
      if (_.get(this.props, 'item.props.canvasState.metricClickMode') && _.get(newProps, 'item.props.canvasState.metricClickMode')) {
        console.log("oldProps", this.props)
        console.log("newProps", newProps)
        console.log("Old Click Mode: " , this.props.item.props.canvasState.metricClickMode)
        console.log("New Click Mode: " , newProps.item.props.canvasState.metricClickMode)
      }
      //console.log("oldProps:")
      //console.log(this.props)
      //console.log("newProps:")
      //console.log(newProps)
      //console.log("oldState:")
      //console.log(this.state)
      //console.log("newState:")
      //console.log(newState)
    }
    const difProps = (newProps.isOver !== this.props.isOver) ||
      (newProps.isSelected !== this.props.isSelected) ||
      (newState.hover !== this.state.hover)
    const itemDifferent = (!!newProps.item !== !!this.props.item)
    const bothHaveItems = (!!newProps.item && !!this.props.item)

    if (this.props.location.row == 0 && this.props.location.column == 0) {
      console.log("difProps || itemDifferent", difProps || itemDifferent)
      console.log("bothHaveItems", bothHaveItems)
      if (!difProps && !itemDifferent && bothHaveItems) {
        const oldProps = this.props.item.props
        const newProps2 = newProps.item.props
        console.log("Within Cell: CanvasSpace:")
        console.log("oldProps:")
        console.log(oldProps.canvasState)
        _.get(oldProps, 'metric.simulation') && console.log(oldProps.metric.simulation)
        console.log("newProps2:")
        console.log(newProps2.canvasState)
        _.get(newProps2, 'metric.simulation') && console.log(newProps2.metric.simulation)
        console.log("this.props.hasItemUpdated: ", 
          oldProps.canvasState !== newProps2.canvasState ||
          oldProps.metric.simulation !== newProps2.metric.simulation
        )
      }
    }
    return (difProps || itemDifferent || (bothHaveItems && this.props.hasItemUpdated(this.props.item, newProps.item))) || this.props.canvasState !== newProps.canvasState
  }

  state = {
    hover: false
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
      // Then endDrag fixes a bug where the original dragging position is hovered.
      return (<ItemCell onEndDrag={this.mouseOut.bind(this)} {...this.props} hover={this.state.hover}/>)
    } else {
      return (<EmptyCell {...this.props} />)
    }
  }

  _classes = () => {
    let classes = 'FlowGridCell'
    classes += (this.props.isSelected ? ' selected' : ' nonSelected')
    classes += this.props.item ? ' hasItem' : ''
    classes += this.props.isOver ? ' IsOver' : ''
    classes += this.state.hover ? ' hovered' : ''
    return classes
  }

  mouseOver = () => {
    this.setState({hover: true})
  }

  mouseOut = () => {
    this.setState({hover: false})
  }

  render = () => {
    return this.props.connectDropTarget(
      <div className={this._classes()} onMouseOver={this.mouseOver.bind(this)} onMouseOut={this.mouseOut.bind(this)}>
        {this._cellElement()}
      </div>
    )
  }
}
