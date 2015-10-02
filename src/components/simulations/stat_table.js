import React from 'react'
import ShowIf from '../utility/showIf';

const MetricStatTable = ({stats}) => (
  <div>
    <table className='important-stats'>
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
  </div>
)

export default ShowIf(MetricStatTable)
