import React, {Component} from 'react'

import {FactItem} from './item'
import {FactForm} from './form'

import {getVar} from 'gEngine/facts'
import './style.css'

export class FactList extends Component {
  state = {
    editingFactId: null,
    newFactKey: 0,
  }

  componentWillUpdate(newProps) {
    if (!!this.state.editingFactId && !_.isEqual(this.props.facts, newProps.facts)) {
      this.setState({editingFactId: null})
    }
  }

  onAddFact(fact) {
    this.props.onAddFact(fact)
    this.setState({newFactKey: this.state.newFactKey + 1})
  }

  renderFactShow(fact) {
    return (
      <FactItem
        key={fact.id}
        fact={fact}
        isEditable={this.props.isEditable}
        onEdit={() => {this.setState({editingFactId: fact.id})}}
      />
    )
  }

  renderEditForm(fact) {
    const {facts, onEditFact} = this.props
    return <FactForm
      startingFact={fact}
      key={fact.id}
      existingVariableNames={facts.map(getVar).filter(v => v !== getVar(fact))}
      buttonText={'Save'}
      onSubmit={onEditFact}
      onDelete={() => {this.props.onDeleteFact(fact)}}
      onCancel={() => {this.setState({editingFactId: null})}}
    />
  }

  renderNewForm() {
    const {facts} = this.props
    return <FactForm
      key={this.state.newFactKey.toString()}
      existingVariableNames={facts.map(getVar)}
      buttonText={'Create'}
      onSubmit={this.onAddFact.bind(this)}
    />
  }

  renderFacts() {
    const {props: {facts}, state: {editingFactId}} = this
    if (!editingFactId) { return _.map(facts, this.renderFactShow.bind(this)) }

    const editingFactIndex = facts.findIndex(fact => fact.id === editingFactId)
    return [
      ..._.map(facts.slice(0, editingFactIndex), this.renderFactShow.bind(this)),
      this.renderEditForm(facts[editingFactIndex]),
      ..._.map(facts.slice(editingFactIndex + 1), this.renderFactShow.bind(this)),
    ]
  }

  render() {
    return (
      <div className='FactsTab'>
        {this.renderFacts()}
        {this.props.isEditable && this.renderNewForm()}
      </div>
    )
  }
}
