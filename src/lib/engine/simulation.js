import * as sample from './sample';

export function combine(simulations) {
  return {
    metric: simulations[0].metric,
    sample: sample.combine(simulations.map(s => s.sample))
  };
}

export function hasValues(simulation) {
  return (values(simulation).length > 0);
}

export function values(simulation) {
  return _.get(simulation, 'sample.values') || []
}

export function hasErrors(simulation) {
  return (errors(simulation).length > 0);
}

export function errors(simulation) {
  return _.get(simulation, 'sample.errors') || []
}
