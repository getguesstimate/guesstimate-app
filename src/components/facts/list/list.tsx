import _ from "lodash";
import React, { Component } from "react";

import { FactForm } from "./form";
import { FactItem } from "./item";

import { utils } from "gEngine/engine";
import { Fact, getVar } from "gEngine/facts";

import Icon from "gComponents/react-fa-patched";
import { FactCategory } from "gEngine/fact_category";

type Props = {
  spaceId?: number;
  categoryId?: string | null;
  facts: Fact[];
  categories: FactCategory[];
  imported_fact_ids?: string[];
  onAddFact(fact: Fact): void;
  onDeleteFact(fact: Fact): void;
  onEditFact(fact: Fact): void;
  existingVariableNames: string[];
  canMakeNewFacts: boolean;
};

export class FactList extends Component<Props> {
  state = {
    editingFactId: null,
    newFactKey: 0,
    showNewForm: false,
  };

  componentWillUpdate(newProps: Props) {
    if (
      !!this.state.editingFactId &&
      !_.isEqual(this.props.facts, newProps.facts)
    ) {
      this.setState({ editingFactId: null });
    }
  }

  onAddFact(fact: Fact) {
    this.props.onAddFact(fact);
    this.setState({ newFactKey: this.state.newFactKey + 1 });
  }

  showEditForm(editingFactId: string) {
    this.setState({ editingFactId });
  }

  isExportedFromSelectedSpaceFn(fact: Fact): boolean {
    return Boolean(
      this.props.spaceId &&
        String(fact.exported_from_id) === String(this.props.spaceId)
    );
  }
  isImportedFromSelectedSpaceFn({ id }) {
    return this.props.imported_fact_ids?.includes(id);
  }

  showNewForm() {
    this.setState({ showNewForm: true });
  }
  hideNewForm() {
    this.setState({ showNewForm: false });
  }

  renderFactShow(fact: Fact) {
    return (
      <FactItem
        key={fact.id}
        fact={fact}
        onEdit={this.showEditForm.bind(this, fact.id)}
        isExportedFromSelectedSpace={this.isExportedFromSelectedSpaceFn(fact)}
        size="LARGE"
      />
    );
  }

  renderEditForm(fact: Fact) {
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
        buttonText="Create"
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
