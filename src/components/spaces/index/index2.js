import React, {Component, PropTypes} from 'react'
import Icon from'react-fa'
import SpaceList from 'gComponents/spaces/list'
import Container from 'gComponents/utility/container/Container.js'
import * as search from 'gModules/search_spaces/actions'
import GeneralSpaceIndex from '../shared/general_space_index.js'

export default class SpacesIndex extends Component{
  displayName: 'SpacesIndex'
  render () {
    return (
      <Container>
        <GeneralSpaceIndex pageName={'index'} showScreenshots={true}>
          <h2>
            {'Public Models'}
          </h2>
        </GeneralSpaceIndex>
      </Container>
    )
  }
}
