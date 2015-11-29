import React, {Component, PropTypes} from 'react';
import MetricName from '../name'
import ShowIf from 'gComponents/utility/showIf'
import Icon from 'react-fa'

const MetricReadableId = ({readableId}) => (
  <div className='ui label green tiny'>
    {readableId}
  </div>
)

export default class MetricHeaderToken extends Component {
  displayName: 'MetricHeaderToken'
  render() {
    const {anotherFunctionSelected, readableId, onOpen, hasReasoning} = this.props

    return (
      <div className='name-token'>
        {anotherFunctionSelected &&
          <MetricReadableId
             readableId={readableId}
          />
        }
        {!anotherFunctionSelected &&
          <span
              className='hover-toggle hover-icon'
              onMouseDown={this.props.onOpenModal}
              ref='modalLink'
              data-select='false'
          >
            <Icon name='expand'/>
          </span>
        }
        {!anotherFunctionSelected && hasReasoning &&
          <span
              className='hover-hide hover-icon'
          >
            <Icon name='comment'/>
          </span>
        }
      </div>
    )
  }
}
