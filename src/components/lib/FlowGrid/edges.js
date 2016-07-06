import React, {Component, PropTypes} from 'react'

import Edge from './edge'
import GridPoint from './gridPoints'

export class Edges extends Component {
  displayName: 'Edges'

  shouldComponentUpdate(nextProps) {
    return (
      this.props.columnWidth !== nextProps.columnWidth ||
      this.props.containerHeight !== nextProps.containerHeight ||
      !_.isEqual(this.props.edges, nextProps.edges) ||
      !_.isEqual(this.props.rowHeights, nextProps.rowHeights)
    )
  }

  static propTypes = {
    columnWidth: PropTypes.number.isRequired,
    containerHeight: PropTypes.number.isRequired,
    edges: PropTypes.array.isRequired,
    rowHeights: PropTypes.array.isRequired,
  }

  render() {
    const {columnWidth, containerHeight, rowHeights, edges} = this.props
    const gridPoint = new GridPoint({rowHeights: rowHeights, columnWidth: columnWidth, padding: 5})
    return (
      <div className='FlowGrid--Arrows'>
        <svg
          className='edge'
          height={containerHeight}
          width={'100%'}
        >
          <defs>
            <marker id="MarkerArrow-ancestor" markerWidth="3" markerHeight="3" refX="2" refY="1.5" orient="auto">
              <path d="M 0,0 V 3 L3,1.5 Z" className="arrow ancestor"/>
             </marker>
            <marker id="MarkerArrow-descendant" markerWidth="3" markerHeight="3" refX="2" refY="1.5" orient="auto">
              <path d="M 0,0 V 3 L3,1.5 Z" className="arrow descendant"/>
             </marker>
            <marker id="MarkerArrow-unconnected" markerWidth="3" markerHeight="3" refX="2" refY="1.5" orient="auto">
              <path d="M 0,0 V 3 L3,1.5 Z" className="arrow unconnected"/>
             </marker>
            <marker id="MarkerArrow-default" markerWidth="3" markerHeight="3" refX="2" refY="1.5" orient="auto">
              <path d="M 0,0 V 3 L3,1.5 Z" className="arrow default"/>
             </marker>
            <marker id="MarkerArrow-hasErrors" markerWidth="3" markerHeight="3" refX="2" refY="1.5" orient="auto">
              <path d="M 0,0 V 3 L3,1.5 Z" className="arrow hasErrors"/>
             </marker>
          </defs>
          { _.sortBy(edges, e => {return e.pathStatus != 'unconnected' ? 2 : e.hasErrors ? 1 : 0}).map(
            e => {
              const input =  gridPoint.rectangle(e.input)
              const output = gridPoint.rectangle(e.output)
              return (<Edge hasErrors={e.hasErrors} pathStatus={e.pathStatus} key={JSON.stringify(e)} input={input} output={output}/>)
            })
          }
        </svg>
      </div>
    )
  }
}
