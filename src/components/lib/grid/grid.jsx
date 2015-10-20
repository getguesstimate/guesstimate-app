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
        ref={item && item.props.metric.id}
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

        //{
          //this.props.edges.map((edge) => {
            //if (this.refs[edge.input] && this.refs[edge.output]) {
              //let bar =  {
                //input: this.refs[edge.input].getPosition(),
                //output: this.refs[edge.output].getPosition()
              //}
              //return (<Edge input={bar.input} output={bar.output}/>)
            //}
          //})
        //}
const dim = ({top,left,height,width}) => {
  return {
    top: top + (height/2),
    left: left + (width/2)
  }
}

class Edge extends Component{
  displayName: 'Edge'

  shouldComponentUpdate(nextProps) {
    return (this.props !== nextProps)
  }

  render() {
    const input = dim(this.props.input)
    const output = dim(this.props.output)
    const maxWidth = Math.max(input.left, output.left) + 10
    const maxHeight = Math.max(input.top, output.top) + 10
    const points = `${input.left},${input.top + 5} ${output.left},${output.top + 5}`
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
