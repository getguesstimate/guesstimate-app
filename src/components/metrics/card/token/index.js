import React from 'react'

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
  <span className='hover-hide hover-icon'>
    <Icon name='comment'/>
  </span>
)

export const MetricToken = ({shouldShowReadableId, readableId, onOpenModal, hasGuesstimateDescription}) => (
  <div className='MetricToken'>
    {shouldShowReadableId && <MetricReadableId readableId={readableId} /> }
    {!shouldShowReadableId && <MetricExpandButton onOpenModal={onOpenModal}/> }
    {!shouldShowReadableId && hasGuesstimateDescription && <MetricReasoningIcon/> }
  </div>
)
