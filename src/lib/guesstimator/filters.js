// 105 -> 3
const orderOfMagnitude = (n) => {
  return Math.floor(Math.log(n) / Math.LN10 + 0.000000001)
}

const roundDown = (number, decimals) => {
    decimals = decimals || 0;
    return ( Math.floor( number * Math.pow(10, decimals) ) / Math.pow(10, decimals) );
}

export function withPrecision(sample, precision) {
  const precisionMagnitude = orderOfMagnitude(precision) * -1
  const newSample = sample.map(s => {return roundDown(s, precisionMagnitude)})
  return newSample
}


export function inRange(sample, filters) {
  let newSample = sample
  if (_.isFinite(filters.max)){
    newSample = newSample.filter(s => {return s < filters.max})
  }
  if (_.isFinite(filters.min)){
    newSample = newSample.filter(s => {return s > filters.min})
  }
  return newSample
}

