'use strict';

var Backbone = require('backbone');
var _ = require('underscore');
var Button = require('react-bootstrap/Button');
var $ = require('jquery');

var React = require('react');
var Reflux = require('reflux');
var FermActions = require('../actions');
var fermListStore = require('../stores/fermliststore');
var fermEditingStore = require('../stores/fermeditingstore');
var maingraph = require('./estimate_graph');

    var NewButtonPane = React.createClass({
      newEstimate: function(){
        this.props.addItem('estimate')
      },
      newFunction: function(){
        this.props.addItem('function')
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
        FermActions.addItem();
      },
      formatNodes: function() {
        var functions_objects= {'multiplication': 'x', 'addition': '+'}
        var nodes = _.map(this.props.data, function(d){
          var e = _.clone(d);
          if (e['type'] === 'function'){
            e['name'] = functions_objects[e['function']]
          };
          e['nodeId'] = e['id']
          e['id'] = 'n' + e['id'] // Nodes need letters for cytoscape
          e = _.pick(e, ['id', 'nodeId', 'name', 'value', 'type'])
//-          positions =  d.position
          //return {data: e, position: positions}
          return {data: e}
        })
        return nodes
      },
      formatEdges: function() {
        var functionNodes = _.where(this.props.data, {type: 'function'})
        var edges = []
         _(functionNodes).forEach(function(node){
            _(node.inputs).forEach(function(input){
              var edge = {}
              edge['id'] = node.id + '-' + input
              edge['target'] =  'n' + node.id
              edge['source'] = 'n' + input
              edges.push({data:edge})
            })
            _([node.output]).forEach(function(output){
              var edge = {}
              edge['id'] = node.id + '-' + output
              edge['target'] =  'n' + output
              edge['source'] = 'n' + node.id
              edges.push({data:edge})
            })
          })

        return edges;
      },
      updateAllPositions: function(){
        var oldLocations = _.map(this.props.data, function(n){return {id: n.id, renderedPosition: n.renderedPosition}})
        var newLocations = _.map(maingraph.cy.nodes(), function(n){return {id: n.data().nodeId, renderedPosition: n.renderedPosition()}})
        if (!_.isEqual(oldLocations, newLocations)) {
          FermActions.updateList(newLocations);
        }
      },
      componentWillUpdate: function() {
        this.updateAllPositions();
      },
      componentDidMount: function() {
        var el = $('.maingraph')[0];
        maingraph.create(el, this.formatNodes(), this.formatEdges(), this.props.updateEditingNode, this.updatePositions, this.updateAllPositions);
        this.updateAllPositions();
      },
      componentDidUpdate: function(){
        maingraph.update(this.formatNodes(), this.formatEdges());
      },
      updatePositions: function(id, position){
        // FermActions.updateItem(id, {position:position});
      },
      render: function() {
        return (
          <div className="maingraph"></div>
        )
      }
    });

    var EditorPane = React.createClass({
      render: function() {

        var isEstimate = (this.props.item && this.props.item.type === 'estimate')
        var isResult = (this.props.item && this.props.item.type === 'result')
        var isFunction = (this.props.item && this.props.item.type === 'function')
        var form = ''
        if (isEstimate){
          form = <EstimateForm node={this.props.item}/>
        }
        else if (isResult){
          form = <ResultForm node={this.props.item}/>
        }
        else if (isFunction){
          form = <FunctionForm nodeList={this.props.nodeList} node={this.props.item}/>
        }
        if (form !== ''){
          var divStyle = {left: this.props.item.renderedPosition.x - 85, top: this.props.item.renderedPosition.y + 20};
          form = <div className="well wowo" style={divStyle}> {form} </div>
          }
        return (
          <div className="editorpane">
            {form}
            <NewButtonPane addItem={this.props.addItem}/>
          </div>
        )
      }
    });

    var ResultForm = React.createClass({
      handleChange: function(evt) {
        form_values = $(evt.target.parentElement.childNodes).filter(":input")
        values = {};
        values[form_values[0].name] = form_values.val();
        FermActions.updateItem(this.props.node.id, values);
      },
      handleDestroy: function() {
        FermActions.removeItem(this.props.node.id);
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
        form_values = $(evt.target.parentElement.childNodes).filter(":input")
        values = {};
        values[form_values[0].name] = form_values.val();
        FermActions.updateItem(this.props.node.id, values);
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
        FermActions.removeItem(this.props.node.id);
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
        form_values = $(evt.target.parentElement.childNodes).filter(":input")
        values = {};
        values[form_values[0].name] = form_values.val();
        FermActions.updateItem(this.props.node.id, values);
      },
      handleDestroy: function() {
        FermActions.removeItem(this.props.node.id);
      },
      render: function() {
        var node = this.props.node;
        var possibleInputNodes = _.filter(this.props.nodeList, function(n){
          isNotFunction = (n.type !== 'function');
          isNotNodeOutput = (n.id !== node.output);
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
        Reflux.connect(fermListStore, "list"),
        Reflux.connect(fermEditingStore, "editingNode")
      ],
      getItemById: function(itemId){
        if (itemId){
          return _.find(this.state.list, function(item){
            return item.id === itemId;
          });
        }
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
        var id = this.state.editingNodeId;
        var node = this.getItemById(this.state.list, id);
        return node;
      },
      addItem: function(type){
        FermActions.addItem(type)
      },
      updateEditingNode: function(nodeId){
        FermActions.updateEditingNode(nodeId)
      },
      getDecorateList: function(){
        var EditingNode = _.find(this.list, function(item){
          return item.id === itemId;
        });
        var newList = (_.filter(this.list,function(item){
            return item.id!==itemId;
        }));
        return newlist;
      },
      render: function() {
        return (
          <div>
              <GraphPane data={this.state.list} updateEditingNode={this.updateEditingNode}/>
              <EditorPane nodeList={this.state.list} addItem={this.addItem} item={this.getEditingNode()}/>
          </div>
        );
      }
    });

module.exports = App;
