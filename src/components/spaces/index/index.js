import React, {Component} from 'react'
import {connect} from 'react-redux'

import DropDown from 'gComponents/utility/drop-down/index'
import {CardListElement} from 'gComponents/utility/card/index.js'
import SpaceCards from 'gComponents/spaces/cards'

import * as search from 'gModules/search_spaces/actions'

import './style.css'

function mapStateToProps(state) {
  return {
    searchSpaces: state.searchSpaces,
  }
}

const Filters = ({sortBy, timeframe, onChangeSortBy, onChangeTimeFrame}) => (
  <div>
    <DropDown
      openLink={<a className='header-action'>Popular</a>}
      openLink={<a className='header-action'>{sortBy === 'VIEWCOUNT' ? 'Popular' : 'Recent'}</a>}
      position='right'
    >
      <CardListElement header='Popular' onMouseDown={() => {onChangeSortBy('VIEWCOUNT')}}/>
      <CardListElement header='Recent' onMouseDown={() => {onChangeSortBy('CREATED_AT')}}/>
    </DropDown>

    <DropDown
      openLink={<a className='header-action'>{timeframe === 'MONTHLY' ? 'Month' : 'All Time'}</a>}
      position='right'
    >
      <CardListElement header='Month' onMouseDown={() => {onChangeTimeFrame('MONTHLY')}}/>
      <CardListElement header='All Time' onMouseDown={() => {onChangeTimeFrame('ALL_TIME')}}/>
    </DropDown>
  </div>
)

@connect(mapStateToProps)
export default class SpacesIndex extends Component{
  displayName: 'GeneralSpaceIndex'

  state = {
    sortBy: 'VIEWCOUNT',
    timeframe: 'MONTHLY'
  }

  componentWillMount(){
    this._fetchEmptyNew()
  }

  _search(e) {
    if (this.state.timeframe === 'MONTHLY'){
      this.setState({timeframe: 'ALL_TIME'}, () => {this.props.dispatch(search.fetch(e.target.value, this._searchParams()))})
    } else {
      this.props.dispatch(search.fetch(e.target.value, this._searchParams()))
    }
  }

  _nextPage() {
    this.props.dispatch(search.fetchNextPage())
  }

  _fetchEmptyNew() {
    this.props.dispatch(search.fetch('', this._searchParams()))
  }

  _searchParams() {
    const {sortBy, timeframe} = this.state
    return {sortBy, timeframe}
  }

  _changeSortBy(sortBy){
    this.setState({sortBy}, () => {this._fetchEmptyNew()})

  }

  _changeTimeframe(timeframe){
    this.setState({timeframe}, () => {this._fetchEmptyNew()})
  }

  render () {
    const {searchSpaces, showScreenshots} = this.props
    const {sortBy, timeframe} = this.state
    let spaces = searchSpaces.hits || []
    const hasMorePages = _.isFinite(searchSpaces.page) && (searchSpaces.page < (searchSpaces.nbPages - 1))
    return (
      <div className='SpacesIndex'>
        <div className='row'>
          <div className='col-md-4'/>
          <div className='col-xs-12 col-md-4'>
            <div className='SpacesIndex--header'>
              <h1> Public Models </h1>
              <div className='search-form'>
                <div className='ui form'>
                  <input name='search' placeholder='Search' onChange={this._search.bind(this)}/>
                </div>

                <Filters
                  sortBy={sortBy}
                  timeframe={timeframe}
                  onChangeSortBy={this._changeSortBy.bind(this)}
                  onChangeTimeFrame={this._changeTimeframe.bind(this)}
                />
              </div>
            </div>
          </div>
        </div>

        <SpaceCards showPrivacy={false} spaces={spaces.map(s => {return {...s, user: s.user_info, organization: s.organization_info}})}/>

        {!!spaces.length && hasMorePages &&
          <div className='nextPage'>
            <button className={'ui button nextpage large'} onClick={this._nextPage.bind(this)}> {'Load More'} </button>
          </div>
        }
      </div>
    )
  }
}
