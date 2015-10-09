/* @flow */
import React, {Component, PropTypes} from 'react';
import MetricName from '../name'
import ShowIf from 'gComponents/utility/showIf'

const MetricReadableIdd = ({readableId}) => (
  <div className='col-xs-1 function-id'>
    {readableId}
  </div>
)
const MetricReadableId = ShowIf(MetricReadableIdd)

export default class MetricHeader extends Component {
  displayName: 'MetricHeader'

  static propTypes = {
    anotherFunctionSelected: PropTypes.bool,
    metric: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  }

  handleNameChange(name) {
    let {id} = this.props.metric;
    this.props.onChange({name})
  }

  render () {
    let {anotherFunctionSelected, metric} = this.props
    return (
     <div className='row'>
       <div className={anotherFunctionSelected ? 'col-xs-9 name' : 'col-xs-12 name'}>
         <MetricName name={metric.name}
           onChange={this.props.onChange}
         />
      </div>
       <div className={anotherFunctionSelected ? 'col-xs-0' : 'col-xs-3'}>
         <MetricReadableId
             readableId={metric.readableId}
             showIf={anotherFunctionSelected}
         />
      </div>
     </div>
    )
  }
}
