export function combine(samples) {
  const useableSamples = samples.filter(e => e)
  const errors = [].concat.apply([], useableSamples.map(s => s.errors)).filter(s => s);
  const values = [].concat.apply([], useableSamples.map(s => s.values)).filter(s => s);
  return {errors, values};
}
