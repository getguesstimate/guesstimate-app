import {typeSafeEq, allPresent} from './utils'

const equalsProp = (propValue, propName) => e => typeSafeEq(_.get(e, propName), propValue)
const nullFn = x => null

export const get = (collection, id, prop='id') => allPresent(collection, id) ? collection.find(equalsProp(id, prop)) : null
export const gget = (collection, id, searchProp, getProp) => _.get(get(collection, id, searchProp), getProp)
export const getFn = (coll, getProp='id', inProp='id') => !coll ? nullFn : e => get(coll, _.get(e, inProp), getProp)

export const filter = (collection, id, prop='id') => allPresent(collection, id) ? collection.filter(equalsProp(id, prop)) : []
export const some = (collection, id, prop='id') => allPresent(collection, id) ? _.some(collection, equalsProp(id, prop)) : false

export const isPresent = e => !!e && !_.isEmpty(e)

export const andFns = (...predFns) => x => predFns.reduce( (running, currFn) => running && !!currFn(x), true )
