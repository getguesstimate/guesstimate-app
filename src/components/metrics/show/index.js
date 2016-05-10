import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux';
import { denormalizedSpaceSelector } from '../../spaces/denormalized-space-selector.js';
import style from '../../spaces/show/style.css'
import Icon from 'react-fa'
import * as Space from 'gEngine/space';
import _ from 'lodash'
import MetricProfile from './profile.js'
import { runSimulations } from 'gModules/simulations/actions'

function mapStateToProps(state) {
  return {
    me: state.me,
  }
}

@connect(mapStateToProps)
@connect(denormalizedSpaceSelector)
export default class MetricShow extends Component {
  displayName: 'MetricShow'
  componentDidMount(){
    this.props.dispatch(runSimulations(this.props.denormalizedSpace.metrics))
  }
  render () {
    const space = this.props.denormalizedSpace;
    const metric = space && space.metrics[0]
    return (
    <div>
      <div className='hero-unit'>
        <div className='container-fluid'>
          <div className='ui secondary menu'>

            <div className='item'>
              <h1> {space ? <a href={Space.url(space)}> {space.name}</a> : ''} {metric ? `/ ${metric.name}`: ''} </h1>
            </div>

            <div className='right  menu'>
            {space && space.user &&
              <div>
                <a className='ui image label'>
                  <img  src={space.user.picture}/>
                  {space.user.name}
                </a>
              </div>
            }

            </div>
          </div>
        </div>
      </div>
                {metric && metric.simulation &&
      <MetricProfile metric={metric}/>
                }
    </div>
    )
  }
}
