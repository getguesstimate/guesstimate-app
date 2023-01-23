import _ from "lodash";
import React, { Component } from "react";

import { FactForm } from "./FactForm";
import { FactItem } from "./FactItem";

import { utils } from "~/lib/engine/engine";
import { Fact, getVar } from "~/lib/engine/facts";

import Icon from "~/components/react-fa-patched";
import { FactCategory } from "~/lib/engine/fact_category";

const NewButton: React.FC<{ onClick(): void }> = ({ onClick }) => (
  <div className="NewFactButton" onClick={onClick}>
    <Icon name="plus" />
    New Metric
  </div>
);

const SublistHeader: React.FC<{ text: string }> = ({ text }) => (
  <h3 className="text-grey-444">{text}</h3>
);

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
  isImportedFromSelectedSpaceFn({ id }: Fact) {
    return this.props.imported_fact_ids?.includes(id);
  }

  showNewForm() {
    this.setState({ showNewForm: true });
  }
  hideNewForm() {
    this.setState({ showNewForm: false });
  }

  render() {
    const renderFactShow = (fact: Fact) => {
      return (
        <FactItem
          key={fact.id}
          fact={fact}
          onEdit={this.showEditForm.bind(this, fact.id)}
          isExportedFromSelectedSpace={this.isExportedFromSelectedSpaceFn(fact)}
          size="LARGE"
        />
      );
    };

    const renderEditForm = (fact: Fact) => {
      const { existingVariableNames, categories, onEditFact } = this.props;
      return (
        <FactForm
          startingFact={fact}
          key={fact.id}
          existingVariableNames={existingVariableNames.filter(
            (v) => v !== getVar(fact)
          )}
          categories={categories}
          buttonText="Save"
          onSubmit={onEditFact}
          onDelete={() => {
            this.props.onDeleteFact(fact);
          }}
          onCancel={() => {
            this.setState({ editingFactId: null });
          }}
        />
      );
    };
    const renderFactSublist = (facts: Fact[]) => {
      const {
        state: { editingFactId },
      } = this;

      return facts.map((e) => {
        if (e.id === editingFactId) {
          return renderEditForm(e);
        } else {
          return renderFactShow(e);
        }
      });
    };

    const renderSpaceFacts = () => {
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
        <div className="flex flex-col gap-4">
          {exported.length ? (
            <div>
              <SublistHeader text="Model Output Metrics" />
              {renderFactSublist(exported)}
            </div>
          ) : null}
          {imported.length ? (
            <div>
              <SublistHeader text="Model Input Metrics" />
              {renderFactSublist(imported)}
            </div>
          ) : null}
          {filteredFacts.length ? (
            <div>
              <SublistHeader text="Other Library Metrics" />
              {renderFactSublist(filteredFacts)}
            </div>
          ) : null}
        </div>
      );
    };

    const renderNewForm = () => {
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
    };

    return (
      <div>
        {this.props.spaceId
          ? renderSpaceFacts()
          : renderFactSublist(this.props.facts)}
        {this.props.canMakeNewFacts ? (
          this.state.showNewForm ? (
            renderNewForm()
          ) : (
            <NewButton onClick={this.showNewForm.bind(this)} />
          )
        ) : null}
      </div>
    );
  }
}
