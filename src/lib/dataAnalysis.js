// Returns the sample mean. If no samples are provided, returns 0.
export function avg(samples) {
  return samples.length > 0 ? samples.reduce((a,b) => a+b)/samples.length : 0
}

// Returns the sample standard deviation. If no samples are provided, returns 0.
export function stdev(samples) {
  const samplesSqd = samples.map(s => s*s)
  return Math.sqrt(avg(samplesSqd) - Math.pow(avg(samples), 2))
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
