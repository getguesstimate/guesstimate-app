import { Sampler, simulate } from "./Simulator";

export const sampler: Sampler = {
  sample({ text }, n: number, inputs: { [k: string]: number[] }) {
    return simulate(text, inputs, n);
  },
};
