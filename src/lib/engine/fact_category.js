import PropTypes from "prop-types";

export const FactCategoryPT = PropTypes.shape({
  id: PropTypes.number,
  name: PropTypes.string.isRequired,
});

export const isFactCategoryValid = ({ name }, existingNames) =>
  !_.isEmpty(name) && !existingNames.includes(name);
