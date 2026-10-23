import { searchSpacesR } from "./reducer";

const start = (requestId: number, query: string) => ({
  type: "SEARCH_SPACES_START",
  request: {
    requestId,
    query,
    sortBy: "RECENT",
    filters: { page: 0, hitsPerPage: 21 },
  },
});
const result = (requestId: number, id: number) => ({
  type: "SEARCH_SPACES_GET",
  requestId,
  response: {
    hits: [{ id, objectID: String(id) }],
    page: 0,
    nbPages: 3,
    nbHits: 3,
  },
});

it("ignores stale search results and errors after the query changes", () => {
  let state = searchSpacesR(undefined, start(1, "first"));
  state = searchSpacesR(state, start(2, "second"));
  expect(searchSpacesR(state, result(1, 10))).toBe(state);
  expect(
    searchSpacesR(state, { type: "SEARCH_SPACES_ERROR", requestId: 1 })
  ).toBe(state);
  state = searchSpacesR(state, result(2, 20));
  expect(state.hits.map((hit) => hit.id)).toEqual([20]);
  expect(state.query).toBe("second");
});

it("preserves results after a pagination failure and retries without duplicates", () => {
  let state = searchSpacesR(
    searchSpacesR(undefined, start(1, "")),
    result(1, 10)
  );
  state = searchSpacesR(state, {
    type: "SEARCH_SPACES_MORE_START",
    requestId: 2,
  });
  state = searchSpacesR(state, {
    type: "SEARCH_SPACES_ERROR",
    requestId: 2,
    more: true,
  });
  expect(state.hits.map((hit) => hit.id)).toEqual([10]);
  expect(state.page).toBe(0);
  expect(state.error).toBe("more");
  state = searchSpacesR(state, {
    type: "SEARCH_SPACES_MORE_START",
    requestId: 3,
  });
  state = searchSpacesR(state, {
    type: "SEARCH_SPACES_NEXT_PAGE",
    requestId: 3,
    response: {
      hits: [{ id: 10 }, { id: 20 }],
      page: 1,
      nbPages: 3,
      nbHits: 3,
    },
  });
  expect(state.hits.map((hit) => hit.id)).toEqual([10, 20]);
  expect(state.error).toBeNull();
});

it("does not append an old page to a new search", () => {
  let state = searchSpacesR(
    searchSpacesR(undefined, start(1, "old")),
    result(1, 10)
  );
  state = searchSpacesR(state, {
    type: "SEARCH_SPACES_MORE_START",
    requestId: 2,
  });
  state = searchSpacesR(state, start(3, "new"));
  expect(
    searchSpacesR(state, {
      type: "SEARCH_SPACES_NEXT_PAGE",
      requestId: 2,
      response: { hits: [{ id: 30 }] },
    })
  ).toBe(state);
});

it("keeps the saved scroll position while appending pages and resets it for a new search", () => {
  let state = searchSpacesR(
    searchSpacesR(undefined, start(1, "old")),
    result(1, 10)
  );
  state = searchSpacesR(state, {
    type: "SEARCH_SPACES_SAVE_SCROLL",
    scrollY: 1400,
  });
  state = searchSpacesR(state, {
    type: "SEARCH_SPACES_MORE_START",
    requestId: 2,
  });
  state = searchSpacesR(state, {
    type: "SEARCH_SPACES_NEXT_PAGE",
    requestId: 2,
    response: { hits: [{ id: 20 }], page: 1, nbPages: 3, nbHits: 3 },
  });
  expect(state.scrollY).toBe(1400);
  expect(state.hits.map((hit) => hit.id)).toEqual([10, 20]);
  state = searchSpacesR(state, start(3, "new"));
  expect(state.scrollY).toBe(0);
  expect(state.hits).toEqual([]);
});
