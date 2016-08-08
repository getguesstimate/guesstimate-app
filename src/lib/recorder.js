const incrementOrOne = (val) => { val = (val || 0) + 1 }
const concatOrNewList = (list, val) => { list = (list || []).concat(val) }
const getParentComponent = comp => _.get(comp, '_reactInternalInstance._currentElement._owner._instance')
function getComponentTree(component) {
  let ancestor = getParentComponent(component)
  let componentTree = []
  while (!!ancestor) {
    componentTree = [ancestor, ...componentTree]
    ancestor = getParentComponent(ancestor)
  }
  return componentTree
}
// val of the form
// { name, data, start, end, duration, children: [] }
function addAtPosition(position, list, val) {
  let container = _.isEmpty(position) ? list : getAtPosition(position, list).children
  container.push(val)
  return container.length - 1
}
function getAtPosition(position, list) {
  let el = list[position.shift()]
  while (!_.isEmpty(position)) { el = el.children[position.shift()] }
  return el
}
function gatherParentIndices(component) {
  let parentIndices = !!_.get(component, '__recorder_index__') ? [component['__recorder_index__']] : []
  let ancestor = getParentComponent(component)
  while (!!ancestor) {
    if (!!_.get(ancestor, '__recorder_index__')) { parentIndices = [ancestor['__recorder_index__'], ...parentIndices] }
    ancestor = getParentComponent(ancestor)
  }
  return parentIndices
}


export class GuesstimateRecorder {
  clearRecordings() {
    this.appStartTime = (new Date()).getTime()
    this.timeline = [{name: "Recording Started", time: this.appStartTime}]
    this.nestedTimeline = [{name: "Recording Started", start: this.appStartTime, end: this.appStartTime}]
    this.renderCounts = {}
    this.renderTimings = {}
    this.selectorCounts = {}
    this.selectorTimings = {}
    this.actionCounts = {}
    this.actionTimings = {}
  }

  constructor() {
    this.disabled = !__DEV__
    this.paused = false
    this.clearRecordings()
    this.uniqueId = 0
  }

  recordNamedEvent() {}

  recordReductionEvent(action) {
    //  if (this.disabled || this.paused) { return }
    //  this.recordNamedEvent(action.type, null, " Reducing", GuesstimateRecorder.addSingletonToNestedList, action)
    //  incrementOrOne(this.actionCounts[action.type])
  }

  recordSelectorStart(name) { } //this.recordNamedEvent(name, null, " Start", GuesstimateRecorder.addStartToNestedList) }
  recordSelectorStop(name, returned) {
    //  if (this.disabled || this.paused) { return }
    //  const fullSelector = this.recordNamedEvent(name, null, " Stop", GuesstimateRecorder.addStopToNestedList, returned)
    //  incrementOrOne(this.selectorCounts[name])
    //  concatOrNewList(this.selectorTimings[name], fullSelector.duration)
  }

  recordMountEvent(component) { }
  //  this.recordNamedEvent(`${component.constructor.name} Mount`)
  //  component['__recorder_id__'] = this.uniqueId++
  //}
  recordUnmountEvent(component) { } // this.recordNamedEvent(`${component.constructor.name} Unmount`) }
  recordRenderStartEvent(component) {
    if (this.disabled || this.paused) { return }

    const parentIndices = gatherParentIndices(component)
    const time = (new Date()).getTime() - this.appStartTime

    const element = {
      name: component.constructor.name,
      start: time,
      children: []
    }
    const positionInTimeline = addAtPosition(parentIndices, this.nestedTimeline, element)
    component['__recorder_index__'] = positionInTimeline

    return
  }
  recordRenderStopEvent(component) {
    if (this.disabled || this.paused) { return }

    const indices = gatherParentIndices(component)
    const time = (new Date()).getTime() - this.appStartTime
    let element = getAtPosition(indices, this.nestedTimeline)
    element.end = time
    element.duration = element.end - element.start
    component['__recorder_index__'] = null
  }
  pause() { this.paused = true }
  unpause() { this.paused = false }
}
