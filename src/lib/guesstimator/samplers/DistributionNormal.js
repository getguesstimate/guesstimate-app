import math from 'mathjs';
import $ from 'jquery'

export var Sampler = {
  sample({high, low}, n) {
    return new Promise(
      (resolve, reject) => {
        // This assumes a centered 90% confidence interval, e.g. the left endpoint
        // marks 0.05% on the CDF, the right 0.95%.
        const mean = math.mean(high, low)
        const stdev = (high - mean) / 1.645

        const simulation_cloud_url = "http://localhost:5000/simulate"

        $.ajax({
          url: simulation_cloud_url,
          data: JSON.stringify({
            expr: `normal(${mean},${stdev})`,
            numSamples: n
          }),
          dataType: 'json',
          contentType: 'application/json',
          method: "POST"
        }).done( json => {resolve(json)} )
      }
    )
  }
}

