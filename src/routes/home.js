import React, {Component, PropTypes} from 'react'
import Icon from'react-fa'
import { connect } from 'react-redux';
import SpaceList from 'gComponents/spaces/list'
import * as search from 'gModules/search_spaces/actions'
import './main.css'

function mapStateToProps(state) {
  return {
    searchSpaces: state.searchSpaces,
    me: state.me
  }
}

@connect(mapStateToProps)
export default class Home extends Component{
  displayName: 'Home'
  componentWillMount(){
    this.props.dispatch(search.fetch(''))
  }
  _search(e) {
    this.props.dispatch(search.fetch(e.target.value))
  }
  _nextPage() {
    const currentPage = this.props.searchSpaces.page
    const nextPage = currentPage + 1
    this.props.dispatch(search.fetchNextPage())
  }
  render () {
    const {searchSpaces} = this.props
    let style = {paddingTop: '3em'}
    const spaces = searchSpaces.hits || []
    const hasMorePages = _.isFinite(searchSpaces.page) && (searchSpaces.page < (searchSpaces.nbPages - 1))
    return (
      <div className='wrap container-fluid' style={style}>
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
        <input onChange={this._search.bind(this)}/>
        <div className='ui divider'></div>
        <div className='spaceList'>
          <SpaceList spaces={spaces} showUsers={true} hasMorePages={hasMorePages} loadMore={this._nextPage.bind(this)}/>
        </div>
      </div>
    )
  }
}
