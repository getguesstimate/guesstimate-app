import React, { Component } from "react";

import { FactItem } from "./item";
import { FactForm } from "./form";

import { getVar } from "gEngine/facts";
import { utils } from "gEngine/engine";

import "./style.css";
import Icon from "react-fa";

export class FactList extends Component {
  state = {
    editingFactId: null,
    newFactKey: 0,
    showNewForm: false,
  };

  componentWillUpdate(newProps) {
    if (
      !!this.state.editingFactId &&
      !_.isEqual(this.props.facts, newProps.facts)
    ) {
      this.setState({ editingFactId: null });
    }
  }

  onAddFact(fact) {
    this.props.onAddFact(fact);
    this.setState({ newFactKey: this.state.newFactKey + 1 });
  }

  showEditForm(editingFactId) {
    this.setState({ editingFactId });
  }

  isExportedFromSelectedSpaceFn({ exported_from_id }) {
    return exported_from_id === this.props.spaceId;
  }
  isImportedFromSelectedSpaceFn({ id }) {
    return this.props.imported_fact_ids.includes(id);
  }

  showNewForm() {
    this.setState({ showNewForm: true });
  }
  hideNewForm() {
    this.setState({ showNewForm: false });
  }

  renderFactShow(fact) {
    return (
      <FactItem
        key={fact.id}
        fact={fact}
        onEdit={this.showEditForm.bind(this, fact.id)}
        isExportedFromSelectedSpace={this.isExportedFromSelectedSpaceFn(fact)}
        size={"LARGE"}
      />
    );
  }

  renderEditForm(fact) {
    const { existingVariableNames, categories, onEditFact } = this.props;
    return (
      <FactForm
        startingFact={fact}
        key={fact.id}
        existingVariableNames={existingVariableNames.filter(
          (v) => v !== getVar(fact)
        )}
        categories={categories}
        buttonText={"Save"}
        onSubmit={onEditFact}
        onDelete={() => {
          this.props.onDeleteFact(fact);
        }}
        onCancel={() => {
          this.setState({ editingFactId: null });
        }}
      />
    );
  }

  renderNewForm() {
    const { existingVariableNames, categories, categoryId } = this.props;
    return (
      <FactForm
        key={this.state.newFactKey.toString()}
        categoryId={categoryId}
        existingVariableNames={existingVariableNames}
        categories={categories}
        buttonText={"Create"}
        onSubmit={this.onAddFact.bind(this)}
        onCancel={this.hideNewForm.bind(this)}
      />
    );
  }

  renderSpaceFacts() {
    let filteredFacts = utils.mutableCopy(this.props.facts);
    const exported = _.remove(
      filteredFacts,
      this.isExportedFromSelectedSpaceFn.bind(this)
    );
    const imported = _.remove(
      filteredFacts,
      this.isImportedFromSelectedSpaceFn.bind(this)
    );

    return (
      <div>
        {!!exported.length && <h3> Model Output Metrics </h3>}
        {this.renderFactSublist(exported)}
        {!!imported.length && <h3> Model Input Metrics </h3>}
        {this.renderFactSublist(imported)}
        {!!filteredFacts.length && <h3> Other Library Metrics </h3>}
        {this.renderFactSublist(filteredFacts)}
      </div>
    );
  }

  renderFactSublist(facts) {
    const {
      state: { editingFactId },
    } = this;

    return _.map(facts, (e) => {
      if (e.id === editingFactId) {
        return this.renderEditForm(e);
      } else {
        return this.renderFactShow(e);
      }
    });
  }

  render() {
    return (
      <div className="FactsTab">
        {this.props.spaceId && this.renderSpaceFacts()}
        {!this.props.spaceId && this.renderFactSublist(this.props.facts)}
        {this.props.canMakeNewFacts &&
          this.state.showNewForm &&
          this.renderNewForm()}
        {this.props.canMakeNewFacts && !this.state.showNewForm && (
          <NewButton onClick={this.showNewForm.bind(this)} />
        )}
      </div>
    );
  }
}

const NewButton = ({ onClick }) => (
  <div className="NewFactButton" onClick={onClick}>
    <Icon name="plus" />
    New Metric
  </div>
);
