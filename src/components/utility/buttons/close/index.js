import React, {Component, PropTypes} from 'react'

import Icon from 'react-fa'
import './style.css'

export const ButtonClose = ({onClick}) => (
  <a className='button-close' onClick={onClick}>
    <i className={`ion-md-close`}/>
  </a>
)
