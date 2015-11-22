import React, {Component, PropTypes} from 'react'
import Icon from'react-fa'
import SpaceList from 'gComponents/spaces/list'
import * as search from 'gModules/search_spaces/actions'
import GeneralSpaceIndex from '../shared/general_space_index.js'

export default class SpacesIndex extends Component{
  displayName: 'SpacesIndex'
  render () {
    return (
      <GeneralSpaceIndex>
        <h2 className='ui header'>
          <div className='content'>
            {'Collections'}
            <div className='sub header'>
              {'Each can have several metrics.'}
            </div>
          </div>
          {_.has(this.props.me, 'id') &&
            <a href='/space/new' className='ui primary button right floated'>
              {'New Collection'}
            </a>
          }
        </h2>
      </GeneralSpaceIndex>
    )
  }
}
