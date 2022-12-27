import React, { Component } from "react";

import { FactListContainer } from "gComponents/facts/list/container";
import { CategoryForm } from "./form";
import { FactCategory } from "gEngine/fact_category";
import { Fact } from "gEngine/facts";

type HeaderProps = {
  category: FactCategory;
  existingCategoryNames: string[];
  onEdit(c: FactCategory): void;
  onDelete(c: FactCategory): void;
};

class CategoryHeader extends Component<HeaderProps> {
  state = {
    editing: false,
    hovering: false,
  };

  onEnter() {
    this.setState({ hovering: true });
  }
  onLeave() {
    this.setState({ hovering: false });
  }
  onStartEditing() {
    this.setState({ editing: true });
  }
  onStopEditing() {
    this.setState({ editing: false });
  }
  onSaveEdits(editedCategory: FactCategory) {
    this.props.onEdit(editedCategory);
    this.onStopEditing();
  }
  onDelete() {
    this.props.onDelete(this.props.category);
  }

  renderEditHeader() {
    return (
      <CategoryForm
        startingCategory={this.props.category}
        onSubmit={this.onSaveEdits.bind(this)}
        onCancel={this.onStopEditing.bind(this)}
        existingCategoryNames={this.props.existingCategoryNames}
      />
    );
  }

  renderShowHeader() {
    const { category } = this.props;
    return (
      <div className="row">
        <div className="col-md-7">
          <h3>{category.name}</h3>
        </div>
        <div className="col-md-5">
          {!!this.state.hovering && (
            <div className="category-actions">
              <span
                className="ui button tiny"
                onClick={this.onStartEditing.bind(this)}
              >
                Edit
              </span>
              <span
                className="ui button tiny"
                onClick={this.onDelete.bind(this)}
              >
                Delete
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  render() {
    return (
      <div
        className="category-header"
        onMouseEnter={this.onEnter.bind(this)}
        onMouseLeave={this.onLeave.bind(this)}
      >
        {!!this.state.editing
          ? this.renderEditHeader()
          : this.renderShowHeader()}
      </div>
    );
  }
}

const NullCategoryHeader = ({}) => (
  <div className="category-header">
    <h3>Uncategorized</h3>
  </div>
);

type Props = {
  category: FactCategory;
  categories: FactCategory[];
  facts: Fact[];
  onEditCategory(c: FactCategory): void;
  onDeleteCategory(c: FactCategory): void;
  organization: any;
  existingVariableNames: string[];
};

export const Category: React.FC<Props> = ({
  category,
  categories,
  facts,
  onEditCategory,
  onDeleteCategory,
  organization,
  existingVariableNames,
}) => (
  <div>
    {!!category && (
      <CategoryHeader
        category={category}
        existingCategoryNames={categories.map((c) => c.name)}
        onEdit={onEditCategory}
        onDelete={onDeleteCategory}
      />
    )}
    {!category && <NullCategoryHeader />}
    <FactListContainer
      organization={organization}
      facts={facts}
      existingVariableNames={existingVariableNames}
      categories={categories}
      canMakeNewFacts={true}
      categoryId={!!category ? category.id : null}
    />
  </div>
);
