'use strict';
import React, {Component, PropTypes} from 'react'

import './FlowGrid.css'
import Cell from './cell'
import BackgroundContainer from './background-container.js'

import {keycodeToDirection, DirectionToLocation} from './utils'

import {isLocation, isWithinRegion, isAtLocation, PTLocation} from 'lib/locationUtils.js'

import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

let upto = (n) => Array.apply(null, {length: n}).map(Number.call, Number)

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
    selectedCell: PTLocation,
    selectedRegion: PropTypes.arrayOf(PTLocation, PTLocation),
    onSelectItem: PropTypes.func.isRequired,
    onMultipleSelect: PropTypes.func.isRequired,
    onDeSelectAll: PropTypes.func.isRequired,
    onAddItem: PropTypes.func.isRequired,
    onMoveItem: PropTypes.func.isRequired,
    onRemoveItem: PropTypes.func.isRequired,
    onCopy: PropTypes.func.isRequired,
    onPaste: PropTypes.func.isRequired,

    showGridLines: PropTypes.bool,

    overflow: PropTypes.string,
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
   return this.props.items.filter(i => isWithinRegion(i.location, this.props.selectedRegion))
  }

  _handleRemoveSelectedItems() {
    const selectedItems = this._selectedItems()
    selectedItems.map(i => {this.props.onRemoveItem(i.key)})
  }

  _handleKeyDown(e){
    if (e.target && e.target.type === 'textarea') { return }
    if (e.keyCode === 8 || e.keyCode === 46) {
      this._handleRemoveSelectedItems()
      e.preventDefault()
    }

    let direction = keycodeToDirection(e.keyCode)
    if (direction) {
      e.preventDefault()
      const size = ({columns: this._columnCount(), rows: this._rowCount()})
      let newLocation = new DirectionToLocation(size, this.props.selectedCell)[direction]()
      this.props.onSelectItem(newLocation)
    } else if (!e.shiftKey && (e.keyCode == '17' || e.keyCode == '224' || e.keyCode == '91')) {
      e.preventDefault()
      this.setState({ctrlPressed: true})
    } else if (this.state.ctrlPressed) {
      if (e.keyCode == '86') {
        this.props.onPaste()
      } else if (e.keyCode == '67') {
        this.props.onCopy()
      } else if (e.keyCode == '88') {
        this.props.onCopy()
        this._handleRemoveSelectedItems()
      }
    }
  }

  _handleEndRangeSelect(corner1) {
    const corner2 = this.props.selectedCell

    if (!isLocation(corner2)) {
      this.props.onSelectItem(corner1)
      return
    }

    this.props.onMultipleSelect(corner1, corner2)
  }

  size() {
    const lowestItem = !this.props.items.length ? 2 : Math.max(...this.props.items.map(g => parseInt(g.location.row))) + 2
    const selected = parseInt(this.props.selectedCell.row) + 2
    const height = Math.max(3, lowestItem, selected) || 3;
    return {columns: this._columnCount(), rows: height}
  }

  _rowCount() {
    const lowestItem = Math.max(...this.props.items.map(e => parseInt(e.location.row))) + 4
    let selectedRow = this.props.selectedCell.row || 0
    const selected = parseInt(selectedRow) + 3
    return Math.max(10, lowestItem, selected) || 6;
  }

  _columnCount() {
    const lowestItem = Math.max(...this.props.items.map(e => parseInt(e.location.column))) + 4
    let selectedColumn = this.props.selectedCell.column || 0
    const selected = parseInt(selectedColumn) + 4
    return Math.max(6, lowestItem, selected) || 6;
  }

  _cell(location) {
    const item = this.props.items.find(i => isAtLocation(i.location, location));
    return (
      <Cell
        hasItemUpdated={this.props.hasItemUpdated}
        gridKeyPress={this._handleKeyDown.bind(this)}
        handleSelect={this.props.onSelectItem}
        handleEndRangeSelect={this._handleEndRangeSelect.bind(this)}
        inSelectedRegion={isWithinRegion(location, this.props.selectedRegion)}
        inSelectedCell={isAtLocation(this.props.selectedCell, location)}
        isHovered={isAtLocation(this.state.hover, location)}
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

  componentWillUnmount() {
    this.props.onDeSelectAll()
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
          style={{overflow: this.props.overflow }}
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
              <BackgroundContainer
                  edges={edges}
                  refs={this.refs}
                  rowCount={rowCount}
                  rowHeights={rowHeights}
                  selectedRegion={this.props.selectedRegion}
                />
          </div>
        </div>
      </div>
    )
  }
}
