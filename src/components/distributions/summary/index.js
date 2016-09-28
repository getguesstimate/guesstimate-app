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

const DistributionDisplay = ({mean, range: [low, high]}) => (
  <div>
    <PointDisplay value={mean} precision={2}/>
    <div className='UncertaintyRange'>
      <PrecisionNumber value={low}/> to <PrecisionNumber value={high}/>
    </div>
  </div>
)

// TODO(matthew): Ostensibly I'd like to handle the defensivity upstream, but this is a good quick fix for the problem
// exposed to customers presently.
export const DistributionSummary = ({length, mean, adjustedConfidenceInterval}) => {
  console.log(length, mean, adjustedConfidenceInterval)
  const hasLength = length === 1 ||
    adjustedConfidenceInterval[0] === adjustedConfidenceInterval[1] ||
    _.some(adjustedConfidenceInterval, e => !_.isFinite(e))
  return (
    <div className="DistributionSummary">
      {hasLength ?
        <PointDisplay value={mean}/>
          :
        <DistributionDisplay mean={mean} range={adjustedConfidenceInterval}/>
      }
    </div>
  )
}
