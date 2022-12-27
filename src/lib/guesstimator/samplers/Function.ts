import { simulate } from "./Simulator";

export const Sampler = {
  sample({ text }, n: number, inputs: { [k: string]: number[] }) {
    return simulate(text, inputs, n);
  },
};
