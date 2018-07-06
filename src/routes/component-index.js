import React, {Component} from 'react' 
import PropTypes from 'prop-types'
import MetricCard from 'gComponents/metrics/card'
import ComponentEditor from 'gComponents/utility/ComponentEditor/index.js'

const MetricCardProps = {
  metric: {
    id: '123',
    space: 32,
    readableId: 'AB',
    name: 'Population of Chicago',
    location: {row: 3, column: 9},
    guesstimate: {
      metric: '123',
      input: '3->8'
    },
    simulation: {
      metric: '123',
      sample: {
        errors: [],
        values: [30.3, 30.9, 31.9, 39.4, 50.3, 80.2]
      },
      stats: {
        mean: 40,
        stdev: 5,
        length: 6
      },
    }
  },
  canvasState: 'scientific',
  location: {row: 3, column: 3},
  handleSelect: () => {console.log('select')},
  isSelected: true
}

export default class ComponentIndex extends Component{
  displayName: 'ComponentIndex'
  render () {
    return (
      <div className='container-fluid full-width'>
        <ComponentEditor
            child={MetricCard}
            childProps={MetricCardProps}
            name='MetricCard'
        />
      </div>
    )
  }
}
