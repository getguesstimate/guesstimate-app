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

const ResultSection = ({length, mean, adjustedConfidenceInterval}) => (
  length === 1 ? <PrecisionNumber value={mean} precision={6}/> : <RangeDisplay range={adjustedConfidenceInterval}/>
)

export const Output = ({metric: {name, simulation}}) => (
  <div className='output'>
    <div className='row'>
      <div className='col-xs-12 col-sm-7'>
        <div className='name'>
          {name}
        </div>
      </div>
      <div className='col-xs-12 col-sm-5'>
        <div className={`result-section${!_.isEmpty(_.get(simulation, 'sample.errors')) ? ' has-errors' : ''}`}>
          {_.has(simulation, 'stats') && <ResultSection {...simulation.stats} />}
        </div>
      </div>
    </div>
  </div>
)
