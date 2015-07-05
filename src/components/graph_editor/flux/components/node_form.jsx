'use strict';

import React from 'react'
import _ from 'lodash'
import ReactBootstrap from 'react-bootstrap'
import Input from 'react-bootstrap/Input'
import $ from 'jquery'
import FermActions from '../actions'

const NodeForm = React.createClass({
  render(){
    let form = null
    const formTypes = {
      'estimate': <EstimateForm node={this.props.node} formType={this.props.formSize} />,
      'dependent': <ResultForm node={this.props.node} formType={this.props.formSize}/>,
      'function': <FunctionForm graph={this.props.graph} node={this.props.node} formType={this.props.formSize}/>
    }
    if (this.props.node){
      form = formTypes[this.props.node.get('nodeType')]
    }
    else { form = '' }
    return (
      <div className="nodeForm">{form}</div>
    )
  }
})

const BaseForm = {
  focusForm() {
    const name = $(this.refs.name)
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
    const form_values = $(evt.target.parentElement.childNodes).filter(":input");
    let values = {};
    values[form_values[0].name] = form_values.val();
    FermActions.updateNode(this.props.node.id, values);
  },

  handleDestroy() {
    FermActions.removeNode(this.props.node.id);
  }
};

const ResultForm = React.createClass({
  mixins: [
    BaseForm
  ],

  render() {
    const node = this.props.node
    return (
      <form>
        <Input type="text" label="name" name="name" value={node.get('name')} onChange={this.handleChange}/>
        <div className="btn btn-danger" onClick={this.handleDestroy}> Destroy </div>
      </form>
    );
  }
});

const EstimateForm = React.createClass({
  mixins: [
    BaseForm
  ],

  getRange(){
    const node = this.props.node
    const value = node.get('value')
    let range = {min: 0, max: 100}
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
    const node = this.props.node

    const inputs = {
      value: <Input key="value" type="number" label="value" name="value" defaultValue="0" value={node.get('value')} onChange={this.handleChange}/>,
      range: <Input key="value-range" type="range" min="0"  max={this.state.range.max} step={this.state.range.step} label="value" name="value" defaultValue="0" value={node.get('value')} onChange={this.handleChange}/>,
      name:  <Input key="name" ref="name" type="text" label="name" name="name" value={node.get('name')} onChange={this.handleChange}/>
    }

    const choose = {
      small: ['value', 'range', 'name'],
      large: ['value','range',  'name']
    }

    const formInputs = _.map(choose[this.props.formType], function(n){
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

const FunctionForm = React.createClass({

  mixins: [
    BaseForm
  ],

  render() {
    const node = this.props.node;
    const currentInputs = node.inputs.nodeIds()
    const outsideMetrics = this.props.graph.outsideMetrics(node)
    const possibleInputs = _.map(outsideMetrics, function(n){
      return <option value={n.id} key={n.id}>{n.toCytoscapeName()}</option>
    });

    const inputs = {
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

    const choose = {
      small: ['selectFunction'],
      large: ['selectFunction', 'selectInputs']
    }

    const formInputs = _.map(choose[this.props.formType], function(n){
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
