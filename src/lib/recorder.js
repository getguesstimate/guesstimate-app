const incrementOrOne = (val) => { val = (val || 0) + 1 }
const concatOrNewList = (list, val) => { list = (list || []).concat(val) }
const getParentComponent = comp => _.get(comp, '_reactInternalInstance._currentElement._owner')
// val of the form
// { name, data, start, end, duration, children: [] }
function addAtPosition(position, list, val) {
  const list = getChildrenAtPosition(position, list)
  parent.children.push(val)
  return parent.children.length - 1
}
function getAtPosition(position, list) {
  let el = list[position.shift()]
  while (!_.isEmpty(position)) { el = el.children[position.shift()] }
  return el
}
function getChildrenAtPosition(position, list) {
  if (_.isEmpty(position)) { return list }
  return getAtPosition(position, list).children}
}

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
    this.paused = true
    this.clearRecordings()
    this.uniqueId = 0
  }

  static gatherParentIndices(component) {
    let parentIndices = _.has(component, '__recorder_index__') ? [component['__recorder_index__']] : []
    let ancestor = getParentComponent(component)
    while (!!ancestor) {
      if (_.has(ancestor, '__recorder_index__')) { parentIndices = [ancestor['__recorder_index__'], ...parentIndices] }
      ancestor = getParentComponent(ancestor)
    }
    return parentIndices
  }

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
      time,
      children: []
    }
    component['__recorder_index__'] = addAtPosition(parentIndices, this.nestedTimeline, element)
  }
  recordRenderStopEvent(component) {
    if (this.disabled || this.paused) { return }
    const parentIndices = gatherParentIndices(component)
    const time = (new Date()).getTime() - this.appStartTime
  }
  pause() { this.paused = true }
  unpause() { this.paused = false }
}
