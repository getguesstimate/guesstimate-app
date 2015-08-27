import _ from 'lodash';

import functionOperations from './lib/function_operations';
import Simulator from './simulator';

// I wanted to use Function, but Function was already taken.
module.exports = class Funct {
  constructor(options) {
    this.guesstimate = options.guesstimate;
    this.inputs = options.inputs || [];
    this.function_type = options.function_type || 'addition';
  }

  toJSON() {
    return {inputs: this.inputs, function_type: this.function_type};
  }

  analyze(distributions = this._findInputDistributions()) {
    const output = this._calculateDistribution(distributions);
    this.guesstimate.distribution = output;
  }

  _findInputDistributions() {
    return this.inputs.map(n => this.guesstimate.metric.page.metricIdToDistribution(n));
  }

  _calculateDistribution(distributions, analyzeOptions = this._defaultAnalyzeOptions()) {
    let simulation = new Simulator({inputs: distributions, operation: this._functionType()});
    return simulation.run();
  }

  _defaultAnalyzeOptions() {
    return {
      samples: 10
    };
  }

  _functionType() {
    return functionOperations[this.function_type];
  }
};
