import React, {Component} from 'react'
import { connect } from 'react-redux';
import { denormalizedSpaceSelector } from '../denormalized-space-selector.js';
import MetricLabel from '../../metrics/label'

import * as Space from 'gEngine/space';
import './style.css'

let SpaceListItem = ({space}) => (
  <div className='SpaceListItem'>
    <a href={Space.url(space)}>
    <div className='row'>
      <div className='col-xs-6'>
        <h3> {space.name} </h3>
      </div>
        {space.user &&
          <div className='col-xs-6'>
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
      <div className='col-xs-12'>
        {space.metrics.filter(m => !!m.name).map( m => {
          return (<MetricLabel metric={m} key={m.id}/>)
        })}
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
    return (
      <SpaceListItem space={this.props.denormalizedSpace}/>
    )
  }
}

