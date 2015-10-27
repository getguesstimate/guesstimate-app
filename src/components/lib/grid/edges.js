import React, {Component, PropTypes} from 'react'
import Edge from './edge';
import _ from 'lodash'

let upto = (n) => Array.apply(null, {length: n}).map(Number.call, Number)
const PADDING_WIDTH = 10

export default class Edges extends Component {
  displayName: 'Edges'

  static propTypes = {
    columnWidth: PropTypes.number,
    containerHeight: PropTypes.number,
    containerWidth: PropTypes.number,
    edges: PropTypes.array.isRequired,
    rowHeights: PropTypes.array.isRequired,
  }

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
             refx=\"2\" refy=\"1.5\" orient=\"auto\"> \
            <path d=\"M 0,0 V 3 L3,1.5 Z\" class=\"arrow\"/> \
           </marker>";
  }

  render() {
    const {columnWidth, containerHeight, containerWidth, edges, rowHeights} = this.props
    const showEdges = _.get(edges, 'length') && _.get(rowHeights, 'length') && columnWidth
    return (
      <div className='GiantGrid--Arrows'>
        <svg
            className='edge'
            height={containerHeight}
            width={containerWidth}
        >
          <defs dangerouslySetInnerHTML={{__html: this.defs()}}/>
          {showEdges &&
            edges.map(e => {
              const input = this._toRectangle(e.input)
              const output = this._toRectangle(e.output)
              return (<Edge key={JSON.stringify(e)} input={input} output={output}/>)
            })
          }
        </svg>
      </div>
    )
  }
}

