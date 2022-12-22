import { simulate } from "./Simulator";

export var Sampler = {
  sample({ text }, n, inputs) {
    return simulate(text, inputs, n);
  },
};
