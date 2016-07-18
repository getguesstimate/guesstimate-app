import React from 'react'

import './style.css'

export const ButtonClose = ({onClick}) => (
  <a className='button-close' onClick={onClick}>
    <i className={`ion-md-close`}/>
  </a>
)

export const ButtonCloseText = ({onClick}) => (
  <span className={'ui button button-close-text'} onClick={onClick}>
    <i className={`ion-md-close`}/>
    Close
  </span>
)
