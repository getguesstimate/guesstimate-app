import _ from 'lodash';

import BaseDistribution from './base-distribution';

module.exports = class PointDistribution extends BaseDistribution {
  constructor(options) {
    super(options);
    this.type = 'point';
  }

  sample() {
    return this.value;
  }
};
