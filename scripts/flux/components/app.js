'use strict';

var Backbone = require('backbone');
var _ = require('../../lodash.min');
var ReactBootstrap = require('react-bootstrap');

var Input = require('react-bootstrap/Input');
var Button = require('react-bootstrap/Button');
var ButtonToolbar = require('react-bootstrap/ButtonToolbar');
var Row = require('react-bootstrap/Row');
var Col = require('react-bootstrap/Col');

var $ = require('jquery');
var React = require('react');
var Reflux = require('reflux');
var FermActions = require('../actions');
var fermGraphStore = require('../stores/fermgraphstore');
var fermEditingStore = require('../stores/fermeditingstore');
var maingraph = require('./estimate_graph');
                  window.fermEditingStore = fermEditingStore;
                  window.fermGraphStore = fermGraphStore;

    var NewButtonPane = React.createClass({
      newEstimate: function(){
        this.props.addNode('estimate')
      },
      newFunction: function(){
        this.props.addNode('function')
      },
      render: function() {
        return (
          <div>
            <Button onClick={this.newEstimate}> New Estimate </Button>
            <Button onClick={this.newFunction}> New Function </Button>
          </div>
        )
      }
    });

    var GraphPane = React.createClass({
      handleClick: function() {
        FermActions.addNode();
      },
      formatNodes: function() {
        return this.props.graph.nodes.toCytoscape()
      },
      formatEdges: function() {
        return this.props.graph.edges.toCytoscape()
      },
      updateAllPositions: function(){
        var oldLocations = _.map(this.props.graph.nodes.models, function(n){ return {id: n.id, renderedPosition: n.get('renderedPosition')}})
        var newLocations = _.map(maingraph.cy.nodes(), function(n){return {id: n.data().nodeId, renderedPosition: n.renderedPosition()}})
        if (!_.isEqual(oldLocations, newLocations)) {
          FermActions.updateNodes(newLocations);
        }
      },
      componentWillUpdate: function() {
      },
      componentDidMount: function() {
        var el = $('.maingraph')[0];
        var nodes = this.formatNodes();
        var edges = this.formatEdges();
        maingraph.create(el, nodes, edges, this.props.updateEditingNode, this.updatePositions, this.updateAllPositions);
        this.updateAllPositions();
      },
      componentDidUpdate: function(){
        maingraph.update(this.formatNodes(), this.formatEdges());
      },
      updatePositions: function(id, position){
        // FermActions.updateNode(id, {position:position});
      },
      render: function() {
        return (
          <div className="maingraph"></div>
        )
      }
    });

    var EditorPane = React.createClass({
      render: function() {

        var form = ''
        if (this.props.node){
          var isEstimate = (this.props.node && this.props.node.get('etype') === 'estimate')
          var isResult = (this.props.node && this.props.node.get('etype') === 'result')
          var isFunction = (this.props.node && this.props.node.get('etype') === 'function')
          var form = ''
          if (isEstimate){
            form = <EstimateForm node={this.props.node}/>
          }
          else if (isResult){
            form = <ResultForm node={this.props.node}/>
          }
          else if (isFunction){
            form = <FunctionForm nodeList={this.props.nodeList} node={this.props.node}/>
          }
          var divStyle = {left: this.props.node.get('renderedPosition').x - 85, top: this.props.node.get('renderedPosition').y + 20};
          form = <div className="well wowo" style={divStyle}> {form} </div>
        }
        return (
          <div className="editorpane">
            {form}
            <NewButtonPane addNode={this.props.addNode}/>
          </div>
        )
      }
    });

    var ResultForm = React.createClass({
      handleChange: function(evt) {
        var form_values = $(evt.target.parentElement.childNodes).filter(":input");
        var values = {};
        values[form_values[0].name] = form_values.val();
        FermActions.updateNode(this.props.node.id, values);
      },
      handleDestroy: function() {
        FermActions.removeNode(this.props.node.id);
      },
      render: function() {
        return (
          <form>
            <Input type="text" label="name" name="name" value={this.props.node.name} onChange={this.handleChange}/>
            <div className="btn btn-danger" onClick={this.handleDestroy}> Destroy </div>
          </form>
        );
      }
    });

    var EstimateForm = React.createClass({
      handleChange: function(evt) {
        var form_values = $(evt.target.parentElement.childNodes).filter(":input")
        var values = {};
        values[form_values[0].name] = form_values.val();
        FermActions.updateNode(this.props.node.id, values);
      },
      focusForm: function(){
        $(this.refs.name.getDOMNode()).find('input').focus()

      },
      componentDidMount: function(){
        this.focusForm()
      },
      componentDidUpdate: function(prevProps){
        if (prevProps.node.id !== this.props.node.id){
          this.focusForm()
        }
      },
      handleDestroy: function() {
        FermActions.removeNode(this.props.node.id);
      },
      render: function() {
        return (
          <form>
            <Input key="foobar" ref="name" type="text" label="name" name="name" value={this.props.node.name} onChange={this.handleChange}/>
            <Input type="text" label="value" name="value" defaultValue="0" value={this.props.node.value} onChange={this.handleChange}/>
            <Input type="text" label="unit" name="unit" defaultValue="0" value={this.props.node.unit} onChange={this.handleChange}/>
          <div className="btn btn-danger" onClick={this.handleDestroy}> Destroy </div>
          </form>
        );
      }
    });

    var FunctionForm = React.createClass({
      handleChange: function(evt) {
        var form_values = $(evt.target.parentElement.childNodes).filter(":input")
        var values = {};
        values[form_values[0].name] = form_values.val();
        FermActions.updateNode(this.props.node.id, values);
      },
      handleDestroy: function() {
        FermActions.removeNode(this.props.node.id);
      },
      render: function() {
        var node = this.props.node;
        var possibleInputNodes = _.filter(this.props.nodeList, function(n){
          var isNotFunction = (n.type !== 'function');
          var isNotNodeOutput = (n.id !== node.output);
          return (isNotFunction && isNotNodeOutput);
        });
        var possibleInputs = _.map(possibleInputNodes, function(n){
          return <option value={n.id}>{n.id}--{n.name}{n.value}</option>
        });
        return (
          <form>
            <Input type="select" label='Function' name="function" defaultValue="addition" value={this.props.node.function} onChange={this.handleChange}>
                <option value="addition">(+) Addition </option>
                <option value="multiplication">(x) Multiplication </option>
            </Input>
            <Input type="select" label='Multiple Select' multiple name="inputs" value={this.props.node.inputs} onChange={this.handleChange} className="function-multiple-form">
              {possibleInputs}
            </Input>
          <div className="btn btn-danger" onClick={this.handleDestroy}> Destroy </div>
          </form>
        );
      }
    });

    var App = React.createClass({
      mixins: [
        Reflux.connect(fermGraphStore, "graph"),
        Reflux.connect(fermEditingStore, "editingNode")
      ],
      getNodeById: function(nodeId){
        return this.state.graph.nodes.get(nodeId)
      },
      handleThis: function(e){
        switch (e.keyCode) {
          case 68: // delete
          case 70:
          default:
        };
      },
      componentDidMount: function(){
        addEventListener("keydown", this.handleThis);
      },
      getEditingNode: function(){
        var id = this.state.editingNode;
        var node = this.getNodeById(id);
        return node;
      },
      addNode: function(type){
        FermActions.addNode(type)
      },
      updateEditingNode: function(nodeId){
        FermActions.updateEditingNode(nodeId)
      },
      render: function() {
        return (
          <div>
              <GraphPane graph={this.state.graph} updateEditingNode={this.updateEditingNode}/>
              <EditorPane graph={this.state.graph} addNode={this.addNode} node={this.getEditingNode()}/>
          </div>
        );
      }
    });

module.exports = App;
