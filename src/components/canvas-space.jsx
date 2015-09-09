'use strict';

import React from 'react'
import Reflux from 'reflux'
import SpaceStore from '../stores/spacestore.js'
import Grid from './grid'

import Input from 'react-bootstrap/lib/Input'
import Tabs from 'react-bootstrap/lib/Tabs'
import Tab from 'react-bootstrap/lib/Tab'
import Icon from'react-fa'
import LazyInput from 'lazy-input'
import Button from 'react-bootstrap/lib/Button'
import $ from 'jquery'

window.jquery = $
const TextField = React.createClass({
  render() {
    return (
      <LazyInput className="form-control" key={this.props.name} type="text" name={this.props.name} defaultValue="foo" onChange={this.props.onChange} value={this.props.value} />
    )
  }
});


// const Foo = React.createClass({
//   foo(e) {
//     console.log('made it')
//      e.stopPropagation();
//   },
//   render (){
//     return(
//     <div className='row'>
//       <div className='col-sm-9' onKeyDown={this.foo}>
//         <TextField name="name" value={this.props.name} onKeyDown={this.foo} onChange={this.props.onChange}/>
//       </div>
//       <div className='col-sm-3'>
//         <Button bsStyle='danger' onClick={this.props.onRemove}> x </Button>
//       </div>
//     </div>
//   )
//   }
// })

const SelectedMetric = React.createClass({
  handlePress(e) {
    if (e.keyCode == '13') {
      console.log('enter')
    }
    else if (e.keyCode == '8') {
      e.preventDefault()
      this.props.onRemove(this)
    }
    this.props.gridKeyPress(e)
  },
  componentDidMount: function(){
    this.refs.foo.getDOMNode().focus();
  },
  handleFormPress(e) {
    e.stopPropagation()
  },
  render () {
    return (
      <div className='exists' ref='foo' tabIndex='1' onKeyDown={this.handlePress}>
        <div className='row'>
          <div className='col-sm-9' onKeyDown={this.handleFormPress}>
            <TextField name="name" value={this.props.name} onChange={this.props.onChange}/>
          </div>
          <div className='col-sm-3' onKeyDown={this.handleFormPress}>
            <Button bsStyle='danger' onClick={this.props.onRemove}> x </Button>
          </div>
        </div>
      </div>
    )
  }
})

const Metric = React.createClass({
  getInitialState() {
    return { name: 'foobar', value: 'foooo', hover: false}
  },
  handleChange(evt) {
    const form_values = $(evt.target.parentElement.childNodes).filter(":input");
    let values = {};
    values[form_values[0].name] = form_values.val();
    this.setState(values)
  },
  mouseOver () {
    this.setState({hover: true});
  },
  mouseOut () {
      this.setState({hover: false});
  },
  onRemove () {
    this.props.onRemove(this)
  },
  position () {
    return {row: this.props.row, column: this.props.column}
  },
  regularView() {
    return (
      <div className='row'>
        <div className='col-sm-10'>
          {this.state.name}
        </div>
      </div>
    )
  },
  editView() {
    return (
      <SelectedMetric name={this.state.name} value={this.state.value} onRemove={this.onRemove} gridKeyPress={this.props.gridKeyPress} onChange={this.handleChange}/>
    )
  },
  mouseClick () {
    if (!this.props.isSelected) {
      this.props.onSelect(this.position())
    }
  },
  render () {
    return (
      <div className='grid-metric' onMouseDown={this.mouseClick} onMouseEnter={this.mouseOver} onMouseLeave={this.mouseOut}>
        {this.props.isSelected ?  this.editView() : this.regularView()}
      </div>
    )
  }
})

const CanvasPage = React.createClass({
  getInitialState () {
    return { items: [{column: 3, row: 3}], selected: {column:0, row:0}}
  },
  onAddItem (item) {
  this.setState({items: [...this.state.items, item], selected: item})
  },
  onRemoveItem (item) {
    let newItems = this.state.items.filter(function(i) { return (i.row != item.props.row || i.column != item.props.column)})
    this.setState({items: newItems})
  },
  onMove (e) {
    this.setState({selected: e})
  },
  render () {
    return (
      <div className="row repo-component">
        <Grid selected={this.state.selected} onMove={this.onMove} onAddItem={this.onAddItem}>
            {this.state.items.map((i) => {
              return (<Metric row={i.row} column={i.column} onRemove={this.onRemoveItem} onSelect={this.onMove} key={i.row, i.column}/>)
              })
            }
        </Grid>
      </div>
    );
  }
});

//canvas
module.exports = CanvasPage;
