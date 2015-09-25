import * as sample from './sample';

export function combine(simulations) {
  return {
    metric: simulations[0].metric,
    sample: sample.combine(simulations.map(s => s.sample))
  };
}
