import $ from 'jquery'
import {url, method} from 'servers/simulation-cloud/constants.js'

export const simulate = (expr, inputs, numSamples) => Promise.resolve($.ajax({
  url,
  data: JSON.stringify({
    expr,
    numSamples,
    inputs
  }),
  dataType: 'json',
  contentType: 'application/json',
  method
}))
