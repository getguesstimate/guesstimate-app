import React, {Component, PropTypes} from 'react'
import Icon from'react-fa'
import { connect } from 'react-redux';
import MetricCard from 'gComponents/metrics/card'
import JSONTree from 'react-json-tree'
import './main.css'

export default class ComponentEditor extends Component {
  render() {
    return (
    <div className='row'>
      <div className='col-sm-3'>
        <h2> {this.props.name} </h2>
        <h4> Props </h4>
        <JSONTree data={this.props.children.props}/>
      </div>
      <div className='col-sm-9'>
        {this.props.children}
      </div>
    </div>
    )
  }
}

export default class ComponentIndex extends Component{
  displayName: 'ComponentIndex'
  render () {
    const metric = {
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
    }
    return (
      <div className='container'>
      <ComponentEditor name='MetricCard'>
      <MetricCard
          canvasState={'scientific'}
          handleSelect={() => {console.log('select')}}
          key={12}
          location={{row: 1, column:3}}
          metric={metric}
          userAction={'selecting'}
          isSelected={true}
      />
</ComponentEditor>
      </div>
    )
  }
}
