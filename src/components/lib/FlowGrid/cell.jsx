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
    onHoverSelect: PropTypes.func,
    isOver: PropTypes.bool.isRequired,
    isSelected: PropTypes.bool.isRequired,
    item: PropTypes.object,
    location: PropTypes.shape({
      row: PropTypes.number.isRequired,
      column: PropTypes.number.isRequired
    }).isRequired,
    onAddItem: PropTypes.func.isRequired,
    onMoveItem: PropTypes.func.isRequired,
    onMultipleSelect: PropTypes.func,
  }

  select() {
    this.setState({isSelected: true})
  }

  componentWillReceiveProps(newProps) {
    this.setState({isSelected: newProps.isSelected})
  }

  shouldComponentUpdate(newProps, newState) {
    const difProps = (newProps.isOver !== this.props.isOver) ||
      (newProps.isSelected !== this.state.isSelected) ||
      (newState.hover !== this.state.hover)
    const hasItem = (!!newProps.item || !!this.props.item)

    return (difProps || hasItem)
  }

  state = {
    hover: false,
    isSelected: false
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
    if (this.state.isSelected){
      this._focus()
    }
  }

  componentDidUpdate = (prevProps, prevState) => {
    const newlySelected = (this.state.isSelected && !prevState.isSelected)
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
    classes += (this.state.isSelected ? ' selected' : ' nonSelected')
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
