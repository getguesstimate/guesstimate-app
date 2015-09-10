'use strict';

import React from 'react'
import $ from 'jquery'

let GRID_ITEM_FOCUS_CLASS = '.grid-item-focus'

class SelectedEmptyElement extends React.Component{
  _onAddItem = () => {
    this.props.onAddItem(this.props.location)
  }
  render = () => {
    return (
      <div
        onClick={this._onAddItem}/>
    )
  }
}

class UnselectedEmptyElement extends React.Component{
  _handleSelect = () => {
    this.props.onSelectItem(this.props.location)
  }
  render = () => {
    return (
      <div onClick={this._handleSelect}/>
    )
  }
}

class Cell extends React.Component{
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
  _handleSelect = () => {
    this.props.onSelectItem(this.props.location)
  }
  _cellType = () => {
    if (this.props.item) {
      return React.cloneElement(this.props.item, {isSelected: this.props.isSelected, gridKeyPress: this.props.gridKeyPress})
    } else if (this.props.isSelected) {
      return <SelectedEmptyElement key={this.props.location} location={this.props.location} gridKeyPress={this.props.gridKeyPress} onAddItem={this.props.onAddItem}/>
    } else {
      return <UnselectedEmptyElement
        key={this.props.location}
        location={this.props.location}/>
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
      <div tabIndex='0' onClick={this._handleSelect} onKeyDown={this._handleKeyPress} ref='foo' className={this._classes()}>
        {this._cellType()}
      </div>
    )
  }
}

export default Cell
