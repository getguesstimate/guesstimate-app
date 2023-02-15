import clsx from "clsx";
import React, { Component, useState } from "react";

import { FactCategory, isFactCategoryValid } from "~/lib/engine/fact_category";
import { Optional } from "~/lib/engine/types";

type Props = {
  startingCategory?: Optional<FactCategory, "id">;
  onSubmit(category: Optional<FactCategory, "id">): void;
  onCancel?(): void;
  existingCategoryNames: string[];
};

export const CategoryForm: React.FC<Props> = ({
  startingCategory = { name: "" },
  onSubmit,
  // TODO(matthew): We have wiring (via props) for onCancel, but no button. Either strip that code or add cancellation buttons.
  onCancel,
  existingCategoryNames,
}) => {
  const [runningCategory, setRunningCategory] = useState(startingCategory);

  const isValid = isFactCategoryValid(
    runningCategory,
    existingCategoryNames.filter((n) => n !== startingCategory.name)
  );

  const setCategoryState = (newCategoryState: Partial<FactCategory>) => {
    setRunningCategory({
      ...runningCategory,
      ...newCategoryState,
    });
  };

  const handleSubmit = () => {
    if (!isValid) {
      return;
    }

    onSubmit(runningCategory);
    setCategoryState(startingCategory);
  };

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryState({ name: e.target.value });
  };

  return (
    <div className="flex justify-between">
      <div className={clsx("field", isValid || "error")}>
        <h3>
          <input
            name="name"
            placeholder="New Category"
            value={runningCategory.name}
            onChange={handleChangeName}
          />
        </h3>
      </div>
      <span
        className={clsx("ui button primary tiny", isValid || "disabled")}
        onClick={handleSubmit}
      >
        Save
      </span>
    </div>
  );
};
