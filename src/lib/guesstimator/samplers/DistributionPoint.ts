import { Sampler } from "./Simulator";

export const sampler: Sampler = {
  async sample({ params: [value] }) {
    return { values: [value] };
  },
};
