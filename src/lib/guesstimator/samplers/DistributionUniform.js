import $ from 'jquery'
import {rootUrl} from 'servers/simulation-cloud/constants.js'

export var Sampler = {
  sample({low, high}, n) {
    return new Promise(
      (resolve, reject) => {
        const simulation_cloud_url = rootUrl

        $.ajax({
          url: simulation_cloud_url,
          data: JSON.stringify({
            expr: `uniform(${low},${high})`,
            numSamples: n
          }),
          dataType: 'json',
          contentType: 'application/json',
          method: "POST"
        }).done( json => {
          console.log(`Resolving in src/lib/guesstimator/samplers/DistributionUniform.js at line 19`)
          resolve(json)
        } )
      }
    )
  }
}

