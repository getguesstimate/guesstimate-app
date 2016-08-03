import React, {Component} from 'react'

import Icon from 'react-fa'

import {DistributionSummary} from 'gComponents/distributions/summary/index'
import Histogram from 'gComponents/simulations/histogram/index'

export const FactItem = ({fact, onEdit, onDelete, isEditable}) => (
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
        <div className='variable-name'>
          <span className='prefix'>#</span>
          <span className='variable'>{fact.variable_name}</span>
        </div>
        <div className='description'>{fact.name}</div>
      </div>

      {isEditable &&
        <div className='section-help'>
          <span className='ui button tiny options' onClick={onEdit}>Edit</span>
            <span className='ui button tiny options' onClick={onDelete}>Delete</span>
        </div>
      }
    </div>
  </div>
)
