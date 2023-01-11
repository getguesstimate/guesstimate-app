import { Sampler } from "./Simulator";

export const sampler: Sampler = {
  sample(formatted) {
    return Promise.resolve({ values: [], errors: [] });
  },
};
