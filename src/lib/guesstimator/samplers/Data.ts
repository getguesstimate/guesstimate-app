export const Sampler = {
  sample(formatted, n) {
    return Promise.resolve({ values: formatted.data });
  },
};
