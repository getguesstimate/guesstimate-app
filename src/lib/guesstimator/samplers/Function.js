import $ from 'jquery'
import {rootUrl} from 'servers/simulation-cloud/constants.js'

export var Sampler = {
  sample({text}, n, inputs) {
    return new Promise(
      (resolve, reject) => {
        const simulation_cloud_url = rootUrl

        $.ajax({
          url: simulation_cloud_url,
          data: JSON.stringify({
            expr: text,
            numSamples: n,
            inputs: inputs
          }),
          dataType: 'json',
          contentType: 'application/json',
          method: "POST"
        }).done( json => {
          console.log(`Resolving in src/lib/guesstimator/samplers/Function.js at line 20`)
          resolve(json)
        })
      }
    )
  }
}
