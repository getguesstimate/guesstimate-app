var d3 = require("d3")

// Computes the average of an array of numbers. If the array is empty, returns 1.
function avg(arr) {
  return arr.length > 0 ? arr.reduce((a,b)=>a+b)/arr.length : 1
}

// Computes (min(|a|,|b|)+100)/(max(|a|,|b|)+100). We add 100 to both numerator and denominator to ensure that small
// numbers don't disproprortionately affect results.
function shiftedRatio(a,b) {
  return (Math.min(Math.abs(a),Math.abs(b))+100)/(Math.max(Math.abs(a),Math.abs(b))+100)
}

// filterLowDensityPoints removes points that occur in only low density regions of the histogram, to ensure that only
// points robustly well sampled in the data affect the visualization of the histogram.
// The parameter 'cutOffRatio' controls how hight te point density must be for points to be kept; a cutOffRatio of 0
// would keep everything, a cutOffratio of 1.0 would keep nothing.
// Values that seem to have notable affects are typically > 0.95.
function filterLowDensityPoints(inputData, cutOffRatio) {
  // We can't filter that intelligently for small sample sets, so we don't bother.
  if (inputData.length < 2000) {
    return inputData
  }

  let outputData = Object.assign([], inputData) // A copy for immutability
  outputData.sort((a,b) => a-b) // Sort the data from min -> max.

  const bucketSize = outputData.length / 1000 // Grab data in 0.1% chunks.

  // Filter Left
  // First we grab the first and second buckets from the left side.
  let left = outputData.slice(0,bucketSize)
  let right = outputData.slice(bucketSize,2*bucketSize)
  // As long as the ratio of the magnitude of their averages is less than the cutOffRatio, we keep discarding the left
  // endpoint and iterating along the array.
  while (shiftedRatio(avg(left),avg(right)) < cutOffRatio) {
    outputData = outputData.slice(bucketSize)
    left = outputData.slice(0,bucketSize)
    right = outputData.slice(bucketSize,2*bucketSize)
  }

  // Filter Right, analogous to how we filter the left, but in reverse.
  left = outputData.slice(-2*bucketSize,-bucketSize)
  right = outputData.slice(-bucketSize)
  while (shiftedRatio(avg(left),avg(right)) < cutOffRatio) {
    outputData = outputData.slice(0,-bucketSize)
    left = outputData.slice(-2*bucketSize,-bucketSize)
    right = outputData.slice(-bucketSize)
  }

  return outputData
}

function getYScale(data, height) {
  return d3.scale.linear().
    domain([0, d3.max(data, (d) => d.y)]).
    range([height, 0]);
}

function getXScale(data, width) {
  return d3.scale.linear().
    domain(d3.extent(data)).
    range([0, width]).
    nice();
}

onmessage = event => {
  var data = event.data

  let errors = []
  if (!data) {
    errors.push("data required")
    postMessage(JSON.stringify({errors}))
    return
  }

  data = JSON.parse(data)
  console.log(data)

  if (!data.samples) {
    errors.push("data.samples required")
  }
  if (!data.bins) {
    errors.push("data.bins required")
  }
  if (!data.cutOffRatio) {
    errors.push("data.cutOffRatio required")
  }
  if (!data.width) {
    errors.push("data.width required")
  }
  if (!data.height) {
    errors.push("data.height required")
  }

  if (errors.length > 0) {
    console.log('terminating with errors')
    postMessage(JSON.stringify({errors: errors}))
    return
  }
  console.log('continuing')

  const filtered_samples = filterLowDensityPoints(data.samples, data.cutOffRatio)
  console.log('continuing')

  const xScale = getXScale(filtered_samples, data.width);
  console.log('continuing')
  const histogramDataFn = d3.layout.histogram().bins(xScale.ticks(data.bins));
  console.log('continuing')
  const histogramData = histogramDataFn(filtered_samples);
  console.log('continuing')
  const yScale = getYScale(histogramData, data.height);

  console.log('continuing')
  let barWidth = data.width/histogramData.length;

  console.log("Histogram data terminating.")
  console.log(xScale)
  console.log(yScale)
  postMessage(JSON.stringify({histogramData, xScale, yScale, barWidth}))
}
