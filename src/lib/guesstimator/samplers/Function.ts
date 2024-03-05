import { Sampler, simulate } from "./Simulator";

export const sampler: Sampler = {
  async sample({ text }, n: number, inputs: { [k: string]: number[] }) {
    return simulate(text, inputs, n);
  },
};
