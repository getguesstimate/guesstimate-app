import app from 'ampersand-app'
import Router from './router'
import * as segment from '../server/segment/index.js'
import * as sentry from '../server/sentry/index.js'
import engine from 'gEngine/engine.js'
import {setupGuesstimateApi} from 'servers/guesstimate-api/constants.js'
import './main.css'
import * as elev from 'server/elev/index.js'


import Worker from 'worker!../lib/guesstimator/samplers/simulator-worker/index.js'
window.workers = [new Worker, new Worker]

window.workers = window.workers.map(
  worker => {
    worker.queue = []
    worker.launch = (data) => { worker.postMessage(JSON.stringify(data)) }
    worker.onmessage = (event) => {
      // Remove worker from queue
      const {data, callback} = worker.queue.shift()
      // Call user callback
      callback(event)
      // Run next thing
      if (worker.queue.length > 0) { worker.launch(worker.queue[0].data) }
    }
    worker.push = (data, callback) => {
      // Add to queue
      worker.queue.push({data, callback})
      if (worker.queue.length === 1) {
        // If nothing is running, start running.
        worker.launch(data)
      }
    }
    return worker
  }
)

app.extend({
  init () {

    if (__DEV__) {
      window.Perf = require('react-addons-perf')
      window.Paused = false
      window.ClearRecordings = () => {
        window.AppStartTime = (new Date()).getTime()
        window.Timeline = [{name: "Application Start", time: window.AppStartTime}]
        window.NestedTimeline = [{name: "Application Start", time: window.AppStartTime, end: true}]
        window.RenderCounts = {}
        window.RenderTimings = {}
        window.SelectorCounts = {}
        window.SelectorTimings = {}
        window.ActionCounts = {}
        window.ActionTimings = {}
      }
      window.ClearRecordings()

      const appendSingletonToNestedList = (name, time, list) => {
        const lastElm = list[list.length - 1]
        if (list.length === 0 || !!lastElm.end) {
          list.push({name, time, end: true})
        } else {
          appendSingletonToNestedList(name, time, lastElm.children)
        }
      }
      const appendStartToNestedList = (name, time, list) => {
        const lastElm = list[list.length - 1]
        if (list.length === 0 || !!lastElm.end) {
          list.push({name, start: time, children: [], end: null})
        } else {
          appendStartToNestedList(name, time, lastElm.children)
        }
      }
      const appendStopToNestedList = (name, time, list) => {
        const lastElm = list[list.length - 1]
        if (lastElm.name === name) {
          lastElm.end = time
        } else {
          appendStopToNestedList(name, time, lastElm.children)
        }
      }

      window.RecordNamedEvent = (name, suffix = "", nestFn = appendSingletonToNestedList) => {
        if (window.Paused) { return }
        const time = (new Date()).getTime() - AppStartTime
        window.Timeline = window.Timeline.concat({name: name + suffix, time})
        nestFn(name, time, window.NestedTimeline)
      }

      window.RecordSelectorStart = (name) => {
        window.RecordNamedEvent(name, " Start", appendStartToNestedList)

        const time = (new Date()).getTime()
        window.SelectorTimings[name] = (window.SelectorTimings[name] || []).concat(time)
      }
      window.RecordSelectorStop = (name) => {
        if (window.Paused) { return }
        window.RecordNamedEvent(name, " Stop", appendStopToNestedList)

        const time = (new Date()).getTime()
        window.SelectorCounts[name] = (window.SelectorCounts[name] || 0) + 1
        window.SelectorTimings[name] = window.SelectorTimings[name].slice(0,-1).concat(time - window.SelectorTimings[name][window.SelectorTimings[name].length-1])
      }

      window.RecordMountEvent = (component) => { window.RecordNamedEvent(component.constructor.name + " Mount") }
      window.RecordUnmountEvent = (component) => { window.RecordNamedEvent(component.constructor.name + " Unmount") }
      window.RecordRenderStartEvent = (component) => {
        if (window.Paused) { return }
        const name = component.constructor.name
        window.RecordNamedEvent(name, " Render Start", appendStartToNestedList)

        const time = (new Date()).getTime()
        window.RenderTimings[name] = (window.RenderTimings[name] || []).concat(time)
      }
      window.RecordRenderStopEvent = (component) => {
        if (window.Paused) { return }
        const name = component.constructor.name
        window.RecordNamedEvent(name, " Render Stop", appendStopToNestedList)

        const time = (new Date()).getTime()
        window.RenderCounts[name] = (window.RenderCounts[name] || 0) + 1
        window.RenderTimings[name] = window.RenderTimings[name].slice(0,-1).concat(time - window.RenderTimings[name][window.RenderTimings[name].length-1])
      }
      window.PauseRecordings = () => { window.Paused = true }
      window.UnpauseRecordings = () => { window.Paused = false }
    }

    window.intercomSettings = {
      app_id: "o0trb1v9"
    };
    (function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',intercomSettings);}else{var d=document;var i=function(){i.c(arguments)};i.q=[];i.c=function(args){i.q.push(args)};w.Intercom=i;function l(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/o0trb1v9';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);}if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})()
    elev.hide()
    segment.initialize()
    sentry.initialize()
    this.router = new Router()
    this.router.history.start()
    //This just exists to help people get their api tokens
    window.get_profile = engine.me.localStorage.get
  }
})

app.init()
