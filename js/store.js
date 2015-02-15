(function(Reflux, FermActions, global) {
  'use strict';

  var todoCounter = 0,
  localStorageKey = "fermi";

  global.fermListStore = Reflux.createStore({
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
      var loadedList = localStorage.getItem(localStorageKey);
      if (!loadedList) {
          // If no list is in localstorage, start out with a default one
          this.list = [
            {
              id: todoCounter++,
              created: new Date(),
              name: 'first item',
              mean: 0,
              type: 'estimate'
            },
            {
              id: todoCounter++,
              created: new Date(),
              name: 'second item',
              mean: 0,
              type: 'estimate'
            }
          ];
      } else {
        this.list = JSON.parse(loadedList);
        todoCounter = parseInt(_.max(this.list, 'id').id) + 1
      }
      return this.list;
    }
  })

  global.fermEditingStore = Reflux.createStore({
    listenables: [FermActions],
    getInitialState: function(){
      this.editingNode = 3;
      return this.editingNode;
    },

    // Getters
    getEditingNodeId: function(){
      return this.editingNode;
    },
    getEditingNode: function(){
      return fermListStore.getItem(this.editingNode)
    },

    // Setters
    onUpdateEditingNode: function(id) {
      this.updateEditingNode(id)
    },
    onResetEditingNode: function(id) {
      this.updateEditingNode(null)
    },

    // Helpers
    updateEditingNode: function(id) {
      this.editingNode = id;
      this.trigger(this.editingNode)
    }
  });

})(window.Reflux, window.FermActions, window);
