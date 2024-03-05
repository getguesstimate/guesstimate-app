import _ from "lodash";
import { Optional } from "./types";

export type FactCategory = {
  id: string;
  name: string;
};

export const isFactCategoryValid = (
  { name }: Optional<FactCategory, "id">,
  existingNames: string[]
) => !_.isEmpty(name) && !existingNames.includes(name);
