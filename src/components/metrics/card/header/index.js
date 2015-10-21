/* @flow */
import React, {Component, PropTypes} from 'react';
import MetricName from '../name'
import ShowIf from 'gComponents/utility/showIf'
import _ from 'lodash'

const MetricReadableIdd = ({readableId}) => (
  <div className='ui label green tiny'>
    {readableId}
  </div>
)
const MetricReadableId = ShowIf(MetricReadableIdd)

export default class MetricHeader extends Component {
  displayName: 'MetricHeader'

  static propTypes = {
    anotherFunctionSelected: PropTypes.bool,
    name: PropTypes.string.isRequired,
    readableId: PropTypes.string,
    onChange: PropTypes.func.isRequired,
  }

  shouldComponentUpdate(nextProps) {
    return ((nextProps.name !== this.props.name) ||
            (nextProps.readableId !== this.props.readableId) ||
            (nextProps.anotherFunctionSelected !== this.props.anotherFunctionSelected) ||
            (nextProps.isSelected !== this.props.isSelected))
  }

  handleNameChange(name) {
    this.props.onChange({name})
  }

  hasContent() {
    return this.refs.name && this.refs.name.hasContent()
  }

  render () {
    let {anotherFunctionSelected, name, readableId, isSelected} = this.props
    return (
     <div className='row'>
       {(!_.isEmpty(name) || isSelected) &&
         <div className='col-xs-12 name'>
           <MetricName name={name}
               onChange={this.props.onChange}
               ref='name'
           />
        </div>
       }
       <div className='col-xs-12 name'>
         <MetricReadableId
             readableId={readableId}
             showIf={anotherFunctionSelected}
         />
      </div>
     </div>
    )
  }
}
