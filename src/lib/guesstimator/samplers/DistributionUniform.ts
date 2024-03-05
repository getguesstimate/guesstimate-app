import { Sampler, simulate } from "./Simulator";

export const sampler: Sampler = {
  async sample({ params: [low, high] }, n, _1) {
    return simulate(`uniform(${low},${high})`, [], n);
  },
};
