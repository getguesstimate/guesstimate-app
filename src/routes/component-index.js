import React, {Component, PropTypes} from 'react'
import Icon from'react-fa'
import { connect } from 'react-redux';
import MetricCard from 'gComponents/metrics/card'
import JSONTree from 'react-json-tree'
import './main.css'

export default class ComponentEditor extends Component {
  render() {
    return (
    <div className='row ComponentEditor'>
      <div className='col-sm-2'>
        <h2> {this.props.name} </h2>
        <JSONTree data={this.props.childProps}/>
      </div>
      <div className='col-sm-10 Component'>
        {<this.props.child {...this.props.childProps}/>}
      </div>
    </div>
    )
  }
}

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
  userAction: 'selecting',
  handleSelect: () => {console.log('select')},
  isSelected: true
}

export default class ComponentIndex extends Component{
  displayName: 'ComponentIndex'
  render () {
    return (
      <div className='container-fluid full-width'>
      <ComponentEditor name='MetricCard' child={MetricCard} childProps={MetricCardProps}/>
      </div>
    )
  }
}
