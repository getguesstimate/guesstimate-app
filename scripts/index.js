'use strict';
require(['lodash'], function(_) {});
var React = require('react'),
    App = require('./flux/components/app'),
    Fgraph = require('./fgraph');
window.Fgraph = Fgraph;

React.render(<App />, document.body);
