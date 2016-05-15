import React, {Component, PropTypes} from 'react'
import Edge from './edge';
import _ from 'lodash'
import GridPoint from './gridPoints.js'

let upto = (n) => Array.apply(null, {length: n}).map(Number.call, Number)
const PADDING_WIDTH = 5

export default class Edges extends Component {
  displayName: 'Edges'

  static propTypes = {
    columnWidth: PropTypes.number,
    containerHeight: PropTypes.number,
    edges: PropTypes.array.isRequired,
    rowHeights: PropTypes.array.isRequired,
  }

  render() {
    const {columnWidth, containerHeight, rowHeights} = this.props
    let {edges} = (this.props)
    edges = _.uniqBy(edges, e => JSON.stringify(e))
    let showEdges = !!(_.get(edges, 'length') && _.get(rowHeights, 'length') && columnWidth)
    const gridPoint = new GridPoint({rowHeights: this.props.rowHeights, columnWidth: this.props.columnWidth, padding: 5})
    return (
      <div className='FlowGrid--Arrows'>
      {(edges.length > 0) &&
        <svg
            className='edge'
            height={containerHeight}
            width={'100%'}
        >
          <defs>
            <marker id="MarkerArrowBLUE" markerWidth="3" markerHeight="3" refX="2" refY="1.5" orient="auto">
              <path d="M 0,0 V 3 L3,1.5 Z" className="arrow BLUE"/>
             </marker>
            <marker id="MarkerArrowRED" markerWidth="3" markerHeight="3" refX="2" refY="1.5" orient="auto">
              <path d="M 0,0 V 3 L3,1.5 Z" className="arrow RED"/>
             </marker>
          </defs>
          {showEdges &&
            _.sortBy(edges, e => {return e.color === 'RED' ? 1 : 0}).map(e => {
              const input = gridPoint.rectangle(e.input)
              const output = gridPoint.rectangle(e.output)
              return (<Edge color={e.color} key={JSON.stringify(e)} input={input} output={output}/>)
            })
          }
        </svg>
      }
      </div>
    )
  }
}
