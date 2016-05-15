import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
import $ from 'jquery'
import { DropTarget } from 'react-dnd';
import ItemCell from './filled-cell.js';
import EmptyCell from './cell-empty.js';
import {PTLocation} from 'lib/locationUtils.js'

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
    inSelectedRegion: PropTypes.bool.isRequired,
    inSelectedCell: PropTypes.bool.isRequired,
    isHovered: PropTypes.bool.isRequired,
    item: PropTypes.object,
    location: PTLocation.isRequired,
    onAddItem: PropTypes.func.isRequired,
    onMoveItem: PropTypes.func.isRequired,
  }

  shouldComponentUpdate(newProps, newState) {
    const difProps = (newProps.isOver !== this.props.isOver) ||
      (newProps.inSelectedRegion !== this.props.inSelectedRegion) ||
      (newProps.inSelectedCell !== this.props.inSelectedCell) ||
      (newProps.isHovered !== this.props.isHovered)
    const itemDifferent = (!!newProps.item !== !!this.props.item)
    const bothHaveItems = (!!newProps.item && !!this.props.item)

    return (difProps || itemDifferent || (bothHaveItems && this.props.hasItemUpdated(this.props.item, newProps.item)))
  }

  componentDidUpdate(prevProps, prevState) {
    if ((!!prevProps.item !== !!this.props.item || !!prevProps.inSelectedCell !== !!this.props.inSelectedCell) && this.props.inSelectedCell) {
      this._focus()
    }
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

  handleClick(e) {
    // TODO(matthew): I think we can refactor this and get rid of the window trigger system for doing this input, but it
    // will be a bigger refactor, so I'm inclined to leave this for now, even though it couples the flow grid and the
    // space more tightly than they've been integrated so far.
    if (this.props.canvasState.metricClickMode === 'FUNCTION_INPUT_SELECT') {
      return
    }
    if (e.button === 0){
      if (!this.props.inSelectedCell) {
        if (e.shiftKey) {
          this.props.handleEndRangeSelect(this.props.location)
        } else {
          this.props.handleSelect(this.props.location)
        }
      } else if (!this.props.item) {
        this.props.handleSelect(this.props.location)
        this.props.onAddItem(this.props.location)
      }
    }
  }

  componentDidMount() {
    if (this.props.inSelectedCell) {
      this._focus()
    }
  }

  _focus = () => {
    let domNode
    if (this.props.item) {
      // Always focus on the immediate child of the filled cell.
      domNode = ReactDOM.findDOMNode(this.refs.item.decoratedComponentInstance).children[0]
    } else {
      domNode = ReactDOM.findDOMNode(this.refs.empty)
    }
    domNode.focus()
  }

  _cellElement = () => {
    if (this.props.item) {
      // Then endDrag fixes a bug where the original dragging position is hovered.
      return (<ItemCell onEndDrag={this.mouseOut.bind(this)} {...this.props} hover={this.props.isHovered} ref={'item'}/>)
    } else {
      return (<EmptyCell {...this.props} ref={'empty'} />)
    }
  }

  _classes = () => {
    let classes = 'FlowGridCell'
    classes += (this.props.inSelectedRegion ? ' selected' : ' nonSelected')
    classes += this.props.item ? ' hasItem' : ''
    classes += this.props.isOver ? ' IsOver' : ''
    classes += this.props.isHovered ? ' hovered' : ''
    return classes
  }

  mouseOut = () => {
    this.setState({hover: false})
  }

  render = () => {
    return this.props.connectDropTarget(
      <div
        className={this._classes()}
        onMouseOver={this.props.onMouseOver}
        onClick={this.handleClick.bind(this)}
      >
        {this._cellElement()}
      </div>
    )
  }
}
