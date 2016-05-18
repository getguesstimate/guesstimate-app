import React from 'react'

import './style.css'

export const ButtonClose = ({onClick}) => (
  <a className='button-close' onClick={onClick}>
    <i className={`ion-md-close`}/>
  </a>
)
