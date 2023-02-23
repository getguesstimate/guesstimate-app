import _ from "lodash";
import React, { useEffect, useRef, useState } from "react";
import Icon from "~/components/react-fa-patched";

import { SpaceCards } from "~/components/spaces/SpaceCards";
import { Button } from "~/components/utility/buttons/button";
import { CardListElement } from "~/components/utility/Card";
import { DropDown } from "~/components/utility/DropDown";
import { Input } from "~/components/utility/forms";

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
  MONTHLY: "Monthly",
  ALL_TIME: "All Time",
};

const Filters: React.FC<{
  sortBy: SortBy;
  timeframe: Timeframe;
  onChangeSortBy(sortBy: SortBy): void;
  onChangeTimeFrame(timeframe: Timeframe): void;
}> = ({ sortBy, timeframe, onChangeSortBy, onChangeTimeFrame }) => {
  return (
    <div className="flex gap-4">
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
      <div className="flex items-center gap-1 rounded-sm px-2 py-1 text-grey-666 hover:bg-[#e3e8ec]">
        <div>{names[selected]}</div>
        <Icon name="chevron-down" className="text-sm" />
      </div>
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

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, [inputRef.current]);

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
    <div className="mb-12">
      <div className="mt-16 mb-12">
        <h1 className="mb-6 text-center text-3xl font-bold text-grey-444">
          Public Models
        </h1>
        <div className="grid grid-cols-4 items-center gap-8">
          <div className="col-span-2 col-start-2 grid items-stretch">
            <Input
              name="search"
              placeholder="Search"
              theme="padded"
              ref={inputRef}
              onChange={changeSearchValue}
            />
          </div>
          <div>
            <Filters
              sortBy={sortBy}
              timeframe={timeframe}
              onChangeSortBy={setSortBy}
              onChangeTimeFrame={setTimeframe}
            />
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
        <div className="mt-8 text-center">
          <Button size="large" onClick={loadNextPage}>
            Load More
          </Button>
        </div>
      ) : null}
    </div>
  );
};
