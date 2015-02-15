'use strict';

var React = require('react');
var Reflux = require('reflux');
var FermActions = require('./flux/actions');
var fermListStore = require('./fermliststore');
var fermEditingStore = require('./fermeditingstore');

var todoCounter = 0,
    localStorageKey = "fermi";


var App = React.createClass({
    mixins: [
        Reflux.connect(fermListStore, "list"),
        Reflux.connect(fermEditingStore, "editingNode")
    ],
    render: function() {
        return (
            <div>
                Helloww!
            </div>
        );
    }
});

module.exports = App;
