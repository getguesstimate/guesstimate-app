import { Sampler } from "./Simulator";

export const sampler: Sampler = {
  sample({ params: [value] }) {
    return Promise.resolve({ values: [value] });
  },
};
