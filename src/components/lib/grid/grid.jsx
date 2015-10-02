'use strict';
import React, {Component, PropTypes} from 'react'
import _ from 'lodash'

import styles from './grid.styl'
import Cell from './cell'
import {keycodeToDirection, DirectionToLocation} from './utils'

let upto = (n) => Array.apply(null, {length: n}).map(Number.call, Number)

export default class Grid extends Component{
  displayName: 'Grid'

  static propTypes = {
    children: PropTypes.node,
    handleSelect: PropTypes.func,
    onAddItem: PropTypes.func,
    selected: PropTypes.object,
    size: PropTypes.object,
  }

  static defaultProps = {
    size: {
      columns: 6,
      rows: 8
    }
  }

  _handleKeyPress(e) {
    let direction = keycodeToDirection(e.keyCode)
    if (direction) {
      e.preventDefault()
      let newLocation = new DirectionToLocation(this.props.size, this.props.selected)[direction]()
      this.props.handleSelect(e, newLocation)
    }
  }
  _cell(location) {
   let atThisLocation = (l) => _.isEqual(l, location)
   let isSelected = atThisLocation(this.props.selected)
   let item = this.props.children.filter(function(i) { return (atThisLocation(i.props.location)) })[0];
   return (
    <td key={'grid-item', location.row, location.column}>
      <Cell
          gridKeyPress={this._handleKeyPress.bind(this)}
          handleSelect={this.props.handleSelect}
          isSelected={isSelected}
          item={item}
          location={location}
          onAddItem={this.props.onAddItem}
      />
    </td>
    )
  }
  _row(row) {
    return (
      upto(this.props.size.columns).map((column) => {
        return(this._cell({row: row, column: column}))
      })
    )
  }
  render() {
    return (
      <div
          className='grid'
          onKeyPress={this._handleKeyPress.bind(this)}
      >
        <table>
          <tbody>
            {
              upto(this.props.size.rows).map((row) => {
                return ( <tr key={row}> {this._row(row)} </tr>)
              })
            }
          </tbody>
        </table>
      </div>
    )
  }
}
