import React from 'react'

import numberShow from 'lib/numberShower/numberShower'

const PrecisionNumber = ({value, precision, number=numberShow(value, precision)}) => (
  <span className='result-value'>
    {number.value}{number.symbol}
    {number.power && (<span>{`\u00b710`}<sup>{number.power}</sup></span>)}
  </span>
)

const RangeDisplay = ({range: [low, high]}) => (
  <div><PrecisionNumber value={low}/> to <PrecisionNumber value={high}/></div>
)

export const Output = ({metric: {name, simulation}}) => {
  if (!_.has(simulation, 'stats')) { return false }
  const {length, mean, adjustedConfidenceInterval} = simulation.stats
  return (
    <div className='output'>
      <div className='row'>
        <div className='col-md-7'>
          <div className='name'>
            {name}
          </div>
        </div>
        <div className='col-md-5'>
          <div className='result-section'>
            {length === 1 && <PrecisionNumber value={mean} precision={6}/> }
            {length > 1 && <RangeDisplay range={adjustedConfidenceInterval}/> }
          </div>
        </div>
      </div>
    </div>
  )
}
