import _ from "lodash";
import React, { Component } from "react";

import { FactForm } from "./FactForm";
import { FactItem } from "./FactItem";

import { utils } from "~/lib/engine/engine";
import { Fact, getVar } from "~/lib/engine/facts";

import Icon from "~/components/react-fa-patched";
import { ButtonWithIcon } from "~/components/utility/buttons/button";
import { FactCategory } from "~/lib/engine/fact_category";

const NewButton: React.FC<{ onClick(): void }> = ({ onClick }) => (
  <ButtonWithIcon
    onClick={onClick}
    icon={<Icon name="plus" />}
    text="New Metric"
    wide
  />
);

const SublistHeader: React.FC<{ text: string }> = ({ text }) => (
  <h3 className="text-grey-main font-bold text-lg mb-2 mt-4">{text}</h3>
);

type Props = {
  spaceId?: number;
  categoryId?: string | null;
  facts: Fact[];
  categories: FactCategory[];
  imported_fact_ids?: number[];
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
    if (!_.isEqual(this.props.facts, newProps.facts)) {
      this.setState({ editingFactId: null });
    }
  }

  render() {
    const handleAddFact = (fact: Fact) => {
      this.props.onAddFact(fact);
      this.setState({ newFactKey: this.state.newFactKey + 1 });
    };

    const showEditForm = (editingFactId: number) => {
      this.setState({ editingFactId });
    };

    const showNewForm = () => {
      this.setState({ showNewForm: true });
    };
    const hideNewForm = () => {
      this.setState({ showNewForm: false });
    };

    const isImportedFromSelectedSpaceFn = ({ id }: Fact) => {
      return this.props.imported_fact_ids?.includes(id);
    };
    const isExportedFromSelectedSpaceFn = (fact: Fact) => {
      return Boolean(
        this.props.spaceId &&
          String(fact.exported_from_id) === String(this.props.spaceId)
      );
    };

    const renderFactSublist = (facts: Fact[]) => {
      return (
        <div className="space-y-1">
          {facts.map((fact) => (
            <div className="border border-transparent hover:border-grey-ccc">
              <div className="bg-white">
                {fact.id === this.state.editingFactId ? (
                  <FactForm
                    startingFact={fact}
                    key={fact.id}
                    existingVariableNames={this.props.existingVariableNames.filter(
                      (v) => v !== getVar(fact)
                    )}
                    categories={this.props.categories}
                    buttonText="Save"
                    onSubmit={this.props.onEditFact}
                    onDelete={() => {
                      this.props.onDeleteFact(fact);
                    }}
                    onCancel={() => {
                      this.setState({ editingFactId: null });
                    }}
                  />
                ) : (
                  <FactItem
                    key={fact.id}
                    fact={fact}
                    onEdit={() => showEditForm(fact.id)}
                    isExportedFromSelectedSpace={isExportedFromSelectedSpaceFn(
                      fact
                    )}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      );
    };

    const renderSpaceFacts = () => {
      let filteredFacts = utils.mutableCopy(this.props.facts);
      const exported = _.remove(filteredFacts, isExportedFromSelectedSpaceFn);
      const imported = _.remove(filteredFacts, isImportedFromSelectedSpaceFn);

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

    return (
      <div>
        {this.props.spaceId
          ? renderSpaceFacts()
          : renderFactSublist(this.props.facts)}
        {this.props.canMakeNewFacts && (
          <div className="mt-2">
            {this.state.showNewForm ? (
              <FactForm
                key={this.state.newFactKey.toString()}
                categoryId={this.props.categoryId}
                existingVariableNames={this.props.existingVariableNames}
                categories={this.props.categories}
                buttonText="Create"
                onSubmit={handleAddFact}
                onCancel={hideNewForm}
              />
            ) : (
              <NewButton onClick={showNewForm} />
            )}
          </div>
        )}
      </div>
    );
  }
}
