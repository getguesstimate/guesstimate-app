'use strict';
import React, {Component, PropTypes} from 'react'
import _ from 'lodash'
import $ from 'jquery'
import Dimensions from 'gComponents/utility/react-dimensions';

import styles from './grid.css'
import Cell from './cell'
import {keycodeToDirection, DirectionToLocation} from './utils'

import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

let upto = (n) => Array.apply(null, {length: n}).map(Number.call, Number)

@DragDropContext(HTML5Backend)
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

  render() {
    const rowCount = this._rowCount()
    const columnCount = this._columnCount()

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
          <EdgeContainer
              edges={this.props.edges}
              refs={this.refs}
              rowCount={rowCount}
           />
      </div>
    )
  }
}

//Listens to events for changes to row heights and column width
@Dimensions()
class EdgeContainer extends Component {
  displayName: 'EdgeContainer'

  state = {
    columnWidth: null
  }

  componentWillUpdate(newProps) {
    if (newProps.containerWidth !== this.props.containerWidth){
      this.getColumnWidth()
    }
  }

  componentWillMount() {
    this.getColumnWidth()
  }

  getColumnWidth() {
    const width = $('.GiantCell') && $('.GiantCell')[0] && $('.GiantCell')[0].offsetWidth
    this.setState({columnWidth: width})
  }

  render() {
    const rowHeights = upto(this.props.rowCount).map(rowI => _.get(this.props.refs[`row-${rowI}`], 'offsetHeight'))
    const edges = this.props.edges
    const {columnWidth} = this.state
    const containerHeight = rowHeights && rowHeights.length && rowHeights.reduce((a,b) => a + b)
    return (
      <Edges
          edges={this.props.edges}
          rowHeights={rowHeights}
          columnWidth={columnWidth}
          containerWidth={this.props.containerWidth}
          containerHeight={containerHeight}
       />
    )
  }
}

const PADDING_WIDTH = 3

class Edges extends Component {
  displayName: 'Edges'

  _pointCoords({row, column}) {
    return {y: this._rowY(row), x: this._columnX(column)}
  }

  _rowY(row) {
    if ((row !== undefined) && this.props.rowHeights){
      let rowHeights = [0, ...this.props.rowHeights]
      let top = upto(row+1).map(r => rowHeights[r]).reduce((a,b) => a + b)
      let bottom = top + this.props.rowHeights[row]
      top += PADDING_WIDTH
      bottom -= PADDING_WIDTH
      return {top, bottom}
    }
  }

  _columnX(column) {
    const {columnWidth} = this.props
    let left = column * columnWidth
    let right = left + columnWidth
    left += PADDING_WIDTH
    right -= PADDING_WIDTH
    return {left, right}
  }

  _toRectangle({row, column}) {
    return Object.assign(this._rowY(row), this._columnX(column))
  }

  defs() {
    return "<marker id=\"markerArrow\" markerWidth=\"3\" markerHeight=\"3\" \
             refx=\"3\" refy=\"1.5\" orient=\"auto\"> \
            <path d=\"M 0,0 V 3 L3,1.5 Z\" class=\"arrow\"/> \
           </marker>";
  }

  render() {
    return (
      <div className='GiantGrid--Arrows'>
        <svg height={this.props.containerHeight} width={this.props.containerWidth} className='edge'>
          <defs dangerouslySetInnerHTML={{__html: this.defs()}}/>

          {_.get(this.props.edges, 'length') && _.get(this.props.rowHeights, 'length') && this.props.columnWidth &&
            this.props.edges.map(e => {
              const coords = {input: this._toRectangle(e.input), output: this._toRectangle(e.output)}
              return (<Edge edge={coords} key={JSON.stringify(e)}/>)
            })
          }
        </svg>
      </div>
    )
  }
}

//const isVertical = dd
class Rectangle {
  constructor(locations){
    this.left = locations.left
    this.right = locations.right
    this.top = locations.top
    this.bottom = locations.bottom
  }

  _xMiddle() { return (this.left + ((this.right - this.left)/2)) }
  _yMiddle() {  return (this.top + ((this.bottom - this.top)/2)) }

  topPoint() { return {x: this._xMiddle(), y: this.top} }
  bottomPoint() { return {x: this._xMiddle(), y: this.bottom} }
  leftPoint() { return {x: this.left, y: this._yMiddle()} }
  rightPoint() { return {x: this.right, y: this._yMiddle()} }

  positionFrom(otherRectangle) {
    const sameRow = (Math.abs(otherRectangle.top - this.top) < 200)
    if (sameRow) {
      if (this.right > otherRectangle.right) {
        return 'ON_LEFT'
      } else {
        return 'ON_RIGHT'
      }
    } else {
      if (this.top > otherRectangle.top) {
        return 'ON_TOP'
      } else {
        return 'ON_BOTTOM'
      }
    }
  }

  showPosition(otherRectangle) {
    const positionFrom = this.positionFrom(otherRectangle)
    switch (positionFrom) {
    case 'ON_LEFT':
      return this.leftPoint()
    case 'ON_RIGHT':
      return this.rightPoint()
    case 'ON_TOP':
      return this.topPoint()
    case 'ON_BOTTOM':
      return this.bottomPoint()
    }
  }
}

class Edge extends Component{
  displayName: 'Edge'

  shouldComponentUpdate(nextProps) {
    return (!_.isEqual(this.props !== nextProps))
  }

  render() {
    const {input, output}  = this.props.edge;
    //const points = `${input.left},${input.top} ${input.right},${input.top} ${input.right},${input.bottom} ${input.left},${input.bottom}`
    const inputPoints = (new Rectangle(input)).showPosition(output)
    const outputPoints = (new Rectangle(output)).showPosition(input)
    let points = null

    points = `M${inputPoints.x},${inputPoints.y} L${outputPoints.x-2} ,${outputPoints.y-2}`

    //if (inputPoints.y == outputPoints.y){
      //points = `M${inputPoints.x},${inputPoints.y} L${outputPoints.x},${outputPoints.y}`
    //} else {
      //if (inputPoints.y > outputPoints.y) {
        //points = `M${inputPoints.x},${inputPoints.y} L${inputPoints.x},${inputPoints.y - 2} L${outputPoints.x},${inputPoints.y - 2} L${outputPoints.x},${outputPoints.y}`
      //} else {
        //points = `M${inputPoints.x},${inputPoints.y} L${inputPoints.x},${inputPoints.y + 2} L${outputPoints.x},${inputPoints.y + 2} L${outputPoints.x},${outputPoints.y}`
      //}
    //}

    return (
        <path
            className='basic-arrow'
            d={points}
            strokeWidth="3"
            markerEnd='url(#markerArrow)'
            fill="none"
        />
    )
  }
}
