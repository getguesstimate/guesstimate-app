'use strict';
import React, {Component, PropTypes} from 'react'
import _ from 'lodash'

import './grid.css'
import Cell from './cell'
import EdgeContainer from './edge-container.js'
import {keycodeToDirection, DirectionToLocation} from './utils'

import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

let upto = (n) => Array.apply(null, {length: n}).map(Number.call, Number)

@DragDropContext(HTML5Backend)
export default class Grid extends Component{
  displayName: 'Grid'

  static propTypes = {
    children: PropTypes.node,
    edges: PropTypes.array.isRequired,
    handleSelect: PropTypes.func.isRequired,
    onAddItem: PropTypes.func.isRequired,
    onMoveItem: PropTypes.func.isRequired,
    selected: PropTypes.object.isRequired,
    size: PropTypes.object,
    showEdges: PropTypes.bool
  }

  _handleKeyPress(e) {
    let direction = keycodeToDirection(e.keyCode)
    if (direction) {
      e.preventDefault()
      const size = ({columns: this._columnCount(), rows: this._rowCount()})
      let newLocation = new DirectionToLocation(size, this.props.selected)[direction]()
      this.props.handleSelect(newLocation)
    }
  }

  size(){
    const lowestItem = !this.props.children.length ? 2 : Math.max(...this.props.children.map(g => parseInt(g.location.row))) + 2
    const selected = parseInt(this.props.selected.row) + 2
    const height = Math.max(3, lowestItem, selected) || 3;
    return {columns: 20, rows: height}
  }

  _rowCount() {
    const lowestItem = Math.max(...this.props.children.map(e => parseInt(e.props.location.row))) + 2
    const selected = parseInt(this.props.selected.row) + 2
    return Math.max(20, lowestItem, selected) || 6;
  }

  _columnCount() {
    return 15
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
        key={'grid-item', location.row, location.column}
        location={location}
        onAddItem={this.props.onAddItem}
        onMoveItem={this.props.onMoveItem}
        ref={`cell-${location.row}-${location.column}`}
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
    const {edges, showEdges} = this.props

    return (
      <div
          className='GiantGrid'
          onKeyPress={this._handleKeyPress.bind(this)}
      >
        {
          upto(rowCount).map((row) => {
            return (
              <div
                  className='GiantRow'
                  key={row}
                  ref={`row-${row}`}
              >
                {this._row(row, columnCount)}
              </div>
            )
          })
        }
        <EdgeContainer
            edges={edges}
            refs={this.refs}
            rowCount={rowCount}
        />
      </div>
    )
  }
}
