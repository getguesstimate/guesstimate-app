import React from 'react'

import Icon from 'react-fa'

import './style.css'

const MetricReadableId = ({readableId}) => (
  <div className='ui label green tiny'>
    {readableId}
  </div>
)

const MetricExpandButton = ({onOpenSidebar}) => (
  <span
    className='hover-toggle hover-icon'
    onMouseDown={onOpenSidebar}
    data-select='false'
  >
    <Icon name='pencil' data-control-sidebar="true"/>
  </span>
)

const MetricReasoningIcon = () => (
  <span className='hover-hide hover-icon'>
    <Icon name='comment'/>
  </span>
)

export const MetricToken = ({anotherFunctionSelected, readableId, onOpenSidebar, hasGuesstimateDescription}) => (
  <div className='MetricToken'>
    {anotherFunctionSelected && <MetricReadableId readableId={readableId} /> }
    {!anotherFunctionSelected && <MetricExpandButton onOpenSidebar={onOpenSidebar}/> }
    {!anotherFunctionSelected && hasGuesstimateDescription && <MetricReasoningIcon/> }
  </div>
)
