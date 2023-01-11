import { Sampler } from "./Simulator";

export const sampler: Sampler = {
  sample(formatted, n) {
    return Promise.resolve({ values: formatted.data });
  },
};
