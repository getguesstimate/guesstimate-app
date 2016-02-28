import React, {Component, PropTypes} from 'react'
import Plan from 'lib/config/plan.js'
import './style.css'

const Cost = ({cost}) => (
  <div className='PlanCard-Cost'>
    <div>
      <sup>$</sup>
      <span className='number'>{cost}</span>
    </div>
    <div className='per-month'>
      per month
    </div>
  </div>
)

const Limit = ({limit}) => (
  <div className='PlanCard-Limit'>
    <span className='number'> {limit} </span>
    <span> private models </span>
  </div>
)

const PublicModels = () => (
  <div className='PlanCard-public'>
    unlimited public models
  </div>
)

export default class PlanCard extends Component{
  render() {
    const {plan} = this.props
    return (
      <div className='PlanCard'>
        <h2> {plan.name} </h2>
        <Cost cost={plan.formattedCost()}/>
        <ul>
          <li> <strong>{plan.number()}</strong> private models </li>
          <li> unlimited public models </li>
        </ul>
        <a className='ui button large green'> Get Started </a>
      </div>
    )
  }
}

export default class PlanIndex extends Component{
  displayName: 'PlanIndex'
  render () {
    const plans = [
      'personal_free',
      'personal_lite',
      'personal_premium',
    ].map(e => Plan.find(e))
    return (
      <div className='PlanIndex'>
        <div className='header'>
          <h1> Plans & Pricing </h1>
        </div>
        <div className='cards'>
          <div className='row'>
            {plans.map(plan => {
              return (
                <div className='col-sm-4' key={plan.name}>
                  <PlanCard plan={plan} key={plan.name}/>
                </div>
                )
            })}
          </div>
        </div>
      </div>
    )
  }
}
