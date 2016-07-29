import * as sample from './sample'

export function combine(simulations) {
  let recentSimulations = simulations

  if (_.some(simulations, s => s.propagationId)) {
    const recentPropagation = _.max(simulations.map(s => s.propagationId))
    recentSimulations = simulations.filter(s => {return s.propagationId === recentPropagation})
  }

  return {
    metric: recentSimulations[0].metric,
    propagationId: recentSimulations[0].propagationId,
    sample: sample.combine(recentSimulations.map(s => s.sample))
  }
}

export function hasValues(simulation) {
  return (values(simulation).length > 0)
}

export function values(simulation) {
  return _.get(simulation, 'sample.values') || []
}

export function hasErrors(simulation) {
  return errors(simulation).length > 0
}

export function errors(simulation) {
  return _.get(simulation, 'sample.errors') || []
}
