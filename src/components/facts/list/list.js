import React, {Component} from 'react'

import {FactItem} from './item'
import {FactForm} from './form'

import {getVar} from 'gEngine/facts'
import {utils} from 'gEngine/engine'

import './style.css'
import Icon from 'react-fa'

export class FactList extends Component {
  state = {
    editingFactId: null,
    newFactKey: 0,
    showNewForm: false
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
    return (
      <FactItem
        key={fact.id}
        fact={fact}
        onEdit={this.showEditForm.bind(this, fact.id)}
        isExportedFromSelectedSpace={this.isExportedFromSelectedSpaceFn(fact, this.props.spaceId)}
        showModelLink={true}
      />
    )
  }

  renderEditForm(fact) {
    const {existingVariableNames, categories, onEditFact} = this.props
    return <FactForm
      startingFact={fact}
      key={fact.id}
      existingVariableNames={existingVariableNames.filter(v => v !== getVar(fact))}
      categories={categories}
      buttonText={'Save'}
      onSubmit={onEditFact}
      onDelete={() => {this.props.onDeleteFact(fact)}}
      onCancel={() => {this.setState({editingFactId: null})}}
    />
  }

  renderNewForm() {
    const {existingVariableNames, categories, categoryId} = this.props
    return <FactForm
      key={this.state.newFactKey.toString()}
      categoryId={categoryId}
      existingVariableNames={existingVariableNames}
      categories={categories}
      buttonText={'Create'}
      onSubmit={this.onAddFact.bind(this)}
      onCancel={this.hideNewForm.bind(this)}
    />
  }

  renderSpaceFacts() {
    const {props: {facts, spaceId, imported_fact_ids}, state: {editingFactId}} = this
    let filteredFacts = utils.mutableCopy(facts)
    const exported = _.remove(filteredFacts, e => this.isExportedFromSelectedSpaceFn(e, spaceId))
    const imported = _.remove(filteredFacts, e => this.isImportedFromSelectedSpaceFn(e, imported_fact_ids))

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

  isExportedFromSelectedSpaceFn({exported_from_id}, spaceId) {
    return (exported_from_id === spaceId)
  }

  isImportedFromSelectedSpaceFn({id}, imported_fact_ids) {
    return imported_fact_ids.includes(id)
  }

  hideNewForm() {
    this.setState({showNewForm: false})
  }

  showNewForm() {
    this.setState({showNewForm: true})
  }

  render() {
    return (
      <div className='FactsTab'>
        {this.props.spaceId && this.renderSpaceFacts()}
        {!this.props.spaceId && this.renderFactSublist(this.props.facts)}
        {this.props.isEditable && this.state.showNewForm && this.renderNewForm()}
        {this.props.isEditable && !this.state.showNewForm && <NewButton onClick={this.showNewForm.bind(this)}/>}
      </div>
    )
  }
}

const NewButton = ({onClick}) => (
  <a className='NewFactButton' href='#' onClick={onClick}>
    <Icon name='plus'/>
    New Fact
  </a>
)

