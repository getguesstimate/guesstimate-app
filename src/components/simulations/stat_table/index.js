import React from 'react'
import './style.css'

const MetricStatTable = ({stats}) => (
  <table className='MetricStatTable'>
    <tr>
      <td> {'mean'} </td>
      <td> {stats.mean.toFixed(2)} </td>
    </tr>
    <tr>
      <td> {'stdev'} </td>
      <td> {stats.stdev.toFixed(2)} </td>
    </tr>
    <tr>
      <td> {'Samples'} </td>
      <td> {stats.length} </td>
    </tr>
  </table>
)

export default MetricStatTable
