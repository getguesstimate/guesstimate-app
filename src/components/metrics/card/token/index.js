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

const MetricExportedIcon = () => (
  <div className='MetricToken--Corner'>
    <div className='MetricToken--Corner-Triangle'></div>
    <div className='MetricToken--Corner-Item'>
      <i className='ion-ios-redo'/>
    </div>
  </div>
)

function tokenToShow({hovered, hasGuesstimateDescription, anotherFunctionSelected, exportedAsFact}){
  if (anotherFunctionSelected) { return 'READABLE_ID' }
  else if (hovered) { return 'EXPAND_BUTTON' }
  else if (exportedAsFact) { return 'EXPORTED_AS_FACT' }
  else if (hasGuesstimateDescription) { return 'REASONING_ICON' }
  else { return false }
}

export const MetricToken = ({hovered, anotherFunctionSelected, readableId, onToggleSidebar, hasGuesstimateDescription, exportedAsFact}) => {
  const show = tokenToShow({hovered, hasGuesstimateDescription, anotherFunctionSelected, exportedAsFact})
  if (!show) { return false }
  else {
    return (
      <div>
        {show === 'EXPORTED_AS_FACT' &&
          <MetricExportedIcon/>
        }
        <div className='MetricToken'>
          {show === 'READABLE_ID' && <MetricReadableId readableId={readableId}/>}
          {show === 'EXPAND_BUTTON' && <MetricExpandButton onToggleSidebar={onToggleSidebar}/>}
          {show === 'REASONING_ICON' && <MetricReasoningIcon/>}
        </div>
      </div>
    )
  }
}
