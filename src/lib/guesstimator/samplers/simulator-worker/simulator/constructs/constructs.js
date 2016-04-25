const scenarios = (values, inputProbabilities) => {
  const total = _.sum(inputProbabilities)
  const probabilities = inputProbabilities.map(e => e/total)

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
  scenarios: scenarios,
}
