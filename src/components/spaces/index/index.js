import Icon from "gComponents/react-fa-patched";
import React, { Component } from "react";
import { connect } from "react-redux";

import SpaceCards from "gComponents/spaces/cards";
import { CardListElement } from "gComponents/utility/card/index.js";
import DropDown from "gComponents/utility/drop-down/index";

import * as search from "gModules/search_spaces/actions";

const TIMEFRAME_ALL_TIME = "ALL_TIME";
const TIMEFRAME_MONTHLY = "MONTHLY";
const SORT_BY_POPULAR = "POPULAR";
const SORT_BY_RECENT = "RECENT";
const SORT_BY_RECOMMENDED = "RECOMMENDED";

const Filters = ({ sortBy, timeframe, onChangeSortBy, onChangeTimeFrame }) => {
  let sortNames = {};
  sortNames[SORT_BY_RECOMMENDED] = "Recommended";
  sortNames[SORT_BY_RECENT] = "Recent";
  sortNames[SORT_BY_POPULAR] = "Popular";

  let timeframeNames = {};
  timeframeNames[TIMEFRAME_MONTHLY] = "Monthly";
  timeframeNames[TIMEFRAME_ALL_TIME] = "All Time";
  return (
    <div>
      <Filter selected={sortBy} names={sortNames} onChange={onChangeSortBy} />
      {sortBy === SORT_BY_POPULAR && (
        <Filter
          selected={timeframe}
          names={timeframeNames}
          onChange={onChangeTimeFrame}
        />
      )}
    </div>
  );
};

const Filter = ({ selected, names, onChange }) => (
  <DropDown
    openLink={
      <a className="header-action">
        {names[selected]}
        <Icon name="chevron-down" />
      </a>
    }
    position="right"
  >
    {Object.keys(names).map((key) => {
      return (
        <CardListElement
          header={names[key]}
          selected={names[selected] === key}
          onMouseDown={() => {
            onChange(key);
          }}
          key={key}
          closeOnClick={true}
        />
      );
    })}
  </DropDown>
);

function mapStateToProps(state) {
  return {
    searchSpaces: state.searchSpaces,
  };
}

class SpacesIndex extends Component {
  state = {
    sortBy: SORT_BY_RECOMMENDED,
    timeframe: TIMEFRAME_ALL_TIME,
    searchValue: "",
  };

  componentWillMount() {
    this._fetch();
  }

  _nextPage() {
    this.props.dispatch(search.fetchNextPage());
  }

  _changeSearchValue(e) {
    this.setState(
      { searchValue: e.target.value, timeframe: TIMEFRAME_ALL_TIME },
      this._fetch
    );
  }

  _changeSortBy(sortBy) {
    this.setState({ sortBy }, this._fetch);
  }

  _changeTimeframe(timeframe) {
    this.setState({ timeframe }, this._fetch);
  }

  _fetch() {
    const { searchValue, sortBy, timeframe } = this.state;
    this.props.dispatch(search.fetch(searchValue, { sortBy, timeframe }));
  }

  render() {
    const { searchSpaces, showScreenshots } = this.props;
    const { sortBy, timeframe } = this.state;
    let spaces = searchSpaces.hits || [];
    const hasMorePages =
      _.isFinite(searchSpaces.page) &&
      searchSpaces.page < searchSpaces.nbPages - 1;
    return (
      <div className="SpacesIndex">
        <div className="row">
          <div className="col-md-1" />
          <div className="col-xs-12 col-md-10">
            <div className="SpacesIndex--header">
              <h1> Public Models </h1>
              <div className="search-form">
                <div className="row">
                  <div className="col-sm-3" />
                  <div className="col-sm-6">
                    <div className="ui form">
                      <input
                        name="search"
                        placeholder="Search"
                        onChange={this._changeSearchValue.bind(this)}
                      />
                    </div>
                  </div>
                  <div className="col-sm-3">
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
          </div>
        </div>

        <SpaceCards
          showPrivacy={false}
          spaces={spaces.map((s) => {
            return {
              ...s,
              user: s.user_info,
              organization: s.organization_info,
            };
          })}
        />

        {!!spaces.length && hasMorePages && (
          <div className="nextPage">
            <button
              className={"ui button nextpage large"}
              onClick={this._nextPage.bind(this)}
            >
              {" "}
              {"Load More"}{" "}
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default connect(mapStateToProps)(SpacesIndex);
