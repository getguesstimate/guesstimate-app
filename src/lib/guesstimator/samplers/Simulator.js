import { replaceByMap } from "gEngine/utils";

import generateRandomReadableId from "gEngine/metric/generate_random_readable_id";
import { STOCHASTIC_FUNCTIONS } from "./simulator-worker/simulator/evaluator";

const MIN_SAMPLES_PER_WINDOW = 100;

function GCD(a, b) {
  return !b ? a : GCD(b, a % b);
}

function LCM(a, b) {
  return (a * b) / GCD(a, b);
}

export function simulate(expr, inputs, maxSamples) {
  const overallNumSamples = neededSamples(expr, inputs, maxSamples);

  if (overallNumSamples < MIN_SAMPLES_PER_WINDOW * window.workers.length) {
    return simulateOnWorker(
      window.workers[0],
      buildSimulationParams(expr, 0, overallNumSamples, inputs)
    );
  }

  const numSamples = Math.floor(overallNumSamples / window.workers.length);
  const remainingSamples =
    numSamples + (overallNumSamples % window.workers.length);

  const promises = [
    ..._.map(window.workers.slice(0, -1), (worker, index) =>
      simulateOnWorker(
        worker,
        buildSimulationParams(expr, index * numSamples, numSamples, inputs)
      )
    ),
    simulateOnWorker(
      window.workers[window.workers.length - 1],
      buildSimulationParams(
        expr,
        (window.workers.length - 1) * numSamples,
        remainingSamples,
        inputs
      )
    ),
  ];

  return Promise.all(promises).then((results) => {
    let finalResult = { values: [], errors: [] };
    for (let result of results) {
      if (result.values) {
        finalResult.values = finalResult.values.concat(result.values);
      }
      if (result.errors) {
        finalResult.errors = finalResult.errors.concat(result.errors);
      }
    }
    finalResult.errors = _.uniq(finalResult.errors);
    return finalResult;
  });
}

const hasStochasticFunction = (text) =>
  _.some(STOCHASTIC_FUNCTIONS, (e) => text.indexOf(e) !== -1);

export function neededSamples(text, inputs, n) {
  if (hasStochasticFunction(text)) {
    return n;
  }

  if (Object.keys(inputs).length === 0) {
    return 1;
  }

  // TODO(matthew): A more permanent solution should be sought.
  const numInputs = _.filter(inputs, (i) => !!i).map((i) => i.length);
  if (_.some(numInputs, (i) => i === n)) {
    // No need to compute any further if any of the inputs are maximally sampled. This is a common case so is worth an
    // edge case short circuit here, to avoid gcd/lcm calculation.
    return n;
  }
  return Math.min(
    n,
    numInputs.reduce((x, y) => LCM(x, y))
  );
}

function rotate(array, newStart) {
  return [...array.slice(newStart), ...array.slice(0, newStart)];
}

function modularSlice(array, from, to) {
  const len = array.length;
  if (len <= to - from) {
    return rotate(array, to % len);
  }
  const [newFrom, newTo] = [from % len, to % len];
  if (newTo > newFrom) {
    return array.slice(newFrom, newTo);
  }
  return [...array.slice(newFrom), array.slice(0, to)];
}

function buildSimulationParams(rawExpr, prevModularIndex, numSamples, inputs) {
  let idMap = {};
  let takenReadableIds = [];
  let slicedInputs = {};

  for (let key of Object.keys(inputs)) {
    if (!inputs[key]) {
      console.warn("empty input key passed to buildSimulationParams:", key);
      continue;
    }
    const readableId = generateRandomReadableId(takenReadableIds);
    idMap[`\$\{${key}\}`] = readableId;
    takenReadableIds.push(readableId);
    slicedInputs[readableId] = modularSlice(
      inputs[key],
      prevModularIndex,
      prevModularIndex + numSamples
    );
  }

  const expr = replaceByMap(rawExpr, idMap);
  return { expr, numSamples, inputs: slicedInputs };
}

function simulateOnWorker(worker, data) {
  return new Promise((resolve, reject) => {
    worker.push(data, ({ data }) => {
      resolve(JSON.parse(data));
    });
  });
}
