import React, {Component} from 'react'
import { connect } from 'react-redux';
import { denormalizedSpaceSelector } from '../denormalized-space-selector.js';
import MetricLabel from '../../metrics/label'

import * as Space from 'gEngine/space';
import './style.css'
import moment from 'moment'
import Icon from 'react-fa'

function formatDate(date) {
 return moment(new Date(date)).format('ll')
}
let SpaceListItem = ({space, showUser}) => (
  <div className='SpaceListItem'>
    <a href={Space.url(space)}>
    <div className='row'>
      <div className='col-xs-9'>
        <h3> {space.name} </h3>
      </div>
        {space.user && showUser &&
          <div className='col-xs-3'>
            <div className='user-tag'>
              <img
                  className='ui avatar image'
                  src={space.user.picture}
              />
              {space.user.name}
            </div>
          </div>
        }
    </div>

    <div className='row'>
      <div className='col-xs-9 updated-at'>
        <p>Updated {formatDate(space.updated_at)}</p>
      </div>
      <div className='col-xs-3 metric-count'>
        <p>{space.metrics.length} Metrics</p>
      </div>
    </div>
    </a>
  </div>
)

function mapStateToProps(state) {
  return {
    metrics: state.metrics,
    guesstimates: state.guesstimates,
    simulations: state.simulations,
    spaces: state.spaces
  }
}

@connect(mapStateToProps)
@connect(denormalizedSpaceSelector)
export default class SpaceListItemComponent extends Component {
  render() {
    if (!!this.props.denormalizedSpace){
      return (
       <SpaceListItem space={this.props.denormalizedSpace} showUser={this.props.showUser}/>
      )
    } else {
      return false
    }
  }
}

