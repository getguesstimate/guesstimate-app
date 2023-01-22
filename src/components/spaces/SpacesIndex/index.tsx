import _ from "lodash";
import React, { useEffect, useState } from "react";
import Icon from "~/components/react-fa-patched";

import { SpaceCards } from "~/components/spaces/SpaceCards";
import { CardListElement } from "~/components/utility/Card";
import { DropDown } from "~/components/utility/DropDown";

import { useAppDispatch, useAppSelector } from "~/modules/hooks";
import * as search from "~/modules/search_spaces/actions";

type Timeframe = "ALL_TIME" | "MONTHLY";
type SortBy = "POPULAR" | "RECENT" | "RECOMMENDED";

const sortNames: { [k in SortBy]: string } = {
  RECOMMENDED: "Recommended",
  RECENT: "Recent",
  POPULAR: "Popular",
};

const timeframeNames: { [k in Timeframe]: string } = {
  ALL_TIME: "All Time",
  MONTHLY: "Monthly",
};

const Filters: React.FC<{
  sortBy: SortBy;
  timeframe: Timeframe;
  onChangeSortBy(sortBy: SortBy): void;
  onChangeTimeFrame(timeframe: Timeframe): void;
}> = ({ sortBy, timeframe, onChangeSortBy, onChangeTimeFrame }) => {
  return (
    <div>
      <Filter selected={sortBy} names={sortNames} onChange={onChangeSortBy} />
      {sortBy === "POPULAR" && (
        <Filter
          selected={timeframe}
          names={timeframeNames}
          onChange={onChangeTimeFrame}
        />
      )}
    </div>
  );
};

const Filter: React.FC<{
  // TODO - generic over SortBy/Timeframe
  selected: string;
  names: { [k: string]: string };
  onChange(value: string): void;
}> = ({ selected, names, onChange }) => (
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
          isSelected={selected === key}
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

export const SpacesIndex: React.FC = () => {
  const dispatch = useAppDispatch();
  const searchSpaces = useAppSelector((state) => state.searchSpaces);

  const [sortBy, setSortBy] = useState<SortBy>("RECOMMENDED");
  const [timeframe, setTimeframe] = useState<Timeframe>("ALL_TIME");
  const [searchValue, setSearchValue] = useState("");

  const loadNextPage = () => {
    dispatch(search.fetchNextPage());
  };

  const changeSearchValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setTimeframe("ALL_TIME");
  };

  useEffect(() => {
    dispatch(search.fetch(searchValue, { sortBy, timeframe }));
  }, [searchValue, sortBy, timeframe]);

  const spaces: any[] = searchSpaces.hits || [];
  const hasMorePages =
    _.isFinite(searchSpaces.page) &&
    searchSpaces.page < searchSpaces.nbPages - 1;

  return (
    <div className="SpacesIndex">
      <div className="row">
        <div className="col-md-1" />
        <div className="col-xs-12 col-md-10">
          <div className="SpacesIndex--header">
            <h1>Public Models</h1>
            <div className="search-form">
              <div className="row">
                <div className="col-sm-3" />
                <div className="col-sm-6">
                  <div className="ui form">
                    <input
                      name="search"
                      placeholder="Search"
                      onChange={changeSearchValue}
                    />
                  </div>
                </div>
                <div className="col-sm-3">
                  <Filters
                    sortBy={sortBy}
                    timeframe={timeframe}
                    onChangeSortBy={setSortBy}
                    onChangeTimeFrame={setTimeframe}
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

      {spaces.length && hasMorePages ? (
        <div className="nextPage">
          <button className="ui button nextpage large" onClick={loadNextPage}>
            Load More
          </button>
        </div>
      ) : null}
    </div>
  );
};
