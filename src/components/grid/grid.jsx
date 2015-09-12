'use strict';

import React from 'react'
import _ from 'lodash'

import styles from './grid.styl'
import Cell from './cell'
import {keycodeToDirection, DirectionToLocation} from './utils'

let upto = (n) => Array.apply(null, {length: n}).map(Number.call, Number)

const Grid = React.createClass({
  getDefaultProps: function() {
    return {
      size: {
        columns: 6,
        rows: 20
      }
    };
  },
  keyPress(e) {
    let direction = keycodeToDirection(e.keyCode)
    if (direction) {
      e.preventDefault()
      let newLocation = new DirectionToLocation(this.props.size, this.props.selected)[direction]()
      this.props.handleSelect(newLocation)
    }
  },
  _cell(location) {
   let atThisLocation = (l) => _.isEqual(l, location)
   let isSelected = atThisLocation(this.props.selected)
   let item = this.props.children.filter(function(i) { return (atThisLocation(i.props.item.location)) })[0];
   return (
    <td key={'grid-item', location.row, location.column}>
      <Cell
        location={location}
        isSelected={isSelected}
        item={item}
        gridKeyPress={this.keyPress}
        handleSelect={this.props.handleSelect}
        onAddItem={this.props.onAddItem}/>
    </td>
    )
  },
  _row(row) {
    return (
      upto(this.props.size.columns).map((column) => {
        return(this._cell({row: row, column: column}))
      })
    )
  },
  render() {
    return (
      <div className='grid' onKeyPress={this.handlePress}>
        <table>
          {
            upto(this.props.size.rows).map((row) => {
              return ( <tr key={row}> {this._row(row)} </tr>)
            })
          }
        </table>
      </div>
    )
  }
})

module.exports = Grid
