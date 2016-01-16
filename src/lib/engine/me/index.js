export * as localStorage from './localStorage.js';

export function spaces(me, graph) {
  id = guesstimateId(me)
  if (id) {
    return graph.guesstimates.filter(g => g.user == id)
  }
}

export function guesstimateId(me) {
  return _.get(me, 'profile.user_metadata.guesstimateId')
}

export function canUsePrivateModels(me) {
  return !!_.get(me, 'profile.has_private_access')
}

export function isOwnedByMe(me, space) {
  const user_id = _.get(me, 'profile.id')
  return !!user_id && !!space && (user_id === space.user_id)
}

export function isLoggedIn(me) {
  return _.has(me, 'profile')
}
