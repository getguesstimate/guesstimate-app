import React, {Component} from 'react'
import {connect} from 'react-redux'

import {calculatorSpaceSelector} from './calculator-space-selector'

import * as spaceActions from 'gModules/spaces/actions'

@connect(calculatorSpaceSelector)
export class CalculatorShow extends Component {
  state = {attemptedFetch: false}

  componentDidMount() { if (!this.props.space) { this.fetchData() } }
  componentDidUpdate() { if (!this.props.space) { this.fetchData() } }

  fetchData() {
    if (!this.state.attemptedFetch) {
      console.log('ooo')
      this.props.dispatch(spaceActions.fetchById(this.props.calculator.space_id))
      this.setState({attemptedFetch: true})
    }
  }

  render() {
    console.log(this.props.calculator)
    console.log(this.props.space)
    return (<div>Hello World</div>)
  }
}
