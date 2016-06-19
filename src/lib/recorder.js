const incrementOrOne = (val) => { val = (val || 0) + 1 }
const concatOrNewList = (list, val) => { list = (list || []).concat(val) }

export class GuesstimateRecorder {
  clearRecordings() {
    this.appStartTime = (new Date()).getTime()
    this.timeline = [{name: "Recording Started", time: this.appStartTime}]
    this.nestedTimeline = [{name: "Recording Started", time: this.appStartTime, end: true}]
    this.renderCounts = {}
    this.renderTimings = {}
    this.selectorCounts = {}
    this.selectorTimings = {}
    this.actionCounts = {}
    this.actionTimings = {}
  }

  constructor() {
    this.disabled = !__DEV__
    this.paused = false // TODO(matthew): change back.
    this.clearRecordings()
    this.uniqueId = 0
  }

  static addSingletonToNestedList(name, id, time, data, list) {
    const lastElm = list[list.length - 1]
    if (list.length === 0 || !!lastElm.end) {
      list.push({name, id, time, data, end: true})
    } else {
      GuesstimateRecorder.addSingletonToNestedList(name, id, time, data, lastElm.children)
    }
  }
  static addStartToNestedList(name, id, time, data, list) {
    const lastElm = list[list.length - 1]
    if (list.length === 0 || !!lastElm.end) {
      list.push({name, id, start: time, children: [], data, end: null})
    } else {
      GuesstimateRecorder.addStartToNestedList(name, id, time, data, lastElm.children)
    }
  }
  static addStopToNestedList(name, id, time, data, list) {
    // TODO(matthew): Examine all children (async).
    if (!list) {
      console.warn("Failed to close timing for ", name, " at ", time)
      return {duration: null}
    }
    const lastElm = list[list.length - 1]
    if (lastElm.id === id) {
      lastElm.end = time
      lastElm.data = data
      lastElm.duration = lastElm.end - lastElm.start
      return lastElm
    } else {
      return GuesstimateRecorder.addStopToNestedList(name, id, time, data, lastElm.children)
    }
  }

  recordNamedEvent(name, id, suffix = "", nestFn = GuesstimateRecorder.addSingletonToNestedList, data={}) {
    if (this.disabled || this.paused) { return }
    const time = (new Date()).getTime() - this.appStartTime
    this.timeline = this.timeline.concat({name: `${name} ${suffix}`, id, time, data})
    return nestFn(name, id, time, data, this.nestedTimeline)
  }

  recordReductionEvent(action) {
    if (this.disabled || this.paused) { return }
    this.recordNamedEvent(action.type, null, " Reducing", GuesstimateRecorder.addSingletonToNestedList, action)
    incrementOrOne(this.actionCounts[action.type])
  }

  recordSelectorStart(name) { this.recordNamedEvent(name, null, " Start", GuesstimateRecorder.addStartToNestedList) }
  recordSelectorStop(name, returned) {
    if (this.disabled || this.paused) { return }
    const fullSelector = this.recordNamedEvent(name, null, " Stop", GuesstimateRecorder.addStopToNestedList, returned)
    incrementOrOne(this.selectorCounts[name])
    concatOrNewList(this.selectorTimings[name], fullSelector.duration)
  }

  recordMountEvent(component) {
    this.recordNamedEvent(`${component.constructor.name} Mount`)
    component['__recorder_id__'] = this.uniqueId++
  }
  recordUnmountEvent(component) { this.recordNamedEvent(`${component.constructor.name} Unmount`) }
  recordRenderStartEvent(component) {
    this.recordNamedEvent(component.constructor.name, component['__recorder_id__'], " Render Start", GuesstimateRecorder.addStartToNestedList)
  }
  recordRenderStopEvent(component) {
    if (this.disabled || this.paused) { return }
    const name = component.constructor.name
    const fullRender = this.recordNamedEvent(name, component['__recorder_id__'], " Render Stop", GuesstimateRecorder.addStopToNestedList)
    incrementOrOne(this.renderCounts[name])
    concatOrNewList(this.renderTimings[name], fullRender.duration)
  }
  pause() { this.paused = true }
  unpause() { this.paused = false }
}
