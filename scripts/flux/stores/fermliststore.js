var React = require('react');
var Reflux = require('reflux');
var FermActions = require('../actions');
var _ = require('../../lodash.min');

var NodeCollection = require('../../nodecollection');
var EdgeCollection = require('../../edgecollection');

class Egraph {
  constructor(args){
    this.nodes = new NodeCollection(args.nodes, this);
    this.edges = new EdgeCollection(args.edges, this);
  }
}
var todoCounter = 1,
    localStorageKey = "fermi";

var fermGraphStore = Reflux.createStore({
    listenables: [FermActions],
    getItems: function() {
        return this.list;
    },
    addEstimate: function() {
        var newItem = {
            id: todoCounter++,
            created: new Date(),
            name: '',
            value: '',
            type: 'estimate'
        };
        this.updateList([newItem].concat(this.list));
        FermActions.updateEditingNode(newItem.id)
    },
    addFunction: function() {
        var newResult = {
            id: todoCounter++,
            created: new Date(),
            name: '',
            value: '',
            type: 'result'
        };
        var newFun = {
            id: todoCounter++,
            created: new Date(),
            function: 'addition',
            type: 'function',
            output: newResult.id
        };
        this.updateList([newResult, newFun].concat(this.list));
        FermActions.updateEditingNode(newResult)
    },
    onAddItem: function(type) {
        if (type=="estimate"){
            this.addEstimate();
        } else {
            this.addFunction();
        }
    },
    onUpdateList: function(list){
        _.map(list, function(n){this._onUpdateItem(n.id, n)}, this)
        this.updateList(this.list);
    },
    onUpdateItem: function(itemId, newValues) {
        this._onUpdateItem(itemId, newValues)
        this.updateList(this.list);
    },
    updateList: function(list) {
        localStorage.setItem(localStorageKey, JSON.stringify(list));
        this.list = list;
        this.trigger(list);
    },
    _onUpdateItem: function(itemId, newValues){
        var item = this.getItem(parseInt(itemId));
        if (!item) {
            return;
        };
        item = _.merge(item, newValues)
    },
    onRemoveItem: function(itemId) {
        var newList = (_.filter(this.list,function(item){
            return item.id!==itemId;
        }));
        this.updateList(newList);
        FermActions.resetEditingNode()
    },
    getItem: function(itemId){
        return _.find(this.list, function(item){
            return item.id === itemId;
        })
    },
    getList: function(){
        return this.list;
    },
    getInitialState: function() {

      var data = {
        nodes: [
          {pid: 2, etype: 'estimate', eprops:{name: 'people in the Europe', value: 10}},
          {pid: 3, etype: 'estimate', eprops:{name: 'people in the US', value: 10}},
          {pid: 4, etype: 'function', eprops:{ftype: 'add'}},
          {pid: 5, etype: 'dependent', eprops:{name: 'people in World'}},
          {pid: 6, etype: 'function', eprops:{ftype: 'mult'}},
          {pid: 7, etype: 'dependent', eprops:{name: 'people in Universe'}},
          {pid: 8, etype: 'estimate', eprops:{name: 'universe/person ratio', value: 200}},
          {pid: 9, etype: 'estimate', eprops:{name: 'other thing', value: 2}}
        ],
        edges: [
          [2,4],
          [3,4],
          [4,5],
          [5,6],
          [6,7],
          [8,6],
          [6,9]
        ]
      };
      this.graph = new Egraph(data);

      // var loadedList = localStorage.getItem(localStorageKey);
      // if (!loadedList) {
      //     // If no list is in localstorage, start out with a default one
      //     this.list = [
      //         {
      //             id: todoCounter++,
      //             created: new Date(),
      //             name: 'first item',
      //             mean: 0,
      //             type: 'estimate'
      //         },
      //         {
      //             id: todoCounter++,
      //             created: new Date(),
      //             name: 'second item',
      //             mean: 0,
      //             type: 'estimate'
      //         }
      //     ];
      // } else {
      //     this.list = JSON.parse(loadedList);
      //     todoCounter = parseInt(_.max(this.list, 'id').id) + 1
      // }
      // return this.list;
          return this.graph;
    }
})

module.exports = fermGraphStore;
