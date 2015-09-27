export function combine(samples) {
  let errors = [].concat.apply([], samples.map(s => s.errors));
  let values = [].concat.apply([], samples.map(s => s.values));
  return {values};
}
