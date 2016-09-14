import React, {Component} from 'react'

import {FactItem} from './item'
import {FactForm} from './form'

import {getVar} from 'gEngine/facts'
import {utils} from 'gEngine/engine'

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

  showEditForm(editingFactId) {
    this.setState({editingFactId})
  }

  renderFactShow(fact) {
    const isExportedFromSpace = (fact.exported_from_id === this.props.spaceId)
    return (
      <FactItem
        key={fact.id}
        fact={fact}
        onEdit={this.showEditForm.bind(this, fact.id)}
        isExportedFromSpace={isExportedFromSpace}
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

  renderSpaceFacts() {
    const {props: {facts, spaceId, imported_fact_ids}, state: {editingFactId}} = this
    const isExportedFromSpace = fact => fact.exported_from_id === this.props.spaceId
    const isImportedFromSpace = fact => imported_fact_ids.indexOf(fact.id) > -1

    let filteredFacts = utils.mutableCopy(facts)
    const exported = _.remove(filteredFacts, e => isExportedFromSpace(e))
    const imported = _.remove(filteredFacts, e => isImportedFromSpace(e))

    return (
      <div>
        {!!exported.length && <h3> Model Outputs </h3>}
        {this.renderFactSublist(exported)}
        {!!imported.length && <h3> Model Inputs </h3>}
        {this.renderFactSublist(imported)}
        {!!filteredFacts.length && <h3> Other Facts </h3>}
        {this.renderFactSublist(filteredFacts)}
      </div>
    )
  }

  renderFactSublist(facts) {
    const {state: {editingFactId}} = this

    return _.map(facts, e => {
      if (e.id === editingFactId) {return this.renderEditForm(e)}
      else {return this.renderFactShow(e)}
    })
  }

  render() {
    return (
      <div className='FactsTab'>
        {this.props.spaceId && this.renderSpaceFacts()}
        {!this.props.spaceId && this.renderFactSublist(this.props.facts)}
        {this.props.isEditable && this.renderNewForm()}
      </div>
    )
  }
}
