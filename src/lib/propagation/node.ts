import _ from "lodash";
import * as _collections from "~/lib/engine/collections";
import * as _utils from "~/lib/engine/utils";
import { _matchingFormatter } from "~/lib/guesstimator/formatter/index";
import { Guesstimator } from "~/lib/guesstimator/index";

import { SampleValue } from "../guesstimator/samplers/Simulator";
import { NODE_TYPES } from "./constants";
import { SimulationDAG, SimulationNodeParamsWithInputIndices } from "./DAG";
import * as errorTypes from "./errors";

const {
  ERROR_TYPES: { GRAPH_ERROR, PARSER_ERROR },
  ERROR_SUBTYPES: {
    GRAPH_ERROR_SUBTYPES: { INVALID_ANCESTOR_ERROR },
  },
} = errorTypes;

export class SimulationNode {
  id: string;
  expression: any;
  type: any;
  guesstimateType: any;
  samples: SampleValue[];
  errors: errorTypes.PropagationError[];
  inputIndices: number[];
  DAG: SimulationDAG;
  index: number;
  skipSimulating?: boolean;
  inputs: string[];

  constructor(
    {
      id,
      expression,
      type,
      guesstimateType,
      samples,
      errors,
      inputs,
      inputIndices,
      skipSimulating,
    }: SimulationNodeParamsWithInputIndices,
    DAG: SimulationDAG,
    index: number
  ) {
    this.id = id;
    this.expression = expression;
    this.type = type;
    this.guesstimateType = guesstimateType;
    this.samples = _utils.orArr(samples);
    this.errors = _utils.orArr(errors);
    this.inputIndices = _utils.orArr(inputIndices);
    this.DAG = DAG;
    this.index = index;
    this.skipSimulating = skipSimulating;
    this.inputs = _utils.orArr(inputs);
  }

  simulate(numSamples: number): Promise<any> {
    const startedWithErrors = this._hasErrors();

    const [parsedError, parsedInput] = this._parse();
    if (this._hasParserError() && _.isEmpty(parsedError)) {
      this.errors = this.errors.filter((e) => e.type !== PARSER_ERROR);
    }

    if (this._hasGraphErrors()) {
      // Now, we'll clear all non-parser or -graph errors as we can't be confident that they still apply.
      this.errors = this.errors.filter((e) =>
        [PARSER_ERROR, GRAPH_ERROR].includes(e.type)
      );
      return Promise.resolve(this._getSimulationResults());
    }

    const inputs = this._getInputs();

    const guesstimator = new Guesstimator({ parsedError, parsedInput });
    return guesstimator
      .sample(numSamples, inputs)
      .then(({ values, errors }) => {
        this.samples = _utils.orArr(values);
        this.errors = _utils.orArr(errors);

        if (this._hasErrors() && !startedWithErrors) {
          this._addErrorToDescendants();
        }
        if (!this._hasErrors() && startedWithErrors) {
          this._clearErrorFromDescendants();
        }

        return this._getSimulationResults();
      });
  }

  _data() {
    return this.type === NODE_TYPES.DATA ? this.samples : [];
  }

  _parse(): [errorTypes.PropagationError | undefined, any] {
    const guesstimatorInput = {
      text: this.expression,
      guesstimateType: this.guesstimateType,
      data: this._data(),
    };
    const formatter = _matchingFormatter(guesstimatorInput);
    return [
      formatter.error(guesstimatorInput),
      formatter.format(guesstimatorInput),
    ];
  }

  _getDescendants() {
    return this.DAG.strictSubsetFrom([this.id]);
  }

  _addErrorToDescendants() {
    this._getDescendants().forEach((n) => {
      const dataProp = n.inputs.includes(this.id) ? "inputs" : "ancestors";
      const ancestorError = _collections.get(
        n.errors,
        INVALID_ANCESTOR_ERROR,
        "subType"
      );
      if (ancestorError) {
        ancestorError[dataProp] = _.uniq([
          ...(ancestorError[dataProp] || []),
          this.id,
        ]);
      } else {
        const error: errorTypes.PropagationError = {
          type: GRAPH_ERROR,
          subType: INVALID_ANCESTOR_ERROR,
          inputs: [],
          ancestors: [],
        };
        error[dataProp] = [this.id];
        n.errors.push(error);
      }
    });
  }

  _clearErrorFromDescendants() {
    this._getDescendants().forEach((n) => {
      const ancestorError = _collections.get(
        n.errors,
        INVALID_ANCESTOR_ERROR,
        "subType"
      );
      if (!ancestorError) {
        return;
      }

      ancestorError.ancestors = _.filter(
        ancestorError.ancestors,
        (e) => e !== this.id
      );
      ancestorError.inputs = _.filter(
        ancestorError.inputs,
        (e) => e !== this.id
      );

      if (
        _.isEmpty(ancestorError.ancestors) &&
        _.isEmpty(ancestorError.inputs)
      ) {
        n.errors = _.filter(
          n.errors,
          (e) => e.subType !== INVALID_ANCESTOR_ERROR
        );
      }
    });
  }

  _getInputs() {
    const inputNodes = this.inputIndices.map(
      (inputIdx) => this.DAG.nodes[inputIdx]
    );
    const inputMap = _.transform(
      inputNodes,
      (map, node) => {
        map[node.id] = node.samples;
      },
      {}
    );
    return inputMap;
  }

  _hasErrors() {
    return !_.isEmpty(this.errors);
  }
  _hasParserError() {
    return _collections.some(this.errors, PARSER_ERROR, "type");
  }
  _hasGraphErrors() {
    return _collections.some(this.errors, GRAPH_ERROR, "type");
  }
  _getSimulationResults() {
    return _.pick(this, ["samples", "errors"]);
  }
}
