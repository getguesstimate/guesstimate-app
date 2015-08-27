import _ from 'lodash';

import Funct from './funct';
import Estimate from './estimate';
import PointDistribution from './distributions/point-distribution';
import ArrayDistribution from './distributions/array-distribution';
import NormalDistribution from './distributions/normal-distribution';

module.exports = class Guesstimate {
  constructor(options) {
    this.metric = options.metric;

    let distributionClass = this._distributionClass(options.distribution);
    this.distribution = new distributionClass(options.distribution);

    const [type, typeKlass] = this._findType(options);
    this[type] = new typeKlass(_.merge(_.clone(options[type]), {distribution: this.distribution, guesstimate: this}));
  }

  toJSON() {
    const options = {distribution: this.distribution.toJSON()};
    const [type, ] = this._findType(this);
    options[type] = this[type].toJSON();
    return options;
  }

  _distributionClass(options) {
    switch (options.type){
    case 'point':
      return PointDistribution;
    case 'array':
      return ArrayDistribution;
    case 'normal':
      return NormalDistribution;
    default:
      return PointDistribution;
    }
  }

  _findType(object) {
    if (object.hasOwnProperty('funct')) {
      return ['funct', Funct];
    } else if (object.hasOwnProperty('estimate')) {
      return ['estimate', Estimate];
    } else {
      return [null, null];
    }
  }
};
