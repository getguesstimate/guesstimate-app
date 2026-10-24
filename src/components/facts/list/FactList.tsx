import _ from "lodash";
import React, { Component } from "react";

import { FactForm } from "./FactForm";
import { FactItem } from "./FactItem";

import { utils } from "~/lib/engine/engine";
import { Fact, getVar } from "~/lib/engine/facts";

import { Icon } from "~/components/workspace/Icon";
import { FactCategory } from "~/lib/engine/fact_category";
import styles from "./metrics.module.css";

const SublistHeader: React.FC<{ text: string }> = ({ text }) => (
  <h3 className={styles.sectionTitle}>{text}</h3>
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

  componentDidUpdate(previousProps: Props) {
    if (!_.isEqual(this.props.facts, previousProps.facts)) {
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
        <div className={styles.list}>
          {facts.map((fact) => (
            <div key={fact.id} className={styles.listItem}>
              <div>
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
      const filteredFacts = utils.mutableCopy(this.props.facts);
      const exported = _.remove(filteredFacts, isExportedFromSelectedSpaceFn);
      const imported = _.remove(filteredFacts, isImportedFromSelectedSpaceFn);

      return (
        <div className="flex flex-col gap-4">
          {exported.length ? (
            <div>
              <SublistHeader text="Model outputs" />
              {renderFactSublist(exported)}
            </div>
          ) : null}
          {imported.length ? (
            <div>
              <SublistHeader text="Model inputs" />
              {renderFactSublist(imported)}
            </div>
          ) : null}
          {filteredFacts.length ? (
            <div>
              <SublistHeader text="Other metrics" />
              {renderFactSublist(filteredFacts)}
            </div>
          ) : null}
        </div>
      );
    };

    return (
      <div className={styles.library}>
        {this.props.canMakeNewFacts && !this.state.showNewForm && (
          <div className={styles.toolbar}>
            <button
              type="button"
              className={styles.newButton}
              onClick={showNewForm}
            >
              <Icon name="plus" />
              New metric
            </button>
          </div>
        )}
        {this.props.canMakeNewFacts && this.state.showNewForm && (
          <FactForm
            key={this.state.newFactKey.toString()}
            categoryId={this.props.categoryId}
            existingVariableNames={this.props.existingVariableNames}
            categories={this.props.categories}
            buttonText="Create"
            onSubmit={handleAddFact}
            onCancel={hideNewForm}
          />
        )}
        {!this.props.facts.length ? (
          <p className={styles.empty}>No metrics yet.</p>
        ) : this.props.spaceId ? (
          renderSpaceFacts()
        ) : (
          renderFactSublist(this.props.facts)
        )}
      </div>
    );
  }
}
