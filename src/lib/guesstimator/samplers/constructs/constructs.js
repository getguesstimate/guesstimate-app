const options = (values, probabilities) => {
  const bound = Math.min(values.length, probabilities.length)
  const testStat = Math.random()

  let running = 0;
  for (var i = 0; i < bound; i++) {
    running += probabilities[i]
    if (testStat < running) {
      return values[i]
    }
  }

  return Math.Nan
}

export const ImpureConstructs = {
  options: (values, probabilities) => options(values.toArray(), probabilities.toArray()),
}
