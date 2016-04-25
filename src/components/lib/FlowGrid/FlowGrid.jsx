'use strict';
import React, {Component, PropTypes} from 'react'

import './FlowGrid.css'
import Cell from './cell'
import EdgeContainer from './edge-container.js'
import HorizontalIndex from './HorizontalIndex.js'
import VerticalIndex from './VerticalIndex.js'

import {keycodeToDirection, DirectionToLocation} from './utils'

import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

let upto = (n) => Array.apply(null, {length: n}).map(Number.call, Number)

const PTLocation = PropTypes.shape({
  column: PropTypes.number,
  row: PropTypes.number
})

@DragDropContext(HTML5Backend)
export default class FlowGrid extends Component{
  displayName: 'FlowGrid'

  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
      location: PTLocation.isRequired,
      component: PropTypes.object.isRequired
    })),
    edges: PropTypes.arrayOf(PropTypes.shape({
      input: PTLocation.isRequired,
      output: PTLocation.isRequired
    })),
    selected: PTLocation,

    onSelectItem: PropTypes.func.isRequired,
    onAddItem: PropTypes.func.isRequired,
    onMoveItem: PropTypes.func.isRequired,

    showGridLines: PropTypes.bool
  }

  static defaultProps = {
    showGridLines: true,
  }

  state = { rowHeights: [] }

  _handleKeyPress(e) {
    let direction = keycodeToDirection(e.keyCode)
    if (direction) {
      e.preventDefault()
      const size = ({columns: this._columnCount(), rows: this._rowCount()})
      let newLocation = new DirectionToLocation(size, this.props.selected)[direction]()
      this.props.onSelectItem(newLocation)
    }
  }

  size(){
    const lowestItem = !this.props.items.length ? 2 : Math.max(...this.props.items.map(g => parseInt(g.location.row))) + 2
    const selected = parseInt(this.props.selected.row) + 2
    const height = Math.max(3, lowestItem, selected) || 3;
    return {columns: this._columnCount(), rows: height}
  }

  _rowCount() {
    const lowestItem = Math.max(...this.props.items.map(e => parseInt(e.location.row))) + 4
    const selected = parseInt(this.props.selected.row) + 3
    return Math.max(10, lowestItem, selected) || 6;
  }

  _columnCount() {
    const lowestItem = Math.max(...this.props.items.map(e => parseInt(e.location.column))) + 3
    const selected = parseInt(this.props.selected.column) + 3
    return Math.max(6, lowestItem, selected) || 6;
  }

  _cell(location) {
   let atThisLocation = (l) => (l.row === location.row && l.column === location.column)
   let isSelected = atThisLocation(this.props.selected)
   let item = this.props.items.filter(i => atThisLocation(i.location))[0];
   return (
    <Cell
        gridKeyPress={this._handleKeyPress.bind(this)}
        handleSelect={this.props.onSelectItem}
        isSelected={isSelected}
        item={item && item.component}
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

  componentDidUpdate() {
    const newHeights = upto(this._rowCount()).map(rowI => _.get(this.refs[`row-${rowI}`], 'offsetHeight'))
    if (!_.isEqual(newHeights, this.state.rowHeights)){
      this.setState({rowHeights: newHeights})
    }
  }

  render() {
    const rowCount = this._rowCount()
    const columnCount = this._columnCount()
    const {rowHeights} = this.state
    const {edges} = this.props
    let className = 'FlowGrid'
    className += this.props.showGridLines ? ' withLines' : ''

    return (
      <div
          className='FlowGrid-Container'
      >
        <div className='FlowGrid-Horizontal-Motion'>
          <div
              className={className}
              onKeyPress={this._handleKeyPress.bind(this)}
          >
            {
              upto(rowCount).map((row) => {
                return (
                  <div
                      className='FlowGridRow'
                      key={row}
                      ref={`row-${row}`}
                  >
                  {this._row(row, columnCount)}
                  </div>
                )
              })
            }
            {!_.isEmpty(edges) &&
              <EdgeContainer
                  edges={edges}
                  refs={this.refs}
                  rowCount={rowCount}
                  rowHeights={rowHeights}
                />
            }
          </div>
        </div>
      </div>
    )
  }
}
