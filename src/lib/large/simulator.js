import _ from 'lodash';

import PointDistribution from './distributions/point-distribution';
import ArrayDistribution from './distributions/array-distribution';

// Accepts distributions as inputs and outputs
module.exports = class Simulator {
  constructor(options) {
    this.inputs = options.inputs;
    this.operation = options.operation;
    this.samples = options.samples || 500;
  }

  run() {
    const all_single = (_.every(this.inputs, 'type', 'point'));
    return all_single ? this._runPoint() : this._runRegular();
  }

  _runPoint() {
    const values = this.inputs.map(n => n.value);
    const newValue = this.operation.apply(values);
    return new PointDistribution({value: newValue});
  }

  _runRegular() {
    const newValue = this._emptySamples().map(n => this._sample());
    return new ArrayDistribution({value: newValue});
  }

  _emptySamples() {
    return Array.apply(null, {length: this.samples});
  }

  _sample() {
    let samples = this.inputs.map(n => n.sample());
    return this.operation.apply(samples);
  }
};
