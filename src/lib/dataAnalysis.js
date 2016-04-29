// Returns a sorted (desc) copy of the samples.
export function sortDescending(samples) {
  return samples.sort((a,b) => a-b)
}

// Returns the sample mean. If no samples are provided, returns 0.
export function sampleMean(samples) {
  return samples.length > 0 ? samples.reduce((a,b) => a+b)/samples.length : 0
}

// Returns the sample standard deviation. If no samples are provided, returns 0.
export function sampleStdev(samples) {
  const samplesSqd = samples.map(s => s*s)
  return Math.sqrt(sampleMean(samplesSqd) - Math.pow(sampleMean(samples), 2))
}

// Returns the cutoff value of the specified percentile, considering the samples array to be 'length' long.
export function percentile(samples, length, percentage) {
  return samples[Math.floor(length * (percentage/100))]
}

// Returns the first index before length whose value is greater than the supplied cutoff. Else returns -1.
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
