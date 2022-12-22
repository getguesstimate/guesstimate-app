import { simulate } from "./Simulator";

export var Sampler = {
  sample({ params: [low, high] }, n, _1) {
    return simulate(`uniform(${low},${high})`, [], n);
  },
};
