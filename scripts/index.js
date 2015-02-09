'use strict';
require(['lodash'], function(_) {});
var React = require('react'),
    App = require('./app');
    Fgraph = require('./fgraph');
    Backbone = require("backbone");

React.render(<App />, document.body);
