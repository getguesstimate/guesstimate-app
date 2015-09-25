export function combine(samples) {
  let errors = [].concat.apply(samples[0].errors, samples[1].errors);
  let values = [].concat.apply(samples[0].values, samples[1].values);
  return {values, errors};
}
