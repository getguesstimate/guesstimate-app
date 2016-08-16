import React, {Component, PropTypes} from 'react'

import $ from 'jquery'

import {Edges} from './edges'
import GridPoint from './gridPoints'

import {PTRegion} from 'lib/locationUtils'

const upto = (n) => Array.apply(null, {length: n})

const Region = ({rowHeights, columnWidth, selectedRegion, type}) => {
  const gridPoint = new GridPoint({rowHeights, columnWidth, padding: 0})
  const region = gridPoint.region(selectedRegion)
  return (
     <div className={`Region ${type}`} style={region}/>
  )
}

//Listens to events for changes to row heights and column width
export class BackgroundContainer extends Component {
  displayName: 'BackgroundContainer'

  static propTypes = {
    rowCount: PropTypes.number.isRequired,
    edges: PropTypes.array.isRequired,
    selectedRegion: PTRegion,
    copiedRegion: PTRegion,
  }

  state = {
    rowHeights: []
  }

  componentWillMount() {
    this.setState({rowHeights: _.map(upto(this.props.rowCount), (r, i) => this.props.getRowHeight(i))})
  }

  componentWillReceiveProps(nextProps) {
    this.setState({rowHeights: _.map(upto(nextProps.rowCount), (r, i) => nextProps.getRowHeight(i))})
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !_.isEqual(this.props.copiedRegion, nextProps.copiedRegion) ||
      !_.isEqual(this.props.selectedRegion, nextProps.selectedRegion) ||
      !_.isEqual(this.props.autoFillRegion, nextProps.autoFillRegion) ||
      !_.isEqual(this.props.analyzedRegion, nextState.analyzedRegion) ||
      !_.isEqual(this.props.edges, nextProps.edges) ||
      !_.isEqual(this.state.rowHeights, nextState.rowHeights)
    )
  }

  render() {
    const {edges, rowCount, getRowHeight, selectedRegion, copiedRegion, autoFillRegion, analyzedRegion} = this.props
    const {rowHeights} = this.state

    const columnWidth = $('.FlowGridCell') && $('.FlowGridCell')[0] && $('.FlowGridCell')[0].offsetWidth
    if (!columnWidth || !rowHeights.length) { return false }

    const containerHeight = rowHeights.reduce((a,b) => a + b)

    const regions = [
      [selectedRegion, 'selected'],
      [analyzedRegion, 'analyzed'],
      [copiedRegion, 'copied'],
      [autoFillRegion, 'fill']
    ]

    return (
      <div>
        {regions.map(region => {
          if (region[0].length === 2) {
            return (
              <Region
                rowHeights={rowHeights}
                columnWidth={columnWidth}
                selectedRegion={region[0]}
                type={region[1]}
              />
            )
          } else { return false }
        })}

        {edges.length > 0 &&
          <Edges
            columnWidth={columnWidth}
            containerHeight={containerHeight}
            edges={edges}
            rowHeights={rowHeights}
          />
        }
      </div>
    )
  }
}
