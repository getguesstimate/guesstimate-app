'use strict';

import React from 'react'
import Reflux from 'reflux'
import SpaceStore from '../stores/spacestore.js'

import Input from 'react-bootstrap/lib/Input'
import Tabs from 'react-bootstrap/lib/Tabs'
import Tab from 'react-bootstrap/lib/Tab'
import Icon from'react-fa'
import LazyInput from 'lazy-input'
import Button from 'react-bootstrap/lib/Button'
import $ from 'jquery'

const Item = React.createClass({
  onClick() {
    this.props.onClick({column: this.props.column, row: this.props.row})
  },
  render () {
    return (
      <div className='grid-element ' onClick={this.onClick}>
      </div>
    )
  }
})

const Grid = React.createClass({
  componentDidMount() {
    document.addEventListener('keydown', this.handlePress, false)
  },
  onItemClicked(foo) {
    this.props.onAddItem(foo)
  },
  handlePress(e) {
    if (e.keyCode == '38') {
      this.props.onMove({row: this.props.selected.row - 1, column: this.props.selected.column})
    }
    else if (e.keyCode == '40') {
      this.props.onMove({row: this.props.selected.row + 1, column: this.props.selected.column})
        // down arrow
    }
    else if (e.keyCode == '37') {
      this.props.onMove({row: this.props.selected.row, column: this.props.selected.column - 1})
       // left arrow
    }
    else if (e.keyCode == '39') {
      this.props.onMove({row: this.props.selected.row, column: this.props.selected.column + 1})
       // right arrow
    };
  },
  column(y) {
    return (
     Array.apply(null, {length: 5}).map(Number.call, Number).map((x) => {
        let item = this.props.children.filter(function(i) { return (i.props.row == y && i.props.column == x)})[0];
        let isSelected = this.props.selected.row == y && this.props.selected.column == x
        let show = (item && React.cloneElement(item, {isSelected: isSelected})) || <Item column={x} row={y} key={x,y} onClick={this.onItemClicked} isSelected={isSelected}/>
        return ( <td><div className={"grid-element " + (isSelected ? 'selected' : '')} > {show} </div></td>)
      })
    )
  },
  render () {
    const rows = 5;
    const columns = 4;
    return (
      <div className='grid' onKeyPress={this.handlePress}>
        <table>
          {
            Array.apply(null, {length: 5}).map(Number.call, Number).map((i) => {
              return ( <tr> {this.column(i)} </tr>)
            })
          }
        </table>
      </div>
    )
  }
});

const TextField = React.createClass({
  render() {
    return (
      <LazyInput className="form-control" key={this.props.name} type="text" name={this.props.name} defaultValue="foo" onChange={this.props.onChange} value={this.props.value} />
    )
  }
});
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
  mouseOver: function () {
    this.setState({hover: true});
  },
  mouseOut: function () {
      this.setState({hover: false});
  },
  onRemove () {
    this.props.onRemove(this)
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
        <div className='row'>
          <div className='col-sm-9'>
            <TextField name="name" value={this.state.name} onChange={this.handleChange}/>
          </div>
          <div className='col-sm-3'>
            <Button bsStyle='danger' onClick={this.onRemove}> x </Button>
          </div>
        </div>
    )
  },
  render () {
    return (
      <div className='grid-metric' onMouseEnter={this.mouseOver} onMouseLeave={this.mouseOut}>
        {(this.state.hover || this.props.isSelected) ? this.editView() : this.regularView()}
      </div>
    )
  }
})

const CanvasPage = React.createClass({
  getInitialState () {
    return { items: [{column: 3, row: 3}], selected: {column:0, row:0}}
  },
  onAddItem (item) {
    this.setState({items: [...this.state.items, item]})
  },
  onRemoveItem (item) {
    let newItems = this.state.items.filter(function(i) { return (i.row != item.props.row || i.column != item.props.column)})
    this.setState({items: newItems})
  },
  onMove (e) {
    this.setState({selected: e})
  },
  foo (e) {
    console.log('foo', e)
  },
  render () {
    console.log(this.state)
    return (
      <div onKeyDown={this.foo} className="row repo-component">
        <Grid onKeyDown={this.foo} selected={this.state.selected} onMove={this.onMove} onAddItem={this.onAddItem}>
            {this.state.items.map((i) => {
              return (<Metric row={i.row} column={i.column} onRemove={this.onRemoveItem} key={i.row, i.column}/>)
              })
            }
        </Grid>
      </div>
    );
  }
});

//canvas
module.exports = CanvasPage;
