import React, {Component, PropTypes} from 'react';
import Icon from 'react-fa'
import './style.css'

const MetricReadableId = ({readableId}) => (
  <div className='ui label green tiny'>
    {readableId}
  </div>
)

const MetricExpandButton = ({onOpenModal}) => (
  <span
      className='hover-toggle hover-icon'
      onMouseDown={onOpenModal}
      data-select='false'
  >
    <Icon name='expand'/>
  </span>
)

const MetricReasoningIcon = () => (
  <span
      className='hover-hide hover-icon'
  >
    <Icon name='comment'/>
  </span>
)

export default class MetricToken extends Component {
  displayName: 'MetricToken'

  static propTypes = {
    anotherFunctionSelected: PropTypes.bool.isRequired,
    hasReasoning: PropTypes.bool.isRequired,
    onOpenModal: PropTypes.func.isRequired,
    readableId: PropTypes.string.isRequired,
  }

  render() {
    const {anotherFunctionSelected, readableId, onOpenModal, hasReasoning} = this.props

    return (
      <div className='MetricToken'>
        {anotherFunctionSelected && <MetricReadableId readableId={readableId} /> }
        {!anotherFunctionSelected && <MetricExpandButton onOpenModal={onOpenModal}/> }
        {!anotherFunctionSelected && hasReasoning && <MetricReasoningIcon/> }
      </div>
    )
  }
}
