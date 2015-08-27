import _ from 'lodash';
import Stochator from 'stochator';

import BaseDistribution from './base-distribution';

module.exports = class NormalDistribution extends BaseDistribution {
  constructor(options) {
    super(options);
    this.type = 'normal';
    this.mean = options.mean;
    this.stdev = options.stdev;
    this.stochator = new Stochator({
      mean: this.mean,
      stdev: this.stdev,
      seed: options.seed
    });
  }

  sample() {
    return this.stochator.next();
  }

  toJSON() {
    return _.pick(this, 'type', 'mean', 'stdev');
  }
};
