import * as sample from './sample';

export function combine(simulations) {
  return {
    metric: simulations[0].metric,
    sample: sample.combine(simulations.map(s => s.sample))
  };
}

export function hasValues(simulation) {
  return _.get(simulation, 'sample.values') && (simulation.sample.values.length > 0);
}
