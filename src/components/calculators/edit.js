import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import {FormContainer} from './shared/FormContainer'

import {update} from 'gModules/calculators/actions'

export const EditCalculatorForm = connect(null, dispatch => bindActionCreators({update}, dispatch))(
  props => <FormContainer {...props} buttonText={'Update'} onSubmit={calc => {props.update(calc)}} />
)
