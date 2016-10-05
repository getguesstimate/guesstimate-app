
export const ERROR_TYPES = {
  UNSET: 0, // For safety; should not be used.
  GRAPH_ERROR: 1,
  PARSER_ERROR: 2,
  WORKER_ERROR: 3,
  SAMPLING_ERROR: 4,
}
export const ERROR_SUBTYPES = {
  GRAPH_ERROR_SUBTYPES: {
    UNSET: 0, // For safety; should not be used.
    MISSING_INPUT_ERROR: 1,
    IN_INFINITE_LOOP: 2,
    INVALID_ANCESTOR_ERROR: 3,
    DUPLICATE_ID_ERROR: 4,
  },
  PARSER_ERROR_SUBTYPES: {
    NULL_WITH_TEXT_ERROR: 5,
    MISSING_FUNCTION_BODY: 6,
    INVALID_RANGE_ORDERING: 7,
    FUNCTIONS_CONTAIN_UNITS_ERROR: 8,
    INCOMPLETE_FUNCTION_ERROR: 9,
  },
  WORKER_ERROR_SUBTYPES: {
    NO_DATA_PASSED_ERROR: 10,
    NO_EXPR_PASSED_ERROR: 11,
    NO_NUMSAMPLES_PASSED_ERROR: 12,
    ZERO_SAMPLES_REQUESTED_ERROR: 13,
  },
  SAMPLING_ERROR_SUBTYPES: {
    UNEXPECTED_END_OF_EXPRESSION_ERROR: 14,
    DIVIDE_BY_ZERO_ERROR: 15,
  },
}

function getGraphErrorMessage(error) {
  const {GRAPH_ERROR_SUBTYPES: {MISSING_INPUT_ERROR, IN_INFINITE_LOOP, INVALID_ANCESTOR_ERROR, DUPLICATE_ID_ERROR}} = ERROR_SUBTYPES
  switch (error.subType) {
    case MISSING_INPUT_ERROR: return 'Metric depends on deleted metric.'
    case IN_INFINITE_LOOP: return 'Metric references itself through dependency chain.'
    case INVALID_ANCESTOR_ERROR: {
      const {ancestors, inputs} = err

      let message = 'Broken '
      if (!_.isEmpty(inputs)) {
        message += `input${inputs.length > 1 ? 's' : ''} ${inputs.join(', ')}`
        if (!_.isEmpty(ancestors)) { message += ' and ' }
      }

      if (!_.isEmpty(ancestors)) { message += `upstream input${ancestors.length > 1 ? 's' : ''} ${ancestors.join(', ')}` }

      message += '.'

      return message
    }
    case DUPLICATE_ID_ERROR: return 'Metric has the same ID as another metric. Contact support for more information.'
  }
  return ''
}

function getParserErrorMessage(error) {
  return ''
  const {
    PARSER_ERROR_SUBTYPES: {
      NULL_WITH_TEXT_ERROR,
      MISSING_FUNCTION_BODY,
      INVALID_RANGE_ORDERING,
      FUNCTIONS_CONTAIN_UNITS_ERROR,
      INCOMPLETE_FUNCTION_ERROR,
    }
  } = ERROR_SUBTYPES

  switch (error.subType) {
    case NULL_WITH_TEXT_ERROR: return 'Syntax Error. TODO'
    case MISSING_FUNCTION_BODY: return 'Missing function body.'
    case INVALID_RANGE_ORDERING: return 'The low number must come first.'
    case FUNCTIONS_CONTAIN_UNITS_ERROR: return 'Functions cannot contain units or symbols.'
    case INCOMPLETE_FUNCTION_ERROR: return 'Function expression incomplete. TODO(Matthew): What is this?'
  }
}

function getWorkerErrorMessage(error) {
  return ''
  const {
    WORKER_ERROR_SUBTYPES: {NO_DATA_PASSED_ERROR, NO_EXPR_PASSED_ERROR, NO_NUMSAMPLES_PASSED_ERROR, ZERO_SAMPLES_REQUESTED_ERROR},
  } = ERROR_SUBTYPES
  switch (error.subType) {
    case NO_DATA_PASSED_ERROR: return 'data required'
    case NO_EXPR_PASSED_ERROR: return 'data.expr required'
    case NO_NUMSAMPLES_PASSED_ERROR: return 'data.numsamples required'
    case ZERO_SAMPLES_REQUESTED_ERROR: return 'zero samples requested.'
  }
}

function getSamplingErrorMessage(error) {
  return ''
  const { SAMPLING_ERROR_SUBTYPES: {UNEXPECTED_END_OF_EXPRESSION_ERROR, DIVIDE_BY_ZERO_ERROR} } = ERROR_SUBTYPES
  switch (error.subType) {
    case UNEXPECTED_END_OF_EXPRESSION_ERROR: return 'Unexpected end of expression'
    case DIVIDE_BY_ZERO_ERROR: return 'Division by zero detected.'
  }
}

export function getMessage(error) {
  switch (error.type) {
    case ERROR_TYPES.GRAPH_ERROR: return getGraphErrorMessage(error)
    case ERROR_TYPES.PARSER_ERROR: return getParserErrorMessage(error)
    case ERROR_TYPES.WORKER_ERROR: return getWorkerErrorMessage(error)
    case ERROR_TYPES.SAMPLING_ERROR: return getSamplingErrorMessage(error)
  }
  return ''
}
