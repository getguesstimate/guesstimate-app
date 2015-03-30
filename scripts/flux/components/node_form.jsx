'use strict';

var React = require('react');
var _ = require('../../lodash.min');
var ReactBootstrap = require('react-bootstrap');
var Input = require('react-bootstrap/Input');
var $ = require('jquery');
var FermActions = require('../actions');

var NodeForm = React.createClass({
  render(){
    var formTypes = {
      'estimate': <EstimateForm node={this.props.node} formType={this.props.formSize} />,
      'dependent': <ResultForm node={this.props.node} formType={this.props.formSize}/>,
      'function': <FunctionForm graph={this.props.graph} node={this.props.node} formType={this.props.formSize}/>
    }
    if (this.props.node){
      var form = formTypes[this.props.node.get('nodeType')]
    }
    else { var form = '' }
    return (
      <div className="nodeForm">{form}</div>
    )
  }
})

var BaseForm = {
  focusForm() {
    var name = $(this.refs.name)
    if (name > 0){
      $(name.getDOMNode()).find('input').focus()
    }
  },

  componentDidMount() {
    this.focusForm()
  },

  componentDidUpdate(prevProps){
    if (prevProps.node.id !== this.props.node.id){
      this.focusForm()
    }
  },

  handleChange(evt) {
    var form_values = $(evt.target.parentElement.childNodes).filter(":input");
    var values = {};
    values[form_values[0].name] = form_values.val();
    FermActions.updateNode(this.props.node.id, values);
  },

  handleDestroy() {
    FermActions.removeNode(this.props.node.id);
  }
};

var ResultForm = React.createClass({
  mixins: [
    BaseForm
  ],

  render() {
    var node = this.props.node
    return (
      <form>
        <Input type="text" label="name" name="name" value={node.get('name')} onChange={this.handleChange}/>
        <div className="btn btn-danger" onClick={this.handleDestroy}> Destroy </div>
      </form>
    );
  }
});

var EstimateForm = React.createClass({
  mixins: [
    BaseForm
  ],

  getRange(){
    var node = this.props.node
    var value = node.get('value')
    var range = {min: 0, max: 100}
    if (value){
      range.min = 0
      range.max = parseFloat(value * 5)
      range.step = parseFloat(value * 0.1)
    }
    return range
  },

  getInitialState(){
    return{
      range: this.getRange()
    }
  },

  componentWillUpdate(newProps){
    if (newProps.node.id !== this.props.node.id){
      this.setState({range: this.getRange()})
    }
  },

  render() {
    var node = this.props.node

    var inputs = {
      value: <Input key="value" type="number" label="value" name="value" defaultValue="0" value={node.get('value')} onChange={this.handleChange}/>,
      range: <Input key="value-range" type="range" min="0"  max={this.state.range.max} step={this.state.range.step} label="value" name="value" defaultValue="0" value={node.get('value')} onChange={this.handleChange}/>,
      name:  <Input key="name" ref="name" type="text" label="name" name="name" value={node.get('name')} onChange={this.handleChange}/>
    }

    var choose = {
      small: ['value', 'range', 'name'],
      large: ['value','range',  'name']
    }

    var formInputs = _.map(choose[this.props.formType], function(n){
      return inputs[n]
    });

    return (
      <form key={this.props.node.id}>
        {formInputs}
        <div className="btn btn-danger" onClick={this.handleDestroy}> Destroy </div>
      </form>
    );
  }
});
var FunctionForm = React.createClass({

  mixins: [
    BaseForm
  ],

  render() {
    var node = this.props.node;
    var currentInputs = node.inputs.nodeIds()
    var outsideMetrics = this.props.graph.outsideMetrics(node)
    var possibleInputs = _.map(outsideMetrics, function(n){
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
        <div className="btn btn-danger" onClick={this.handleDestroy}> Destroy </div>
      </form>
    );
  }
});

module.exports = NodeForm
