import _ from "lodash";

export type FactCategory = {
  id: string;
  name: string;
};

export const isFactCategoryValid = (
  { name }: FactCategory,
  existingNames: string[]
) => !_.isEmpty(name) && !existingNames.includes(name);
