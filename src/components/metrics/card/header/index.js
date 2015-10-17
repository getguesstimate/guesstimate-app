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
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    readableId: PropTypes.string,
  }

  shouldComponentUpdate(nextProps) {
    return ((nextProps.name !== this.props.name) ||
            (nextProps.readableId !== this.props.readableId))
  }

  handleNameChange(name) {
    this.props.onChange({name})
  }

  hasContent() {
    return this.refs.name.hasContent()
  }

  render () {
    let {anotherFunctionSelected, name, readableId} = this.props
    return (
     <div className='row'>
       <div className={anotherFunctionSelected ? 'col-xs-9 name' : 'col-xs-12 name'}>
         <MetricName name={name}
             onChange={this.props.onChange}
             ref='name'
         />
      </div>
       <div className={anotherFunctionSelected ? 'col-xs-0' : 'col-xs-3'}>
         <MetricReadableId
             readableId={readableId}
             showIf={anotherFunctionSelected}
         />
      </div>
     </div>
    )
  }
}
