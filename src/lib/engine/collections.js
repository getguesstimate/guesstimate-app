import {typeSafeEq} from './utils'

export const get = (collection, id, prop='id') => !!collection && !!id ? collection.find(e => typeSafeEq(_.get(e, prop), id)) : null

const nullFn = x => null
export const getFn = (coll, getProp='id', inProp='id') => !coll ? nullFn : e => get(coll, _.get(e, inProp), getProp)

export const filter = (collection, id, prop='id') => !!collection && !!id ? collection.filter(e => _.get(e, prop) === id) : null

export const isPresent = e => !!e && !_.isEmpty(e)
