import React from 'react'

import numberShow from 'lib/numberShower/numberShower'

import './style.css'

const PrecisionNumber = ({value, precision, number=numberShow(value, precision)}) => (
  <span>
    {number.value}{number.symbol}
    {number.power && (<span>{`\u00b710`}<sup>{number.power}</sup></span>)}
  </span>
)

const PointDisplay = ({value, precision=6}) => (
  <div className='mean'>
    <PrecisionNumber value={value} precision={precision}/>
  </div>
)

const DistributionDisplay = ({mean, adjustedConfidenceInterval: [low, high]}) => (
  <div>
    <PointDisplay value={mean} precision={2}/>
    <div className='UncertaintyRange'>
      <PrecisionNumber value={low}/> to <PrecisionNumber value={high}/>
    </div>
  </div>
)

export const DistributionSummary = ({length, mean, adjustedConfidenceInterval}) => (
  <div className="DistributionSummary">
    {length === 1 && <PointDisplay value={mean}/>}
    {length > 1 && <DistributionDisplay mean={mean} adjustedConfidenceInterval={adjustedConfidenceInterval}/>}
  </div>
)
