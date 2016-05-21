import React, {Component, PropTypes} from 'react'
import Icon from'react-fa'
import { connect } from 'react-redux';
import SpaceCards from 'gComponents/spaces/cards'
import * as search from 'gModules/search_spaces/actions'
import './style.css'

function mapStateToProps(state) {
  return {
    searchSpaces: state.searchSpaces,
    users: state.users,
  }
}

@connect(mapStateToProps)
export default class SpacesIndex extends Component{
  displayName: 'GeneralSpaceIndex'
  componentWillMount(){
    this.props.dispatch(search.fetch('', {}))
  }
  _search(e) {
    this.props.dispatch(search.fetch(e.target.value, {}))
  }
  _nextPage() {
    this.props.dispatch(search.fetchNextPage())
  }
  render () {
    const {searchSpaces, showScreenshots} = this.props
    let spaces = searchSpaces.hits || []
    const hasMorePages = _.isFinite(searchSpaces.page) && (searchSpaces.page < (searchSpaces.nbPages - 1))
    return (
      <div className='SpacesIndex'>
        <div className='row'>
          <div className='col-md-4'/>
          <div className='col-md-4'>
            <div className='search-form'>
              <div className='ui form'>
                <input name='search' placeholder='Search Models' onChange={this._search.bind(this)}/>
              </div>
            </div>
          </div>
        </div>

        <SpaceCards showPrivacy={false} spaces={spaces.map(s => {return {...s, user: s.user_info}})}/>

        {!!spaces.length && hasMorePages &&
          <div className='nextPage'>
            <button className={'ui button nextpage large'} onClick={this._nextPage.bind(this)}> {'Load More'} </button>
          </div>
        }
      </div>
    )
  }
}
