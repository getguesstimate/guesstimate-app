'use strict';
import React, {Component, PropTypes} from 'react'
import _ from 'lodash'

import styles from './grid.css'
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
      this.props.handleSelect(newLocation)
    }
  }

  size(){
    const lowestMetric = !this.props.metrics.length ? 2 : Math.max(...this.props.metrics.map(g => parseInt(g.location.row))) + 2
    const selected = parseInt(this.props.selected.row) + 2
    const height = Math.max(3, lowestMetric, selected) || 3;
    return {columns: 6, rows: height}
  }

  _rowCount() {
    const lowestItem = Math.max(...this.props.children.map(e => parseInt(e.props.location.row))) + 2
    const selected = parseInt(this.props.selected.row) + 2
    return Math.max(8, lowestItem, selected) || 6;
  }

  _columnCount() {
    return 6
  }

  _cell(location) {
   let atThisLocation = (l) => _.isEqual(l, location)
   let isSelected = atThisLocation(this.props.selected)
   let item = this.props.children.filter(function(i) { return (atThisLocation(i.props.location)) })[0];
   return (
    <Cell
        gridKeyPress={this._handleKeyPress.bind(this)}
        handleSelect={this.props.handleSelect}
        isSelected={isSelected}
        item={item}
        location={location}
        onAddItem={this.props.onAddItem}
        key={'grid-item', location.row, location.column}
    />
    )
  }
  _row(row, columnCount) {
    return (
      upto(columnCount).map((column) => {
        return(this._cell({row: row, column: column}))
      })
    )
  }
  render() {
    const rowCount = this._rowCount()
    const columnCount = this._columnCount()
    return (
      <div
          className='GiantGrid'
          onKeyPress={this._handleKeyPress.bind(this)}
      >
        {
          upto(rowCount).map((row) => {
            return ( <div className='GiantRow' key={row}> {this._row(row, columnCount)} </div>)
          })
        }
      </div>
    )
  }
}
