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

