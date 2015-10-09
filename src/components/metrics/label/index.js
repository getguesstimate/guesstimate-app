import React, {Component} from 'react'
import DistributionSummary from '../card/simulation_summary'
import './style.css'

let MetricLabel = ({metric}) => (
  <div className='MetricLabel'>
    {metric.name}
  </div>
)

export default MetricLabel
