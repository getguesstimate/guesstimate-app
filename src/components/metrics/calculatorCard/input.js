import React from 'react'

import DistributionEditor from 'gComponents/distributions/editor/index'

export const CalculatorInputCard = ({metric: {guesstimate, name, id}, index}) => (
  <div>
    <div className={'row'}>
      <div className='col-md-1'>{`${index}.`}</div>
      <div className='col-md-7'>{name}</div>
      <div className='col-md-4'>
        <DistributionEditor
          hideGuesstimateType={true}
          skipSaves={true}
          guesstimate={guesstimate}
          metricId={id}
          size='small'
        />
      </div>
    </div>
  </div>
)
