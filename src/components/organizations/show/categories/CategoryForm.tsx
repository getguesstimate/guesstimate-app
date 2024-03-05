import clsx from "clsx";
import React, { useState } from "react";
import { Button } from "~/components/utility/buttons/button";
import { Input } from "~/components/utility/forms";

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
      <div className={clsx(!isValid && "error")}>
        <Input
          name="name"
          placeholder="New Category"
          error={!isValid}
          value={runningCategory.name}
          onChange={handleChangeName}
        />
      </div>
      <Button
        size="small"
        color="blue"
        disabled={!isValid}
        onClick={handleSubmit}
      >
        Save
      </Button>
    </div>
  );
};
