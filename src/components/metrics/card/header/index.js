import React, {Component, PropTypes} from 'react';
import MetricName from '../name'
import ShowIf from 'gComponents/utility/showIf'
import MetricHeaderToken from './token.js'
import './style.css'

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
    let {anotherFunctionSelected, name, readableId, isSelected, onOpenModal, hasReasoning} = this.props
    return (
     <div className='MetricHeader'>
       {(!_.isEmpty(name) || isSelected) &&
         <div className='name'>
           <MetricName name={name}
               onChange={this.props.onChange}
               ref='name'
           />
        </div>
       }
       <div className='token'>
         <MetricHeaderToken
             readableId={readableId}
             anotherFunctionSelected={anotherFunctionSelected}
             onOpenModal={onOpenModal}
             hasReasoning={hasReasoning}
         />
      </div>
     </div>
    )
  }
}
