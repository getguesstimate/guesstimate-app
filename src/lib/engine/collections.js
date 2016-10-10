import {typeSafeEq, allPresent} from './utils'

const equalsProp = (propValue, propName) => e => typeSafeEq(_.get(e, propName), propValue)
const nullFn = x => null

// These functions help you get things from a collection.
//   * `get(collection, id, prop='id')` will retrieve the element from `collection` with property `prop` equal to `id`
//   * `gget(collection, id, searchProp, getProp)` will retrieve the property `getProp` (or null) from the element of
//     `collection` that has property `searchProp` equal to `id`.
//   * `getFn(coll, getProp='id', inProp='id')` returns a function that takes an obect, and returns the element from
//     `coll` that has property `getProp` equal in value to the property `inProp` of `e`.
export const get = (collection, id, prop='id') => allPresent(collection, id) ? collection.find(equalsProp(id, prop)) : null
export const gget = (collection, id, searchProp, getProp) => _.get(get(collection, id, searchProp), getProp)
export const getFn = (coll, getProp='id', inProp='id') => !coll ? nullFn : e => get(coll, _.get(e, inProp), getProp)

export const filter = (collection, id, prop='id') => allPresent(collection, id) ? collection.filter(equalsProp(id, prop)) : []
export const filterByInclusion = (collection, prop, ids) => allPresent(collection, ids) ? collection.filter(e => ids.includes(_.get(e, prop))) : []
export const some = (collection, id, prop='id') => allPresent(collection, id) ? _.some(collection, equalsProp(id, prop)) : false

export const andFns = (...predFns) => (...x) => predFns.reduce( (running, currFn) => running && !!currFn(...x), true )
export const orFns = (...predFns) => (...x) => predFns.reduce( (running, currFn) => running || !!currFn(...x), false )

// TODO(matthew): (Re-)Figure out why the reverses are necessary, and eliminate that necessity.
export const uniq = (collection, prop='id') => _.uniqBy(collection.slice().reverse(), prop).reverse()
