export function combine(samples) {
  const useableSamples = samples.filter(e => e)
  const errors = [].concat.apply([], useableSamples.map(s => s.errors));
  const values = [].concat.apply([], useableSamples.map(s => s.values));
  return {errors, values};
}
