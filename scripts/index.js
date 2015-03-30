'use strict';
require(['lodash'], function(_) {});

var React = require('react'),
    App = require('./flux/components/app');

React.render(<App />, document.body);
