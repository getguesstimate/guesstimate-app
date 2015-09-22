'use strict';

import React from 'react'
import Reflux from 'reflux'
import Page from 'lib/large/page'
import SpaceActions from '../actions/space-actions'

let json = {
  monteCarlo: {
    samples: 100
  },
  metrics:
    [
      {id: '124', name: 'cats', guesstimates: [{ distribution: { type: 'normal', mean: 300, stdev: 100}, estimate: {value: 1000} }] },
      {id: '125', name: 'dogs', guesstimates: [{ distribution: { type: 'normal', mean: 500, stdev: 300}, estimate: {value: 500} }] },
      {id: '126', name: 'animals', guesstimates: [{ distribution: {type: 'point', value: 40 }, funct: {inputs: ['124', '125'], function_type: 'addition'} }] },
      {id: '127', name: 'humans', guesstimates: [{ distribution: {type: 'point', value: 100}, estimate: {value: 500} }] },
      {id: '128', name: 'beings', guesstimates: [{ distribution: {type: 'point', value: 40 }, funct: {inputs: ['126', '127'], function_type: 'addition'} }] }
    ]
};

const SpaceStore = Reflux.createStore({
  listenables: [SpaceActions],
  onMetricUpdateEstimate(metricId, values) {
    let metric = _.find(this.space.metrics, {id: metricId});
    let distribution = metric.guesstimates[0].estimate.distribution
    _.extend(distribution, values)
    distribution.mean = parseFloat(distribution.mean)
    distribution.stdev = parseFloat(distribution.stdev)
    distribution.value = parseFloat(distribution.value)
    this.onMetricPropogate(metricId)
  },
  onMetricUpdate(metricId, values){
    let metric = _.find(this.space.metrics, {id: metricId});
    _.extend(metric, values)
    this.trigger(this.space)
  },
  onMetricPropogate(metricId) {
    let metric = _.find(this.space.metrics, {id: metricId});
    app.trigger = () => this.trigger(this.space)
    this.trigger(this.space)

    let forward = () => metric.propagate();
    if (this.forwarder){this.forwarder.cancel()}
    this.forwarder = _.debounce(forward, 50)
    this.forwarder()
  },
  getInitialState () {
    this.space = new Page(json);
    return this.space;
  }
})

module.exports = SpaceStore;
