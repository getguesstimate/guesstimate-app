import _ from 'lodash';

import BaseDistribution from './base-distribution';

module.exports = class ArrayDistribution extends BaseDistribution {
  constructor(options) {
    super(options);
    this.type = 'array';
  }

  sample() {
    return _.sample(this.value);
  }
};
