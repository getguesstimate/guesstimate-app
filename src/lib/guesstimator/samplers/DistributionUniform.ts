import { simulate } from "./Simulator";

export const Sampler = {
  sample({ params: [low, high] }, n, _1) {
    return simulate(`uniform(${low},${high})`, [], n);
  },
};
