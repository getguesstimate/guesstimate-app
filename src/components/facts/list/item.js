import React, {Component} from 'react'

import Icon from 'react-fa'

import {DistributionSummary} from 'gComponents/distributions/summary/index'
import Histogram from 'gComponents/simulations/histogram/index'

import {isPresent} from 'gEngine/utils'

export const FactItem = ({fact, onEdit}) => (
  <div className='Fact--outer'>
    <div className='Fact'>
      <div className='section-simulation simulation-sample'>
        {_.has(fact, 'simulation.sample.values.length') && _.has(fact, 'simulation.stats.mean') &&
          <div className='simulation-summary'>
          <DistributionSummary
            length={fact.simulation.sample.values.length}
            mean={fact.simulation.stats.mean}
            adjustedConfidenceInterval={fact.simulation.stats.adjustedConfidenceInterval}
          />
          </div>
         }
        {_.has(fact, 'simulation.sample.values.length') &&
          <div className='histogram'>
            <Histogram
              height={15}
              simulation={fact.simulation}
              cutOffRatio={0.995}
            />
          </div>
        }
      </div>
      <div className='section-name'>
        <span className='fact-name'>{fact.name}</span>
        <div className='variable-name variable-token'>
          <span className='prefix'>#</span>
          <div className='name'>{fact.variable_name}</div>
        </div>
      </div>

        <div className='section-help'>
          <span className='ui button small options' onClick={onEdit}>Edit</span>
        </div>
    </div>
  </div>
)
