import React from 'react'
import {connect} from 'react-redux'

import {CalculatorShow} from './CalculatorShow'

import {calculatorSpaceSelector} from './calculator-space-selector'

export const CalculatorCompressedShow = connect(calculatorSpaceSelector)(
  props => !!props.calculator ? <CalculatorShow {...props} classes={['narrow', 'medium-font-size']} /> : false
)
