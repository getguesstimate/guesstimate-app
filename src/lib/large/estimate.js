import _ from 'lodash';

module.exports = class Estimate {
  constructor(options) {
    this.distribution = options.distribution;
    this.value = options.value;
  }

  update(value) {
    this.value = value;
    this.distribution.value = value;
  }

  toJSON() {
    return _.pick(this, 'value');
  }
};
