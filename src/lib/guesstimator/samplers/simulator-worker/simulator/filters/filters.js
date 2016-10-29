// We use an empty object here instead of a more meaningful object to play well with mathjs under the hood.
export const SAMPLE_FILTERED = {filtered: true}

const filterLessThan = (val, min) => val < min ? SAMPLE_FILTERED : val
const filterGreaterThan = (val, max) => val > max ? SAMPLE_FILTERED : val
const filterBetween = (val, min, max) => val < min || val > max ? SAMPLE_FILTERED : val

export const Filters = {
  filterLessThan,
  filterGreaterThan,
  filterBetween,
}
