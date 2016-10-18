function nextDistinctValueSearch(sortedValues, start, end) {
  if (sortedValues[start] === sortedValues[end]) { return -1 }

  while (start !== end - 1) {
    const index = Math.floor((end + start)/2)
    if (sortedValues[start] === sortedValues[index]) {
      start = index
    } else {
      end = index
    }
  }
  return end
}

/* Returns the number of distinct values in the list of sorted samples. If cutoff is specified, the function will
 * terminate early if more than cutoff values are detected (as a performance optimization).
 */
export function numDistinctValues(sortedValues, cutoff = Infinity) {
  if (_.isEmpty(sortedValues)) { return 0 }

  let numDistinctValues = 0
  let index = 0

  while (index !== -1) {
    numDistinctValues++
    index = nextDistinctValueSearch(sortedValues, index, sortedValues.length)
    if (numDistinctValues >= cutoff) { break }
  }

  return numDistinctValues
}

// Returns a sorted (desc) copy of the samples.
export function sortDescending(samples) {
  return Object.assign([], samples).sort((a,b) => a-b)
}

// Returns the sample mean. If no samples are provided, returns 0. Sample can be unsorted.
export function sampleMean(samples) {
  return samples.length > 0 ? samples.reduce((a,b) => a+b)/samples.length : 0
}

// Returns the sample standard deviation. If no samples are provided, returns 0. Sample can be unsorted.
// TODO(matthew): Don't copy array, just compute both means in one reduction.
export function sampleStdev(samples) {
  const samplesSqd = samples.map(s => s*s)
  return Math.sqrt(sampleMean(samplesSqd) - Math.pow(sampleMean(samples), 2))
}

// Returns the cutoff value of the specified percentile, considering the samples array to be 'length' long.
// samples must be sorted.
export function percentile(samples, length, percentage) {
  return samples[Math.floor(length * (percentage/100))]
}

// Returns the first index before length whose value is greater than the supplied cutoff. Else returns -1.
// TODO(matthew): Make binary search.
export function cutoff(samples, length, value) {
  let index = -1
  for (var i = 0; i < length; i++) {
    if (samples[i] > value) {
      index = i
      break
    }
  }
  return index
}
