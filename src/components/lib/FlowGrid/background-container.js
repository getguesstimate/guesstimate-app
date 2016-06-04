import React, {Component, PropTypes} from 'react'

import $ from 'jquery'

import {Edges} from './edges'
import GridPoint from './gridPoints'

import Dimensions from 'gComponents/utility/react-dimensions'
import {PTRegion} from 'lib/locationUtils'


const Region = ({rowHeights, columnWidth, selectedRegion, type}) => {
  const gridPoint = new GridPoint({rowHeights, columnWidth, padding: 0})
  const region = gridPoint.region(selectedRegion)
  return (
     <div className={`Region ${type}`} style={region}/>
  )
}

//Listens to events for changes to row heights and column width
@Dimensions()
export class BackgroundContainer extends Component {
  displayName: 'BackgroundContainer'

  static propTypes = {
    rowHeights: PropTypes.array.isRequired,
    edges: PropTypes.array.isRequired,
    selectedRegion: PTRegion,
    copiedRegion: PTRegion,
  }

  shouldComponentUpdate(nextProps) {
    return (
      !_.isEqual(this.props.copiedRegion, nextProps.copiedRegion) ||
      !_.isEqual(this.props.selectedRegion, nextProps.selectedRegion) ||
      !_.isEqual(this.props.edges, nextProps.edges) ||
      !_.isEqual(this.props.rowHeights, nextProps.rowHeights)
    )
  }

  render() {
    const {edges, rowHeights, selectedRegion, copiedRegion} = this.props
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
      </div>
    )
  }
}
