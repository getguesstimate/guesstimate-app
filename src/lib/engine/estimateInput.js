function isPoint(input) {
 return parseFloat(input.toString()).toString() === input
}

export function toDistribution(input){
  const splitNumbersAt = (symbol) => { return input.split(symbol).map((e) => parseFloat(e.trim())); }

  const splitMeanAt = (symbol) => {
    let [mean, stdev] = splitNumbersAt(symbol)
    return {mean, stdev}
  }

  if (input.includes('/')){
    return splitMeanAt('/')

  } else if (input.includes('+-')){
    return splitMeanAt('+-')

  } else if (input.includes('-+')){
    return splitMeanAt('-+')

  } else if (input.includes('->')){
    let [low, high] = splitNumbersAt('->')

    if (high > low){
      let mean = low + ((high - low) / 2);
      let stdev = (high-mean);
      return {mean: parseFloat(mean), stdev: parseFloat(mean)};

    } else {
      return {mean: null, stdev:null, errors: ['Estimate: [low]->[high]: High must be greater than low. ']};
    }

  } else if (isPoint(input)){
    return {value: parseFloat(input), stdev: 0};

  } else if (input == ''){
    return {mean: null, stdev: null};

  } else {
    return {mean: null, stdev:0, errors: ['Estimate: Could not parse. Use "/" or "->" symbols.']};
  }
}
