import { Sampler } from "./Simulator";

export const sampler: Sampler = {
  async sample(formatted, n) {
    return { values: formatted.data };
  },
};
