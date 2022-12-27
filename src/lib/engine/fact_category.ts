import _ from "lodash";
import PropTypes from "prop-types";

export type FactCategory = {
  id: string;
  name: string;
};

export const FactCategoryPT = PropTypes.shape({
  id: PropTypes.number,
  name: PropTypes.string.isRequired,
});

export const isFactCategoryValid = (
  { name }: FactCategory,
  existingNames: string[]
) => !_.isEmpty(name) && !existingNames.includes(name);
