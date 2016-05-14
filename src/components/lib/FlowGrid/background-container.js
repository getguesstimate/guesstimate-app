import React, {Component, PropTypes} from 'react'
import Dimensions from 'gComponents/utility/react-dimensions';
import Edges from './edges';
import $ from 'jquery'
import GridPoint from './gridPoints.js'

const Region = ({rowHeights, columnWidth, selectedRegion}) => {
  if (!selectedRegion || selectedRegion.length !== 2) { return false }
  const gridPoint = new GridPoint({rowHeights, columnWidth, padding: 0})
  const region = gridPoint.region(selectedRegion)
  return (
     <div className='SelectedRegion' style={region}/>
  )
}

//Listens to events for changes to row heights and column width
@Dimensions()
export default class BackgroundContainer extends Component {
  displayName: 'BackgroundContainer'

  static propTypes = {
    containerWidth: PropTypes.number,
    rowHeights: PropTypes.array.isRequired,
    edges: PropTypes.array.isRequired,
    refs: PropTypes.object.isRequired,
    rowCount: PropTypes.number.isRequired,
  }

  state = {
    columnWidth: null
  }

  componentWillUpdate(newProps) {
    if (newProps.containerWidth !== this.props.containerWidth){
      this.getColumnWidth()
    }
  }

  getColumnWidth() {
    const width = $('.FlowGridCell') && $('.FlowGridCell')[0] && $('.FlowGridCell')[0].offsetWidth
    this.setState({columnWidth: width})
  }

  render() {
    const {edges} = this.props
    const {columnWidth} = this.state

    const rowHeights = this.props.rowHeights
    const containerHeight = _.get(rowHeights, 'length') && rowHeights.reduce((a,b) => a + b)

    if (!columnWidth || !rowHeights.length){ return false }
    return (
      <div>
        <Edges
            columnWidth={columnWidth}
            containerHeight={containerHeight}
            edges={edges}
            rowHeights={rowHeights}
        />
        <Region rowHeights={rowHeights} columnWidth={columnWidth} selectedRegion={this.props.selectedRegion}/>
      </div>
    )
  }
}
