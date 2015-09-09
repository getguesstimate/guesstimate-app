'use strict';

import React from 'react'
import {HotKeys} from 'react-hotkeys';

const SelectedEmptyElement = React.createClass({
  onMove(e) {
    console.log(e)
    this.props.gridKeyPress(e)
  },
  componentDidMount: function(){
    this.refs.foo.getDOMNode().focus();
  },
  onAddItem(foo) {
    //this.props.onAddItem({column: this.props.column, row: this.props.row})
  },
  render () {
    return (
      <div ref='foo' className='empty' tabIndex='1' autoFocus={true} inputAttributes={{autoFocus:true}} onClick={this.onAddItem} onKeyDown={this.onMove}></div>
    )
  }
})

const UnselectedEmptyElement = React.createClass({
  onMove(e) {
    console.log(e)
    this.props.gridKeyPress(e)
  },
  onAddItem() {
    this.props.onAddItem({column: this.props.column, row: this.props.row})
  },
  render () {
    return (
      <div className='empty' tabIndex='1' onClick={this.onAddItem} onKeyDown={this.onMove}></div>
    )
  }
})

const GridElement = React.createClass({
  showItem () {
    return (React.cloneElement(this.props.item, {isSelected: this.props.isSelected, gridKeyPress: this.props.gridKeyPress}))
  },
  showBlank () {
    if (this.props.isSelected){
      return (<SelectedEmptyElement {...this.props} autoFocus={true} key={this.props.column, this.props.row}/>)
    } else {
      return (<UnselectedEmptyElement {...this.props} key={this.props.column, this.props.row}/>)
    }
  },
  render () {
    let show = this.props.item ? this.showItem() : this.showBlank()
    return (<div className={'grid-element ' + (this.props.isSelected ? 'selected' : '')}>{show}</div>)
  }
})

let foo = (size, location, direction) => {

}

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

window.mover = new Mover({rows: 4, columns: 5}, {row: 3, column: 3})

const Grid = React.createClass({
  getDefaultProps: function() {
    return {
      columns: 5,
      rows: 4
    };
  },
  move(direction) {
    let newLocation = new Mover({rows: this.props.rows, columns: this.props.columns}, Object.assign(this.props.selected))[direction]()
    console.log(newLocation)
    this.props.onMove(newLocation)
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
      this.move('down')
        // down arrow
    }
    else if (e.keyCode == '37') {
      this.props.onMove({row: this.props.selected.row, column: this.props.selected.column - 1})
      this.move('left')
       // left arrow
    }
    else if (e.keyCode == '39') {
      this.props.onMove({row: this.props.selected.row, column: this.props.selected.column + 1})
      this.move('right')
       // right arrow
    };
  },
  row(y) {
    return (
     Array.apply(null, {length: this.props.columns}).map(Number.call, Number).map((x) => {
        let isSelected = this.props.selected.row == y && this.props.selected.column == x
        let item = this.props.children.filter(function(i) { return (i.props.row == y && i.props.column == x)})[0];
        return (
          <td> <GridElement gridKeyPress={this.keyPress} key={'grid-item',x,y} item={item} column={x} row={y} isSelected={isSelected} onAddItem={this.props.onAddItem}/></td>
        )
      })
    )
  },
  render () {
    return (
      <div className='grid' onKeyPress={this.handlePress}>
        <table>
          {
            Array.apply(null, {length: this.props.rows}).map(Number.call, Number).map((i) => {
              return ( <tr> {this.row(i)} </tr>)
            })
          }
        </table>
      </div>
    )
  }
})

module.exports = Grid
