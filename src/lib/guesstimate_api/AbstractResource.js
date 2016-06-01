import $ from 'jquery'

export default class AbstractResource {
  constructor(api) {
    this.api = api
  }

  guesstimateRequest({url, method, data}) {
    const token = this.api.api_token
    const host = this.api.host
    const serverUrl = host + url

    let requestParams = {
      headers: { 'Authorization': 'Bearer ' + token },
      dataType: 'json',
      contentType: 'application/json',
      url: serverUrl,
      method
    }
    if (data) { requestParams.data = JSON.stringify(data) }

    return requestParams
  }

  guesstimateMethod({url, method, data}) {
    return (callback) => {
      const params = this.guesstimateRequest({url, method, data})
      const request = $.ajax(params)
      request.done((response) => {callback(null, response)})
      request.fail((jqXHR, textStatus, errorThrown) => {callback({jqXHR, textStatus, errorThrown}, null)})
    }
  }
}
