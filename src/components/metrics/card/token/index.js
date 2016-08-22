import React from 'react'

import Icon from 'react-fa'

import './style.css'

const MetricReadableId = ({readableId}) => (
  <div className='ui label green tiny'>
    {readableId}
  </div>
)

const MetricExpandButton = ({onToggleSidebar}) => (
  <span
    className='hover-toggle hover-icon'
    onMouseDown={onToggleSidebar}
    data-select='false'
  >
    <Icon name='cog' data-control-sidebar="true"/>
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
    {!shouldShowReadableId && <MetricExpandButton onToggleSidebar={onToggleSidebar}/> }
    {!shouldShowReadableId && hasGuesstimateDescription && <MetricReasoningIcon/> }
  </div>
)
