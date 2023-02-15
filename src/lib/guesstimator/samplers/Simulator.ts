import _ from "lodash";
import { replaceByMap } from "~/lib/engine/utils";

import { generateRandomReadableId } from "~/lib/engine/metric/generate_random_readable_id";
import { STOCHASTIC_FUNCTIONS } from "./simulator-worker/simulator/evaluator";
import { GuesstimateWorker } from "~/lib/window";
import { PropagationError } from "~/lib/propagation/errors";

const MIN_SAMPLES_PER_WINDOW = 100;

function GCD(a: number, b: number) {
  return !b ? a : GCD(b, a % b);
}

function LCM(a: number, b: number) {
  return (a * b) / GCD(a, b);
}

export type SampleValue = number | { filtered: true };

export type SimulateResult = {
  values?: SampleValue[];
  errors?: PropagationError[];
};

export type Sampler = {
  sample(
    parsedInput: any,
    n: number,
    inputs: { [k: string]: number[] }
  ): Promise<SimulateResult>;
};

export async function simulate(
  expr: string,
  inputs,
  maxSamples: number
): Promise<SimulateResult> {
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
    ...window.workers
      .slice(0, -1)
      .map((worker, index) =>
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
    let finalResult: Required<SimulateResult> = { values: [], errors: [] };
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

const hasStochasticFunction = (text: string) =>
  _.some(STOCHASTIC_FUNCTIONS, (e) => text.indexOf(e) !== -1);

export function neededSamples(
  text: string,
  inputs: { [k: string]: number[] },
  n: number
) {
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

function buildSimulationParams(
  rawExpr: string,
  prevModularIndex: number,
  numSamples: number,
  inputs
) {
  let idMap = {};
  let takenReadableIds: string[] = [];
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

function simulateOnWorker(
  worker: GuesstimateWorker,
  data
): Promise<SimulateResult> {
  return new Promise((resolve, reject) => {
    worker.push(data, ({ data }) => {
      resolve(JSON.parse(data));
    });
  });
}
