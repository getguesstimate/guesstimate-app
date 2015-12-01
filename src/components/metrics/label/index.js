import React, {Component} from 'react'
import './style.css'

let MetricLabel = ({metric}) => (
  <div className='MetricLabel'>
    {metric.name}
  </div>
)

export default MetricLabel
