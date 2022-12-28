import _ from "lodash";
import { Evaluate } from "./simulator/evaluator";

import * as errorTypes from "lib/propagation/errors";

const {
  ERROR_TYPES: { WORKER_ERROR },
  ERROR_SUBTYPES: {
    WORKER_ERROR_SUBTYPES: {
      NO_DATA_PASSED_ERROR,
      NO_EXPR_PASSED_ERROR,
      NO_NUMSAMPLES_PASSED_ERROR,
      ZERO_SAMPLES_REQUESTED_ERROR,
    },
  },
} = errorTypes;

onmessage = ({ data }) => {
  let errors: any[] = [];
  if (!data) {
    errors.push({ type: WORKER_ERROR, subType: NO_DATA_PASSED_ERROR });
    postMessage(JSON.stringify({ errors }));
    return;
  }

  data = JSON.parse(data);

  if (!data.expr) {
    errors.push({ type: WORKER_ERROR, subType: NO_EXPR_PASSED_ERROR });
  }
  if (!data.numSamples) {
    if (data.numSamples === 0) {
      errors.push({
        type: WORKER_ERROR,
        subType: ZERO_SAMPLES_REQUESTED_ERROR,
      });
    } else {
      errors.push({ type: WORKER_ERROR, subType: NO_NUMSAMPLES_PASSED_ERROR });
    }
  }

  if (!_.isEmpty(errors)) {
    postMessage(JSON.stringify({ errors }));
  } else {
    postMessage(
      JSON.stringify(Evaluate(data.expr, data.numSamples, data.inputs))
    );
  }
};
