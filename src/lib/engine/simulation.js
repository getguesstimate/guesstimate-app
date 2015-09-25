import * as sample from './sample';

export function combine(simulations) {
  return {
    metricId: simulations[0].metricId,
    sample: sample.combine(simulations.map(s => s.sample))
  };
}
