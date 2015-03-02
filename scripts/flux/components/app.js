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
var fermLocationStore = require('../stores/locationstore');
var maingraph = require('./estimate_graph');
window.fermEditingStore = fermEditingStore;
window.fermLocationStore = fermLocationStore;
window.fermGraphStore = fermGraphStore;
window.maingraph = maingraph;

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
      formatNodes: function() {
        var regular = this.props.graph.nodes.toCytoscape()
        if (this.props.editingNode){
          var editingCytoscapeNode = _.find(regular, function(f){return f.data.nodeId == this.props.editingNode.id}, this)
          editingCytoscapeNode.data.editing = "true"
        }
        return regular
      },
      formatEdges: function() {
        return this.props.graph.edges.toCytoscape()
      },
      updateAllPositions: function(){
        var newLocations = _.map(maingraph.cy.nodes(), function(n){return {id: n.data().nodeId, renderedPosition: n.renderedPosition()}})
        if (!isNaN(newLocations[0].renderedPosition.x)){
          FermActions.updateAllNodeLocations(newLocations);
        }
      },
      componentDidMount: function() { var el = $('.maingraph')[0];
        var nodes = this.formatNodes();
        var edges = this.formatEdges();
        maingraph.create(el, nodes, edges, this.props.updateEditingNode, this.updatePositions, this.updateAllPositions);
      },
      componentDidUpdate: function(){
        maingraph.update(this.formatNodes(), this.formatEdges(), this.updateAllPositions);
      },
      updatePositions: function(objects){
        FermActions.updateNodeLocations(objects);
      },
      render: function() {
        return (
          <div className="maingraph"></div>
        )
      }
    });

    var SidePane = React.createClass({
      render: function() {
        var form = ''
        if (this.props.node){
          var isEstimate = (this.props.node && this.props.node.get('nodeType') === 'estimate')
          var isResult = (this.props.node && this.props.node.get('nodeType') === 'dependent')
          var isFunction = (this.props.node && this.props.node.get('nodeType') === 'function')
          var form = ''
          if (isEstimate){
            form = <EstimateForm node={this.props.node} formType='large' />
          }
          else if (isResult){
            form = <ResultForm node={this.props.node} formType='large'/>
          }
          else if (isFunction){
            form = <FunctionForm graph={this.props.graph} node={this.props.node} formType='large'/>
          }
          form = <div className=""> {form} </div>
        }
        return (
          <div className="sidePane">
            {form}
            <div className="btn btn-danger" onClick={this.handleDestroy}> Destroy </div>
          </div>
        )
      }
    });

    var EditorPane = React.createClass({
      mixins: [
        Reflux.connect(fermLocationStore, "nodeLocations")
      ],
      render: function() {
        var form = ''
        if (this.props.node){
          var isEstimate = (this.props.node && this.props.node.get('nodeType') === 'estimate')
          var isResult = (this.props.node && this.props.node.get('nodeType') === 'dependent')
          var isFunction = (this.props.node && this.props.node.get('nodeType') === 'function')
          var form = ''
          if (isEstimate){
            form = <EstimateForm node={this.props.node} formType='small' />
          }
          else if (isResult){
            form = <ResultForm node={this.props.node} formType='small'/>
          }
          else if (isFunction){
            form = <FunctionForm graph={this.props.graph} node={this.props.node} formType='small'/>
          }
          var nodePosition = _.where(this.state.nodeLocations, {'id':this.props.node.id})
          if (nodePosition.length > 0){
            var renderedPosition = nodePosition[0].renderedPosition
            var divStyle = {left: renderedPosition.x - 85, top: renderedPosition.y + 20};
            form = <div className="wowo" style={divStyle}> {form} </div>
          }
          else {
            form = 'foobar'
          }
        }
        return (
          <div className="editorpane">
            {form}
            <NewButtonPane addNode={this.props.addNode}/>
          </div>
        )
      }
    });

    var BaseForm = {
      focusForm: function(){
        var name = $(this.refs.name)
        if (name > 0){
          $(name.getDOMNode()).find('input').focus()
        }
      },
      componentDidMount: function(){
        this.focusForm()
      },
      componentDidUpdate: function(prevProps){
        if (prevProps.node.id !== this.props.node.id){
          this.focusForm()
        }
      },
      handleChange: function(evt) {
        var form_values = $(evt.target.parentElement.childNodes).filter(":input");
        var values = {};
        values[form_values[0].name] = form_values.val();
        FermActions.updateNode(this.props.node.id, values);
      },
      handleDestroy: function() {
        FermActions.removeNode(this.props.node.id);
      },
    };

    var ResultForm = React.createClass({
      mixins: [
        BaseForm
      ],
      render: function() {
        var node = this.props.node
        return (
          <form>
            <Input type="text" label="name" name="name" value={node.get('name')} onChange={this.handleChange}/>
          </form>
        );
      }
    });

    var EstimateForm = React.createClass({
      mixins: [
        BaseForm
      ],
      render: function() {
        var node = this.props.node
        var inputs = {
          name:  <Input key="name" ref="name" type="text" label="name" name="name" value={node.get('name')} onChange={this.handleChange}/>,
          value: <Input key="value" type="text" label="value" name="value" defaultValue="0" value={node.get('value')} onChange={this.handleChange}/>,
          unit: <Input key="unit" type="text" label="unit" name="unit" defaultValue="0" value={node.get('unit')} onChange={this.handleChange}/>
        }
        var choose = {
          small: ['name'],
          large: ['name', 'value', 'unit']
        }
        var formInputs = _.map(choose[this.props.formType], function(n){
          return inputs[n]
        });
        return (
          <form>
            {formInputs}
          </form>
        );
      }
    });

    var FunctionForm = React.createClass({
      mixins: [
        BaseForm
      ],
      render: function() {
        var node = this.props.node;
        var currentInputs = node.inputs.nodeIds()
        var outsideNodes = this.props.graph.outsideNodes(node)
        var possibleInputs = _.map(outsideNodes, function(n){
          return <option value={n.id} key={n.id}>{n.toCytoscapeName()}</option>
        });
        var inputs = {
          selectFunction:
            <Input type="select" key='functionType' label='Function' name="functionType" defaultValue="addition" value={node.get('functionType')} onChange={this.handleChange}>
                <option value="addition">(+) Addition </option>
                <option value="multiplication">(x) Multiplication </option>
            </Input>,
          selectInputs:
            <Input type="select" label='Multiple Select' key='inputs' multiple name="inputs" value={currentInputs} onChange={this.handleChange} className="function-multiple-form">
              {possibleInputs}
            </Input>
        }
        var choose = {
          small: ['selectFunction'],
          large: ['selectFunction', 'selectInputs']
        }
        var formInputs = _.map(choose[this.props.formType], function(n){
          return inputs[n]
        });
        return (
          <form>
            {formInputs}
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
          <div className="row">
            <div className="col-sm-10">
              <GraphPane graph={this.state.graph} editingNode={this.getEditingNode()} updateEditingNode={this.updateEditingNode}/>
              <EditorPane graph={this.state.graph} addNode={this.addNode} node={this.getEditingNode()}/>
            </div>
            <div className="col-sm-2">
              <SidePane graph={this.state.graph} addNode={this.addNode} node={this.getEditingNode()}/>
            </div>
          </div>
        );
      }
    });

module.exports = App;
