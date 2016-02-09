import $ from 'jquery'

export default class AbstractResource {
  constructor(api) {
    this.api = api
  }

  guesstimateRequest({url, method, params}) {
    const token = this.api.api_token
    const host = this.api.host
    const serverUrl = host + url

    return ({
      headers: { 'Authorization': 'Bearer ' + token },
      dataType: 'json',
      contentType: 'application/json',
      url: serverUrl,
      method
    })
  }

  guesstimateMethod({url, method, params}) {
    const that = this
    return function(msg, callback) {
      const params = that.guesstimateRequest({url, method, params})
      const request = $.ajax(params)
      request.done((response) => {callback(null, response)})
      request.fail((jqXHR, textStatus, errorThrown) => {callback(errorThrown, null)})
    }
  }
}
