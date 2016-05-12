'use strict';
import React, {Component, PropTypes} from 'react'

import './FlowGrid.css'
import Cell from './cell'
import EdgeContainer from './edge-container.js'

import {keycodeToDirection, DirectionToLocation} from './utils'
import {removeMetric} from 'gModules/metrics/actions.js'

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
    multipleSelected: PropTypes.arrayOf(PTLocation, PTLocation),

    onSelectItem: PropTypes.func.isRequired,
    onDeSelectItem: PropTypes.func.isRequired,
    onMultipleSelect: PropTypes.func,
    onAddItem: PropTypes.func.isRequired,
    onMoveItem: PropTypes.func.isRequired,
    onCopy: PropTypes.func,
    onPaste: PropTypes.func,

    showGridLines: PropTypes.bool
  }

  static defaultProps = {
    showGridLines: true,
  }

  state = {
    rowHeights: [],
    hover: {row: -1, column: -1} // An impossible location means nothing hovered.
  }

  _handleKeyUp(e){
    if (e.keyCode == '17' || e.keyCode == '224' || e.keyCode == '91') {
      this.setState({ctrlPressed: false})
    }
  }

  _selectedItems() {
   const {multipleSelected} = this.props
   return this.props.items.filter(i => (multipleSelected[0].row <= i.location.row && multipleSelected[0].column <= i.location.column &&
      multipleSelected[1].row >= i.location.row && multipleSelected[1].column >= i.location.column))
  }

  _handleKeyDown(e){
    if (!!e.skipFlowGrid) {
      return
    }
    if (e.keyCode === 8 || e.keyCode === 46) {
      const selectedItems = this._selectedItems()
      selectedItems.map(i => {this.props.dispatch(removeMetric(i.component.props.metric.id))})
      e.preventDefault()
    }

    let direction = keycodeToDirection(e.keyCode)
    if (direction) {
      e.preventDefault()
      const size = ({columns: this._columnCount(), rows: this._rowCount()})
      let newLocation = new DirectionToLocation(size, this.props.selected)[direction]()
      this.props.onSelectItem(newLocation)
    } else if (e.keyCode == '17' || e.keyCode == '224' || e.keyCode == '91') {
      e.preventDefault()
      this.setState({ctrlPressed: true})
    } else if (e.keyCode == '86' && this.state.ctrlPressed) {
      console.log("Pasting", Math.random())
      this.props.onPaste()
    } else if (e.keyCode == '67' && this.state.ctrlPressed) {
      console.log("Copying", Math.random())
      this.props.onCopy()
    }
  }

  _handleEndRangeSelect(corner1) {
    const corner2 = this.props.selected

    if (!corner2 || !(corner2.hasOwnProperty('row') && corner2.hasOwnProperty('column'))) {
      this.props.onSelectItem(corner1)
      return
    }

    const leftX = Math.min(corner1.row, corner2.row)
    const topY = Math.max(corner1.column, corner2.column)
    const rightX = Math.max(corner1.row, corner2.row)
    const bottomY = Math.min(corner1.column, corner2.column)
    this.props.onMultipleSelect({row: leftX, column: bottomY}, {row: rightX, column: topY})
    this.props.onDeSelectItem()
  }

  size(){
    const lowestItem = !this.props.items.length ? 2 : Math.max(...this.props.items.map(g => parseInt(g.location.row))) + 2
    const selected = parseInt(this.props.selected.row) + 2
    const height = Math.max(3, lowestItem, selected) || 3;
    return {columns: this._columnCount(), rows: height}
  }

  _rowCount() {
    const lowestItem = Math.max(...this.props.items.map(e => parseInt(e.location.row))) + 4
    let selectedRow = this.props.selected.row || 0
    const selected = parseInt(selectedRow) + 3
    return Math.max(10, lowestItem, selected) || 6;
  }

  _columnCount() {
    const lowestItem = Math.max(...this.props.items.map(e => parseInt(e.location.column))) + 4
    let selectedColumn = this.props.selected.column || 0
    const selected = parseInt(selectedColumn) + 4
    return Math.max(6, lowestItem, selected) || 6;
  }

  _cell(location) {
    const atThisLocation = (l) => (l.row === location.row && l.column === location.column)

    const isHovered = atThisLocation(this.state.hover)

    const isSinglySelected = atThisLocation(this.props.selected)

    const {multipleSelected} = this.props
    const isWithinMultiselect = (multipleSelected[0].row <= location.row && multipleSelected[0].column <= location.column &&
       multipleSelected[1].row >= location.row && multipleSelected[1].column >= location.column)

    let item = this.props.items.filter(i => atThisLocation(i.location))[0];
    return (
      <Cell
        hasItemUpdated={this.props.hasItemUpdated}
        gridKeyPress={this._handleKeyDown.bind(this)}
        handleSelect={this.props.onSelectItem}
        handleEndRangeSelect={this._handleEndRangeSelect.bind(this)}
        isSelected={isWithinMultiselect}
        isSinglySelected={isSinglySelected}
        isHovered={isHovered}
        item={item && item.component}
        key={'grid-item', location.row, location.column}
        location={location}
        onAddItem={this.props.onAddItem}
        onMoveItem={this.props.onMoveItem}
        onMouseOver={() => {this.setState({hover: location})}}
        canvasState={this.props.canvasState}
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
            onKeyDown={this._handleKeyDown.bind(this)}
            onKeyUp={this._handleKeyUp.bind(this)}
            onMouseOut={() => {this.setState({hover: {row: -1, column: -1}})}}
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
