var graph = {
  var nodes = {
    var list = []
  },
  var edges = {
    var list = []
  },
  nodes: [],
  edges: [],
  addNode: function(newNode){
      this.nodes = ([newNode].concat(this.list));
  },
  updateNode: function(newNode){
      this.nodes = ([newNode].concat(this.list));
  }
  getNode: function(nodeId){
    if (nodeId){
    return _.find(this.state.list, function(node){
      return node.id === nodeId;
    })
    }
  }

}
