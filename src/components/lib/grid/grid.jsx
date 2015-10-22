'use strict';
import React, {Component, PropTypes} from 'react'
import _ from 'lodash'
import $ from 'jquery'
import Dimensions from 'gComponents/utility/react-dimensions';

import styles from './grid.css'
import Cell from './cell'
import {keycodeToDirection, DirectionToLocation} from './utils'

let upto = (n) => Array.apply(null, {length: n}).map(Number.call, Number)

@Dimensions()
export default class Grid extends Component{
  displayName: 'Grid'

  static propTypes = {
    children: PropTypes.node,
    handleSelect: PropTypes.func.isRequired,
    onAddItem: PropTypes.func.isRequired,
    onMoveItem: PropTypes.func.isRequired,
    selected: PropTypes.object.isRequired,
    size: PropTypes.object,
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
        onMoveItem={this.props.onMoveItem}
        key={'grid-item', location.row, location.column}
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

  _columnWidth() {
    return (this.props.containerWidth / this._columnCount())
  }

  render() {
    const rowCount = this._rowCount()
    const columnCount = this._columnCount()

    const rowHeights = upto(rowCount).map(rowI => _.get(this.refs[`row-${rowI}`], 'offsetHeight'))
    const columnWidth = this._columnWidth()
    const {edges} = this.props

    return (
      <div
          className='GiantGrid'
          onKeyPress={this._handleKeyPress.bind(this)}
      >
        {
          upto(rowCount).map((row) => {
            return ( <div className='GiantRow' key={row} ref={`row-${row}`}> {this._row(row, columnCount)} </div>)
          })
        }
        {_.get(rowHeights, 'length') && _.get(edges, 'length') && columnWidth &&
          <Edges
              columnWidth={columnWidth}
              edges={this.props.edges}
              rowHeights={rowHeights}
           />
         }
      </div>
    )
  }
}

class Edges extends Component {
  displayName: 'Edges'

  _pointCoords({row, column}) {
    return {y: this._rowY(row), x: this._columnX(column)}
  }

  _rowY(row) {
    if ((row !== undefined) && this.props.rowHeights){
      const above = upto(row+1).map(r => this.props.rowHeights[r]).reduce((a,b) => a + b)
      const middle = (parseFloat(this.props.rowHeights[row])/2)
      return above - middle
    }
  }

  _columnX(column) {
    return this.props.columnWidth && (column * this.props.columnWidth) + (this.props.columnWidth / 2)
  }

  render() {
    //const edges = this.props.edges.map(e => { return {input: this._pointCoords(e.input), output: this._pointCoords(e.output)} })
    return (
      <div>
        {this.props.edges.map(e => {
          const coords = {input: this._pointCoords(e.input), output: this._pointCoords(e.output)}
          return (<Edge edge={coords} key={JSON.stringify(e)}/>)
        })}
      </div>
    )
  }
}

class Edge extends Component{
  displayName: 'Edge'

  shouldComponentUpdate(nextProps) {
    return (!_.isEqual(this.props !== nextProps))
  }

  render() {
    const input = this.props.edge.input;
    const output = this.props.edge.output;
    const maxWidth = Math.max(input.x, output.x) + 10
    const maxHeight = Math.max(input.y, output.y) + 10
    const points = `${input.x},${input.y + 5} ${output.x},${output.y + 5}`
    return (
        <svg height={maxHeight} width={maxWidth} className='edge'>
        <polyline
            points={points}
            strokeWidth="5"
            fill="none" />
        </svg>
    )
  }
}
