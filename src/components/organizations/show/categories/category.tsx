import React, { Component, useState } from "react";

import { FactListContainer } from "~/components/facts/list/FactListContainer";
import { CategoryForm } from "./form";
import { FactCategory } from "~/lib/engine/fact_category";
import { Fact } from "~/lib/engine/facts";

type HeaderProps = {
  category: FactCategory;
  existingCategoryNames: string[];
  onEdit(c: FactCategory): void;
  onDelete(c: FactCategory): void;
};

const CategoryHeader: React.FC<HeaderProps> = (props) => {
  const [editing, setEditing] = useState(false);
  const [hovering, setHovering] = useState(false);

  const handleEnter = () => {
    setHovering(true);
  };
  const handleLeave = () => {
    setHovering(false);
  };
  const handleStartEditing = () => {
    setEditing(true);
  };
  const handleStopEditing = () => {
    setEditing(false);
  };
  const handleSaveEdits = (editedCategory: FactCategory) => {
    props.onEdit(editedCategory);
    handleStopEditing();
  };
  const handleDelete = () => {
    props.onDelete(props.category);
  };

  const renderEditHeader = () => {
    return (
      <CategoryForm
        startingCategory={props.category}
        onSubmit={handleSaveEdits}
        onCancel={handleStopEditing}
        existingCategoryNames={props.existingCategoryNames}
      />
    );
  };

  const renderShowHeader = () => {
    return (
      <div className="row">
        <div className="col-md-7">
          <h3>{props.category.name}</h3>
        </div>
        <div className="col-md-5">
          {hovering && (
            <div className="category-actions">
              <span className="ui button tiny" onClick={handleStartEditing}>
                Edit
              </span>
              <span className="ui button tiny" onClick={handleDelete}>
                Delete
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className="category-header"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {editing ? renderEditHeader() : renderShowHeader()}
    </div>
  );
};

const NullCategoryHeader: React.FC = () => (
  <div className="category-header">
    <h3>Uncategorized</h3>
  </div>
);

type Props = {
  category?: FactCategory;
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
    {category ? (
      <CategoryHeader
        category={category}
        existingCategoryNames={categories.map((c) => c.name)}
        onEdit={onEditCategory}
        onDelete={onDeleteCategory}
      />
    ) : (
      <NullCategoryHeader />
    )}
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
