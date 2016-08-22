import React, {Component, PropTypes} from 'react'
import * as navigationActions from 'gModules/navigation/actions.js'
import Plan from 'lib/config/plan.js'
import './style.css'

const Cost = ({cost, unit}) => (
  <div className='PlanCard-Cost'>
    <div>
      <sup>$</sup>
      <span className='number'>{cost}</span>
    </div>
    {unit === 'per_user' &&
      <div className='per-month'>
        per user
        <br/>
        per month
      </div>
    }
    {unit !== 'per_user' &&
      <div className='per-month'>
        per month
      </div>
    }
  </div>
)

const Limit = ({limit}) => (
  <div className='PlanCard-Limit'>
    <span className='number'> {limit} </span>
    <span> private models </span>
  </div>
)

class PlanCard extends Component{
  render() {
    const {name, promotion_copy, price, unit, private_model_count, showButton, onClick} = this.props
    return (
      <div className='PlanCard'>
        <h2> {name} </h2>
        <Cost cost={price} unit={unit}/>
        <ul>
          <li> <strong>{private_model_count}</strong> private models </li>
        </ul>
        {promotion_copy &&
        <div className='promotion'>
          {promotion_copy}
        </div>
        }
        { this.props.upgrade.show &&
          <a
            className='ui button large green'
            onMouseDown={this.props.upgrade.onClick}
          > {this.props.upgrade.text} </a>
        }
      </div>
    )
  }
}

export default class Plans extends Component{
  static defaultProps = {
    onChoose: (planId) => {console.log('choose', planId)}
  }

  render() {
    return (
      <div className='row'>
        <div className='col-sm-12'>
        <div className='Plans--outer'>
          <div className='Plans'>
            <PlanCard
              name='Individuals'
              price='5'
              unit='per_month'
              private_model_count='20'
              upgrade={{
                show: this.props.showPersonalUpgradeButton,
                onClick: () => {this.props.onChoose('personal_lite')},
                text: 'Upgrade'
              }}
            />
            <PlanCard
              name='Organizations'
              price='12'
              unit='per_user'
              private_model_count='Unlimited'
              promotion_copy='30-day free trial'
              upgrade={{
                show: this.props.isLoggedIn,
                onClick: () => {this.props.onNewOrganizationNavigation()},
                text: 'Begin Free Trial'
              }}
            />
          </div>
        </div>
        </div>
      </div>
    )
  }
}
