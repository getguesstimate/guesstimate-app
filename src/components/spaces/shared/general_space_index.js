import React, {Component, PropTypes} from 'react'
import Icon from'react-fa'
import { connect } from 'react-redux';
import SpaceList from 'gComponents/spaces/list'
import * as search from 'gModules/search_spaces/actions'
import './style.css'

function mapStateToProps(state) {
  return {
    searchSpaces: state.searchSpaces,
    me: state.me
  }
}

@connect(mapStateToProps)
export default class GeneralSpaceIndex extends Component{
  displayName: 'GeneralSpaceIndex'
  componentWillMount(){
    this.props.dispatch(search.fetch('', this._filters()))
  }
  _search(e) {
    this.props.dispatch(search.fetch(e.target.value, this._filters()))
  }
  _nextPage() {
    this.props.dispatch(search.fetchNextPage())
  }
  _filters(){
    if (!_.isUndefined(this.props.userId)){
      return {user_id: this.props.userId}
    } else {
      return {}
    }
  }
  render () {
    const {searchSpaces, showScreenshots} = this.props
    let spaces = searchSpaces.hits || []
    const hasMorePages = _.isFinite(searchSpaces.page) && (searchSpaces.page < (searchSpaces.nbPages - 1))
    return (
      <div className='GeneralSpaceIndex row'>
        <div className='col-sm-3'>
          <div className='row'>

            <div className='col-sm-12'>
              {this.props.children}
            </div>

            <div className='col-sm-12'>
              <div className='stuff search-form'>
                <div className='ui form'>
                  <input name='search' placeholder='Search Models' onChange={this._search.bind(this)}/>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='col-sm-9'>
          <SpaceList
            spaces={spaces}
            showUsers={true}
            hasMorePages={hasMorePages}
            loadMore={this._nextPage.bind(this)}
            showScreenshots={showScreenshots}
          />
        </div>
      </div>
    )
  }
}
