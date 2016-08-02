import React, {Component} from 'react'

import Icon from 'react-fa'

import {DistributionSummary} from 'gComponents/distributions/summary/index'
import Histogram from 'gComponents/simulations/histogram/index'

import './facts.css'

export const FactRow = ({fact, onEdit}) => (
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
      <div className='variableName'>
        <span className='prefix'>#</span>
        <span className='variable'>{fact.variable_name}</span>
      </div>
      <div className='name'>{fact.name}</div>
    </div>

    <div className='section-help'>
      <span className='ui button tiny options' onClick={onEdit}>Edit</span>
    </div>
  </div>
)
