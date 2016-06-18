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
      !_.isEqual(this.props.edges, nextProps.edges) ||
      !_.isEqual(this.state.rowHeights, nextState.rowHeights)
    )
  }

  render() {
    const {edges, rowCount, getRowHeight, selectedRegion, copiedRegion, autoFillRegion} = this.props
    const {rowHeights} = this.state

    const columnWidth = $('.FlowGridCell') && $('.FlowGridCell')[0] && $('.FlowGridCell')[0].offsetWidth
    if (!columnWidth || !rowHeights.length) { return false }

    const containerHeight = rowHeights.reduce((a,b) => a + b)

    return (
      <div>
        {edges.length > 0 &&
          <Edges
            columnWidth={columnWidth}
            containerHeight={containerHeight}
            edges={edges}
            rowHeights={rowHeights}
          />
        }
        {selectedRegion.length === 2 &&
          <Region
            rowHeights={rowHeights}
            columnWidth={columnWidth}
            selectedRegion={selectedRegion}
            type='selected'
          />
        }
        {copiedRegion.length === 2 &&
          <Region
            rowHeights={rowHeights}
            columnWidth={columnWidth}
            selectedRegion={copiedRegion}
            type='copied'
          />
        }
        {autoFillRegion.length === 2 &&
          <Region
            rowHeights={rowHeights}
            columnWidth={columnWidth}
            selectedRegion={autoFillRegion}
            type='fill'
          />
        }
      </div>
    )
  }
}
