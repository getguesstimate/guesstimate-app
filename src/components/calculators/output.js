import React, {Component} from 'react'

import numberShow from 'lib/numberShower/numberShower'

const PrecisionNumber = ({value, precision, number=numberShow(value, precision)}) => (
  <span className='result-value'>
    {number.value}{number.symbol}
    {number.power && (<span>{`\u00b710`}<sup>{number.power}</sup></span>)}
  </span>
)

// TODO(Point display)
export const Output = ({metric: {name, simulation}}) => {
  if (!_.has(simulation, 'stats')) { return false }
  const {length, mean, adjustedConfidenceInterval: [low, high]} = simulation.stats
  return (
    <div className='output row'>
      <div className='col-md-7 name'>
        {name}
      </div>
      <div className='col-md-5 result-section'>
        {length === 1 && <PrecisionNumber value={mean} precision={6}/> }
        {length > 1 && <div><PrecisionNumber value={low}/> to <PrecisionNumber value={high}/></div> }
      </div>
    </div>
  )
}
