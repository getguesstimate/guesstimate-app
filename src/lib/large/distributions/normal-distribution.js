import _ from 'lodash';
import Stochator from 'stochator';

import BaseDistribution from './base-distribution';

module.exports = class NormalDistribution extends BaseDistribution {
  constructor(options) {
    super(options);
    this.type = 'normal';
    this.mean = options.mean;
    this.stdev = options.stdev;
    this.seed = options.seed || 3;
  }

  sample(n = 1) {
    let stochator = new Stochator({
      mean: this.mean,
      stdev: this.stdev,
      seed: this.seed
    });

    let samples = Array.apply(null, {length: n});
    let result = samples.map(n => stochator.next())
    return result
  }

  toJSON() {
    return _.pick(this, 'type', 'mean', 'stdev');
  }
};
