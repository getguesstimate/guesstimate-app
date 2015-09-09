'use strict';

import React from 'react'
import _ from 'lodash'

let upto = (n) => Array.apply(null, {length: n}).map(Number.call, Number)

class Mover {
  constructor(size, location) {
    this.size = Object.assign(size);
    this.location = Object.assign({}, location);
  }
  down() {
    this.location.row = Math.min((this.location.row + 1), (this.size.rows - 1))
    return this.location
  }
  up() {
    this.location.row = Math.max((this.location.row - 1), 0)
    return this.location
  }
  left() {
    this.location.column = Math.max((this.location.column - 1), 0)
    return this.location
  }
  right() {
    this.location.column = Math.min((this.location.column + 1), (this.size.columns - 1))
    return this.location
  }
}

let navigationDirections = (keyCode) => {
  // up arrow
  if (keyCode == '38') {
    return 'up'
  }
  // down arrow
  else if (keyCode == '40') {
    return 'down'
  }
  // tab
  else if (keyCode == '9') {
    return 'right'
  }
  // left arrow
  else if (keyCode == '37') {
    return 'left'
  }
  // right arrow
  else if (keyCode == '39') {
    return 'right'
  };
}

class SelectedEmptyElement extends React.Component{
  componentDidMount() {
    this.refs.selectedEmpty.getDOMNode().focus();
  }
  _handleKeyPress(e) {
    this.props.gridKeyPress(e)
  }
  _onAddItem() {
    this.props.onAddItem(this.props.location)
  }
  render() {
    return (
      <div
        ref='selectedEmpty'
        tabIndex='1'
        onClick={this._onAddItem.bind(this)}
        onKeyDown={this._handleKeyPress.bind(this)}/>
    )
  }
}

class UnselectedEmptyElement extends React.Component{
  _handleSelect () {
    this.props.onSelectItem(this.props.location)
  }
  render () {
    return (
      <div onClick={this._handleSelect.bind(this)}/>
    )
  }
}

const Cell = React.createClass({
  _cellType () {
    if (this.props.item) {
      return React.cloneElement(this.props.item, {isSelected: this.props.isSelected, gridKeyPress: this.props.gridKeyPress})
    } else if (this.props.isSelected) {
      return <SelectedEmptyElement location={this.props.location} gridKeyPress={this.props.gridKeyPress} onAddItem={this.props.onAddItem} key={this.props.location}/>
    } else {
      return <UnselectedEmptyElement location={this.props.location} key={this.props.location}/>
    }
  },
  _classes () {
    let classes = 'cell'
    classes += (this.props.isSelected ? ' selected' : ' unSelected')
    classes += (this.props.item ? ' full' : ' empty')
    return classes
  },
  render () {
    return (
      <div className={this._classes()}>
        {this._cellType()}
      </div>
    )
  }
})

const Grid = React.createClass({
  getDefaultProps: function() {
    return {
      size: {
        columns: 5,
        rows: 4
      }
    };
  },
  handleSelect(location) {
    this.props.onMove(location)
  },
  keyPress(e) {
    let direction = navigationDirections(e.keyCode)
    if (direction) {
      e.preventDefault()
      let newLocation = new Mover(this.props.size, this.props.selected)[direction]()
      this.handleSelect(newLocation)
    }
  },
  cell(location) {
   let atThisLocation = (l) => _.isEqual(l, location)
   let isSelected = atThisLocation(this.props.selected)
   let item = this.props.children.filter(function(i) { return (atThisLocation(i.props.item.location)) })[0];
   return (
    <td>
      <Cell
        key={'grid-item', location.row, location.column}
        location={location}
        isSelected={isSelected}
        item={item}
        gridKeyPress={this.keyPress}
        onSelectItem={this.handleSelect}
        onAddItem={this.props.onAddItem}/>
    </td>
    )
  },
  row(row) {
    return (
      upto(this.props.size.columns).map((column) => {
        return(this.cell({row: row, column: column}))
      })
    )
  },
  render () {
    return (
      <div className='grid' onKeyPress={this.handlePress}>
        <table>
          {
            upto(this.props.size.rows).map((row) => {
              return ( <tr> {this.row(row)} </tr>)
            })
          }
        </table>
      </div>
    )
  }
})

module.exports = Grid
