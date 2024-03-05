import math from "mathjs";
import { Sampler, simulate } from "./Simulator";

export const sampler: Sampler = {
  async sample({ params: [low, high] }, n, _1) {
    // This assumes a centered 90% confidence interval, e.g. the left endpoint
    // marks 0.05% on the CDF, the right 0.95%.
    const mean = math.mean(high, low);
    const stdev = (high - mean) / 1.645;
    return simulate(`normal(${mean},${stdev})`, [], n);
  },
};
