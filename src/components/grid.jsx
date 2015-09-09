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

const SelectedEmptyElement = React.createClass({
  onMove(e) {
    this.props.gridKeyPress(e)
  },
  componentDidMount: function(){
    this.refs.selectedEmpty.getDOMNode().focus();
  },
  onAddItem(foo) {
    this.props.onAddItem(this.props.location)
  },
  render () {
    return (
      <div
        ref='selectedEmpty'
        className='empty'
        tabIndex='1'
        inputAttributes={{autoFocus:true}}
        onClick={this.onAddItem}
        onKeyDown={this.onMove}></div>
    )
  }
})

const UnselectedEmptyElement = React.createClass({
  onMove(e) {
    this.props.gridKeyPress(e)
  },
  onAddItem() {
    this.props.onAddItem(this.props.location)
  },
  onSelectItem() {
    this.props.onSelectItem(this.props.location)
  },
  render () {
    return (
      <div className='empty' tabIndex='1' onClick={this.onSelectItem} onKeyDown={this.onMove}></div>
    )
  }
})

const Cell = React.createClass({
  showItem () {
    return (React.cloneElement(this.props.item, {isSelected: this.props.isSelected, gridKeyPress: this.props.gridKeyPress}))
  },
  showBlank () {
    if (this.props.isSelected){
      return (<SelectedEmptyElement {...this.props} autoFocus={true} key={this.props.location}/>)
    } else {
      return (<UnselectedEmptyElement {...this.props} key={this.props.location}/>)
    }
  },
  render () {
    let show = this.props.item ? this.showItem() : this.showBlank()
    return (<div className={'cell ' + (this.props.isSelected ? 'selected' : '')}>{show}</div>)
  }
})

const Grid = React.createClass({
  getDefaultProps: function() {
    return {
      columns: 5,
      rows: 4
    };
  },
  move(direction) {
    let newLocation = new Mover({rows: this.props.rows, columns: this.props.columns}, Object.assign(this.props.selected))[direction]()
    this.props.onMove(newLocation)
  },
  handleSelect(location) {
    this.props.onMove(location)
  },
  keyPress(e) {
    // up arrow
    if (e.keyCode == '38') {
      this.move('up')
    }
    // down arrow
    else if (e.keyCode == '40') {
      e.preventDefault()
      this.move('down')
    }
    else if (e.keyCode == '9') {
      e.preventDefault()
      this.move('right')
        // down arrow
    }
    else if (e.keyCode == '37') {
      this.move('left')
       // left arrow
    }
    else if (e.keyCode == '39') {
      this.move('right')
       // right arrow
    };
  },
  row(row) {
    return (
     upto(this.props.columns).map((column) => {
       let location = {row: row, column: column}
       let atThisLocation = (l) => _.isEqual(l, location)

       let isSelected = atThisLocation(this.props.selected)
       let item = this.props.children.filter(function(i) { return (atThisLocation(i.props.item.location)) })[0];
       return (
        <td>
          <Cell
            gridKeyPress={this.keyPress}
            key={'grid-item',location}
            item={item}
            location={location}
            isSelected={isSelected}
            onSelectItem={this.handleSelect}
            onAddItem={this.props.onAddItem}/>
        </td>
        )
      })
    )
  },
  render () {
    return (
      <div className='grid' onKeyPress={this.handlePress}>
        <table>
          {
            upto(this.props.rows).map((row) => {
              return ( <tr> {this.row(row)} </tr>)
            })
          }
        </table>
      </div>
    )
  }
})

module.exports = Grid
