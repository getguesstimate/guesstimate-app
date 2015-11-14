import React, {Component, PropTypes} from 'react'
import MetricCard from 'gComponents/metrics/card'
import DistributionEditor from 'gComponents/distributions/editor'
import JSONTree from 'react-json-tree'
import './main.css'

export default class ComponentEditor extends Component {
  static propTypes = {
    child: PropTypes.object.isRequired,
    childProps: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
  }

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

const DistributionEditorProps = {
  guesstimate: {
    value: '34',
    low: '30',
    high: '100',
    type: 'POINT',
  },
  onSubmit: function(g) { console.log(g) }
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
        <ComponentEditor
            child={DistributionEditor}
            childProps={DistributionEditorProps}
            name='DistributionEditor'
        />
      </div>
    )
  }
}
