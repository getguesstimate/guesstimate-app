import _ from 'lodash';

import Metric from './metric';

class Page {
  constructor(options) {
    this.metrics = options.metrics && options.metrics.map(n => this._setupMetric(n));
  }

  toJSON() {
    return {metrics: this.metrics.map(n => n.toJSON())};
  }

  metricIdToDistribution(metricId) {
    return _.filter(this.metrics, 'id', metricId)[0].distribution();
  }

  metricIdToOutputs(metricId) {
    return _.filter(this.metrics, n => n.hasInput(metricId));
  }

  _setupMetric(n) {
    let options = _.merge(_.clone(n), {page: this});
    return new Metric(options);
  }
};
export default Page;
