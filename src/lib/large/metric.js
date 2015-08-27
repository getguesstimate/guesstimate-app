import _ from 'lodash';
import uid from 'gen-uid';

import Guesstimate from './guesstimate';

module.exports = class Metric {
  constructor(options) {
    this.id = options.id || uid.token();
    this.name = options.name;
    this.guesstimates = options.guesstimates && options.guesstimates.map(n => this._setupGuesstimate(n));
    this.page = options.page;
  }

  // For now, each metric only has one guesstimate.  This will change.
  distribution() {
    return this.guesstimates[0].distribution;
  }

  toJSON() {
    const guesstimates = _.map(this.guesstimates, n => n.toJSON());
    return {id: this.id, name: this.name, guesstimates: guesstimates};
  }

  propagate() {
    this._analyze();
    _.each(this._outputs(), n => n.propagate());
  }

  hasInput(metricId) {
    const funct = this.guesstimates[0].funct;
    return funct && _.includes(funct.inputs, metricId);
  }

  _analyze() {
    const funct = this.guesstimates[0].funct;
    funct && funct.analyze();
  }

  _outputs() {
    return this.page.metricIdToOutputs(this.id);
  }

  _setupGuesstimate(n) {
    let options = _.merge(_.clone(n), {metric: this});
    return new Guesstimate(options);
  }
};
