import React, {Component} from 'react'

import Icon from 'react-fa'

import Histogram from 'gComponents/simulations/histogram/index'

import './facts.css'

export const FactRow = ({fact, onEdit, onDelete}) => (
  <div className='Fact'>
    <div className='row'>
      <div className='col-md-3'>
        <Histogram
          height={30}
          simulation={fact.simulation}
          cutOffRatio={0.995}
        />
      </div>
      <div className='col-md-5'><span className='name'>{fact.name}</span></div>
      <div className='col-md-2'>
        <div className='variableName'>
          <span className='prefix'>#</span>
          <span className='variable'>{fact.variable_name}</span>
        </div>
      </div>
      <div className='col-md-2'>
        <span className='ui button options' onClick={onEdit}>Edit</span>
        <span className='ui button options' onClick={onDelete}>Delete</span>
      </div>
    </div>
  </div>
)
