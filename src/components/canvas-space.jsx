'use strict';

import React from 'react'
import Reflux from 'reflux'
import SpaceStore from '../stores/spacestore.js'
import Metric from './canvas-metric'

import Input from 'react-bootstrap/lib/Input'
import Tabs from 'react-bootstrap/lib/Tabs'
import Tab from 'react-bootstrap/lib/Tab'
import Icon from'react-fa'

const CanvasPage = React.createClass({
  mixins: [
    Reflux.connect(SpaceStore, "space"),
  ],
  render () {
    return (
      <div className="row repo-component">
         {this.state.space.metrics.map((metric) => {
              return (
                <Metric metric={metric} key={metric.id}/>
              )
            })}
      </div>
    );
  }
});

//canvas
module.exports = CanvasPage;
