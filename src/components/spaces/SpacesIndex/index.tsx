import React, { FC, useEffect, useRef, useState } from "react";

import _ from "lodash";
import Icon from "~/components/react-fa-patched";
import { SpaceCards } from "~/components/spaces/SpaceCards";
import { Button } from "~/components/utility/buttons/button";
import { CardListElement } from "~/components/utility/Card";
import { DropDown } from "~/components/utility/DropDown";
import { Input } from "~/components/utility/forms";
import { useAppDispatch, useAppSelector } from "~/modules/hooks";
import * as search from "~/modules/search_spaces/actions";
import { SearchSortBy } from "~/modules/search_spaces/actions";

// Previously we had more than just filter, and we might have more again, so
// this code is more generic than necessary.
function Filter<T extends string>({
  selected,
  names,
  onChange,
}: {
  selected: T;
  names: { [k in T]: string };
  onChange(value: T): void;
}) {
  return (
    <DropDown
      openLink={
        <div className="flex items-center gap-1 rounded-sm px-2 py-1 text-grey-666 hover:bg-[#e3e8ec]">
          <div>{names[selected]}</div>
          <Icon name="chevron-down" className="text-sm" />
        </div>
      }
      position="right"
    >
      {Object.keys(names).map((key: T) => {
        return (
          <CardListElement
            key={key}
            header={names[key]}
            isSelected={selected === key}
            onClick={() => onChange(key)}
            closeOnClick={true}
          />
        );
      })}
    </DropDown>
  );
}

export const SpacesIndex: FC = () => {
  const dispatch = useAppDispatch();
  const searchSpaces = useAppSelector((state) => state.searchSpaces);

  const [sortBy, setSortBy] = useState<SearchSortBy>("RECOMMENDED");
  const [searchValue, setSearchValue] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const loadNextPage = () => {
    dispatch(search.fetchNextPage());
  };

  const changeSearchValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  useEffect(() => {
    dispatch(search.fetch(searchValue, { sortBy }));
  }, [searchValue, sortBy]);

  const spaces = searchSpaces.hits || [];
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
          <div className="flex">
            <Filter<SearchSortBy>
              selected={sortBy}
              onChange={setSortBy}
              names={{
                RECOMMENDED: "Recommended",
                RECENT: "Recent",
              }}
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
