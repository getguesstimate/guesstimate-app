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

class PlanCard extends Component{
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
        { this.props.showButton &&
          <a
            className='ui button large green'
            onMouseDown={this.props.onClick}
          > Upgrade </a>
        }
      </div>
    )
  }
}

export default class Plans extends Component{
  static defaultProps = {
    showButtons: false,
    onChoose: (planId) => {console.log('choose', planId)}
  }

  render() {
    const plans = [
      'personal_free',
      'personal_lite',
      'personal_premium',
    ].map(e => Plan.find(e))

    return (
      <div className='row'>
        {plans.map(plan => {
          const showButton= this.props.showButtons && (plan.id !== 'personal_free')
          return (
            <div className='col-sm-4' key={plan.name}>
              <PlanCard
                key={plan.name}
                plan={plan}
                showButton={showButton}
                onClick={() => {this.props.onChoose(plan.id)}}
              />
            </div>
            )
        })}
      </div>
    )
  }
}
