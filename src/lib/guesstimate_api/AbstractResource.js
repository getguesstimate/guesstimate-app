import $ from 'jquery'

export default class AbstractResource {
  constructor(api) {
    this.api = api
  }

  guesstimateRequest({url, method, data, headers}) {
    const token = this.api.api_token
    const host = this.api.host
    const serverUrl = host + url

    // const allHeaders = { 'Authorization': 'Bearer ' + "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2d1ZXNzdGltYXRlLWRldmVsb3BtZW50LmF1dGgwLmNvbS8iLCJzdWIiOiJnaXRodWJ8Mzc3MDY1IiwiYXVkIjoiWDBtMlBaRXlBT3FodExZMVF6OW1kZXRIelFjRHNHOFUiLCJpYXQiOjE1MzA2MDEwODIsImV4cCI6MTUzMDYzNzA4MiwiYXRfaGFzaCI6InNrOG1EejZEQXQxdHV4Z1pUb1ktSUEiLCJub25jZSI6IktFYlpKWTFkfmRvRVAxd3lJOXE5WEZMU0NOWG96cVEwIn0.myff4FcjOCMQzevTyCqukIn-DIe9nUwOeU2A-3c1IbI", ...headers }
    const allHeaders = { 'Authorization': 'Bearer ' + token, ...headers }
    let requestParams = {
      headers: allHeaders,
      dataType: 'json',
      contentType: 'application/json',
      url: serverUrl,
      method
    }
    if (data) { requestParams.data = JSON.stringify(data) }

    return requestParams
  }

  guesstimateMethod({url, method, data, headers}) {
    return (callback) => {
      const params = this.guesstimateRequest({url, method, data, headers})
      const request = $.ajax(params)
      request.done((response) => {callback(null, response)})
      request.fail((jqXHR, textStatus, errorThrown) => {callback({jqXHR, textStatus, errorThrown}, null)})
    }
  }
}
