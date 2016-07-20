import React from 'react'
import {connect} from 'react-redux'

import {CalculatorShowIsolated} from './CalculatorShowIsolated'

import {calculatorSpaceSelector} from './calculator-space-selector'

export const CalculatorCompressedShow = connect(calculatorSpaceSelector)(
  props => !!props.calculator ? <CalculatorShowIsolated {...props} classes={['narrow', 'medium-font-size']} /> : false
)
