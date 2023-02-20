import React, { useState } from "react";

import { FactListContainer } from "~/components/facts/list/FactListContainer";
import { Button } from "~/components/utility/buttons/button";
import { Fact } from "~/lib/engine/facts";
import { FactCategory } from "~/lib/engine/fact_category";
import { CategoryForm } from "./CategoryForm";

const HeaderText: React.FC<{ children: string }> = ({ children }) => (
  <h3 className="!m-0 text-grey-888 text-xl italic font-extralight">
    {children}
  </h3>
);

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
      <div className="flex justify-between items-start">
        <HeaderText>{props.category.name}</HeaderText>
        {hovering && (
          <div className="flex gap-1 items-center">
            <Button onClick={handleStartEditing} size="small">
              Edit
            </Button>
            <Button onClick={handleDelete} size="small">
              Delete
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      {editing ? renderEditHeader() : renderShowHeader()}
    </div>
  );
};

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
      <HeaderText>Uncategorized</HeaderText>
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
