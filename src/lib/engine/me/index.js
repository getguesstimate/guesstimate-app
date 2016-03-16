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

export function canMakeMorePrivateModels(me) {
  const profile = _.get(me, 'profile')
  if (!profile) { return false }
  const private_model_limit = _.get(profile, 'plan.private_model_limit') || 0
  const has_enough = (profile.private_model_count < private_model_limit)
  return has_enough
}

export function isOwnedByMe(me, space) {
  const user_id = _.get(me, 'profile.id')
  return !!user_id && !!space && (user_id === space.user_id)
}

export function isLoggedIn(me) {
  return _.has(me, 'profile')
}
