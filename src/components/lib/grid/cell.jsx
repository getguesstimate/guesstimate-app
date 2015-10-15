'use strict';
import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
import $ from 'jquery'
let GRID_ITEM_FOCUS_CLASS = '.grid-item-focus'

export default class EmptyCell extends React.Component {
  static propTypes = {
    isSelected: PropTypes.bool.isRequired,
    gridKeyPress: PropTypes.func.isRequired,
    handleSelect: PropTypes.func.isRequired,
    onAddItem: PropTypes.func.isRequired,
    location: PropTypes.shape({
      row: PropTypes.number.isRequired,
      column: PropTypes.number.isRequired
    }).isRequired
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
    return (
      <div
          onKeyDown={this._handleKeyPress.bind(this)}
          className={'GiantEmptyCell grid-item-focus'}
          onMouseDown={this.handleClick.bind(this)}
          tabIndex='0'
      />
    )
  }
}

export default class Cell extends React.Component {
  static propTypes = {
    item: PropTypes.object,
    isSelected: PropTypes.bool.isRequired,
    gridKeyPress: PropTypes.func.isRequired,
    handleSelect: PropTypes.func.isRequired,
    onAddItem: PropTypes.func.isRequired,
    location: PropTypes.shape({
      row: PropTypes.number.isRequired,
      column: PropTypes.number.isRequired
    }).isRequired
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
      return React.cloneElement(
        this.props.item,
        {
          isSelected: this.props.isSelected,
          gridKeyPress: this.props.gridKeyPress
        }
      )
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
      <div className={this._classes()}>
      {this._cellElement()}
      </div>
    )
  }
}
