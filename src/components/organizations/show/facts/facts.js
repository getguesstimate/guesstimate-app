import React, {Component} from 'react'

import {FactRow} from './factRow'
import {FactForm} from './form'

import {getVar} from 'gEngine/facts'

export class FactBookTab extends Component {
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
      <FactRow
        key={fact.id}
        fact={fact}
        onEdit={() => {this.setState({editingFactId: fact.id})}}
      />
    )
  }

  renderFactForm(fact = null) {
    const {facts, onEditFact} = this.props
    let props = {
      key: !!fact ? fact.id : this.state.newFactKey.toString(),
      existingVariableNames: facts.map(getVar).filter(v => v !== getVar(fact)),
      buttonText: !!fact ? 'Save' : 'Create',
      onSubmit: (!!fact ? onEditFact : this.onAddFact.bind(this)),
    }
    if (!!fact) {props.startingFact = fact}
    return (<FactForm {...props}/>)
  }

  renderFacts() {
    const {props: {facts}, state: {editingFactId}} = this
    if (!editingFactId) { return _.map(facts, this.renderFactShow.bind(this)) }

    const editingFactIndex = facts.findIndex(fact => fact.id === editingFactId)
    return [
      ..._.map(facts.slice(0, editingFactIndex), this.renderFactShow.bind(this)),
      this.renderFactForm(facts[editingFactIndex]),
      ..._.map(facts.slice(editingFactIndex + 1), this.renderFactShow.bind(this)),
    ]
  }

  render() {
    return (
      <div className='FactsTab'>
        {this.renderFacts()}
        {this.renderFactForm()}
      </div>
    )
  }
}
