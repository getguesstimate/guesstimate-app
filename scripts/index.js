'use strict';
require(['lodash'], function(_) {});
var React = require('react'),
    App = require('./app');
    Enodes = require('./enodes');
    Enode = require('./enode');
    Fgraph = require('./fgraph');
    Egraph = require('./egraph');

React.render(<App />, document.body);
