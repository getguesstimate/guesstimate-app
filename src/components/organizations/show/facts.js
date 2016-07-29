import React, {Component} from 'react'
import {connect} from 'react-redux'

import Icon from 'react-fa'

import './facts.css'

const FactRow = ({fact}) => (
  <div className='Fact'>
    <div className='row'>
      <div className='col-md-3'> Histogram Placeholder </div>
      <div className='col-md-6'><span className='name'>{fact.name}</span></div>
      <div className='col-md-2'>
        <div className='variableName'>
          <span className='prefix'>#</span>
          <span className='variable'>{fact.variable_name}</span>
        </div>
      </div>
      <div className='col-md-1'>
        <span className='ui button options'><Icon name='ellipsis-v' /></span>
      </div>
    </div>
  </div>
)

const NewFactRow = ({onSubmit}) => (
  <div classNmae='new Fact'>
    <div className='row'>
      <div className='col-md-3'> <textarea /> </div>
      <div className='col-md-6'><textarea /></div>
      <div className='col-md-2'>
        <div className='variableName'>
          <span className='prefix'>#</span>
          <textarea />
        </div>
      </div>
      <div className='col-md-1'>
        <span className='ui button options' onClick={onSubmit}><Icon name='plus' /></span>
      </div>
    </div>
  </div>
)

export const FactBookTab = ({facts}) => (
  <div className='FactsTab'>
    {_.map(facts, fact => <FactRow fact={fact} />)}
    <NewFactRow
      onSubmit={() => console.log('woo')}
    />
  </div>
)
