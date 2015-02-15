'use strict';
require(['lodash'], function(_) {});
var React = require('react'),
    App = require('./app'),
    Fgraph = require('./fgraph'),
    Reflux = require('reflux'),
    Backbone = require('backbone');
window.Fgraph = Fgraph;

React.render(<App />, document.body);
