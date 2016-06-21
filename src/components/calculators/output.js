import React, {Component} from 'react'

import numberShow from 'lib/numberShower/numberShower'

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

const DistributionSummary = ({length, mean, adjustedConfidenceInterval}) => (
  <div className="DistributionSummary">
    {length === 1 && <PointDisplay value={mean}/>}
    {length > 1 && <DistributionDisplay mean={mean} adjustedConfidenceInterval={adjustedConfidenceInterval}/>}
  </div>
)

// TODO(Point display)
export const Output = ({metric: {name, simulation}}) => (
  <div className='output row'>
    <div className='col-md-7 name'>
      {name}
    </div>
    <div className='col-md-5'>
      <DistributionSummary
        length={_.get(simulation, 'stats.length')}
        mean={_.get(simulation, 'stats.mean')}
        adjustedConfidenceInterval={_.get(simulation, 'stats.adjustedConfidenceInterval')}
      />
    </div>
  </div>
)
