import React from 'react'

import {isPresent} from 'gEngine/utils'

import './style.css'

export const divWithClasses = (...classes) => props => (
  <div className={classes.filter(isPresent).join(' ')} {..._.omit(props, 'children')}>
    {props.children}
  </div>
)

const Container = divWithClasses('GeneralContainer')
export default Container
