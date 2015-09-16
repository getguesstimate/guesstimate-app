'use strict';

import React from 'react'
import $ from 'jquery'

let GRID_ITEM_FOCUS_CLASS = '.grid-item-focus'

export default class Cell extends React.Component {
  componentDidMount = () => {
    this._focus()
  }
  componentDidUpdate = (prevProps, _) => {
    if (prevProps.isSelected == false){
      this._focus()
    }
  }
  _focus = () => {
    if (this.props.isSelected){
     if (!this.props.item) {
       React.findDOMNode(this).focus()
     } else {
       $(GRID_ITEM_FOCUS_CLASS).focus();
     }
    }
  }
  _handleKeyPress = (e) => {
    this.props.gridKeyPress(e)
  }
  _handleClick = (e) => {
    if (!this.props.isSelected) {
      this.props.handleSelect(e, this.props.location, this.props.item)
    } else {
      if (!this.props.item) {
        this.props.onAddItem(this.props.location)
      }
    }
  }
  _cellElement = () => {
    if (this.props.item) {
      return React.cloneElement(this.props.item, {isSelected: this.props.isSelected, gridKeyPress: this.props.gridKeyPress})
    } else {
      return ('')
    }
  }
  _classes = () => {
    let classes = 'cell'
    classes += (this.props.item ? ' full' : ' empty')
    classes += (this.props.isSelected ? ' selected' : ' nonSelected')
    return classes
  }
  render = () => {
    return (
      <div tabIndex='0' onMouseDown={this._handleClick} onKeyDown={this._handleKeyPress} className={this._classes()}>
        {this._cellElement()}
      </div>
    )
  }
}
