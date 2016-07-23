import React from 'react'

import {Button} from '../button.js'

export const ButtonClose = ({onClick}) => (
  <a className='button-close' onClick={onClick}>
    <i className={`ion-md-close`}/>
  </a>
)

export const ButtonCloseText = ({onClick}) => (
  <Button onClick={onClick}>
    <i className={`ion-md-close`}/>
    Close
  </Button>
)
