import _ from "lodash";
import { PropagationError } from "../propagation/errors";
import { parse } from "./formatter/index";
import { SimulateResult } from "./samplers/Simulator";
import { samplerTypes } from "./types";

//Guesstimator.parse({text: '3+123+FA'}]})
//TODO(fix this class)
export class Guesstimator {
  parsedError: PropagationError | undefined;
  parsedInput: any;

  static parse(unparsedInput) {
    const [parsedError, parsedInput] = parse(unparsedInput);
    const newItem = new this({ parsedError, parsedInput });
    return [parsedError, newItem] as const;
  }

  static samplerTypes = samplerTypes;

  constructor({
    parsedError,
    parsedInput,
  }: {
    parsedError: PropagationError | undefined;
    parsedInput: any;
  }) {
    this.parsedError = parsedError;
    this.parsedInput = parsedInput;
  }

  samplerType() {
    return samplerTypes.find(this.parsedInput.guesstimateType);
  }

  needsExternalInputs() {
    return this.parsedInput.guesstimateType === "FUNCTION";
  }

  async sample(
    n: number,
    externalInputs: { [k: string]: number[] } = {}
  ): Promise<SimulateResult> {
    if (this.parsedError) {
      return Promise.resolve({ errors: [this.parsedError], values: [] });
    }

    const samplerType = this.samplerType();
    return samplerType.sampler.sample(this.parsedInput, n, externalInputs);
  }
}
