'use strict';

require("!style!css!sass!../css/main.scss");

require(['lodash'], function(_) {});
var React = require('react'),
    App = require('./flux/components/app')

React.render(<App />, document.body);
