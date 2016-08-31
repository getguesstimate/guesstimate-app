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
function appendAtPosition(position, list, val, c) {
  let container = _.isEmpty(position) ? list : getAtPosition(position, list, c).children
  container.push(val)
  return container.length - 1
}
function getAtPosition(position, list) {
  let el = list[position[0]]
  position.slice(1).forEach( coor => {el = el.children[coor] } )
  if (!el) {
    console.warn('Invalid indices detected! Crashing')
    return
  }
  return el
}
const gatherParentIndices = component => gatherIndicesFromRoot(getParentComponent(component))
function gatherIndicesFromRoot(component) {
  let indices = !!_.get(component, '__recorder_index__') ? [component['__recorder_index__']] : []
  let ancestor = getParentComponent(component)
  while (!!ancestor) {
    if (_.isFinite(_.get(ancestor, '__recorder_index__'))) { indices = [ancestor['__recorder_index__'], ...indices] }
    ancestor = getParentComponent(ancestor)
  }
  return indices
}


export class GuesstimateRecorder {
  clearRecordings() {
    this.appStartTime = (new Date()).getTime()
    this.nestedTimeline = [{name: "Recording Started", start: this.appStartTime, end: this.appStartTime}]
    this.warnings = []
    this.renderCounts = {}
    this.renderTimings = {}
    this.selectorCounts = {}
    this.selectorTimings = {}
    this.actionCounts = {}
    this.simulationDAGsBuilt = 0
    this.propagationsRun = 0
  }

  constructor() {
    this.disabled = !__DEV__
    this.paused = false
    this.verbose = false
    this.clearRecordings()
  }

  time() { return (new Date()).getTime() - this.appStartTime }
  recording() { return !(this.disabled || this.paused) }
  warn(message, rawData={}) {
    const data = Object.assign({}, rawData)
    if (this.verbose) { console.warn(message, data) }
    this.warnings.push({message, data, time: this.time()})
  }

  recordNamedEvent(name, suffix = '', data = {}, counters = null) {
    if (!this.recording()) { return }
    const element = {name: [name, suffix].filter(n => !_.isEmpty(n)).join(' '), start: this.time(), end: this.time(), duration: 0, children: [], data}
    this.nestedTimeline.push(element)
    if (!!counters) { incrementOrOne(counters[name]) }
  }

  recordSimulationDAGConstructionStart(DAG) {
    if (!this.recording()) { return }
    const element = {name: 'Building Simulation DAG', start: this.time(), children: []}
    DAG['__recorderIndex__'] = this.nestedTimeline.push(element) - 1
  }
  recordSimulationDAGConstructionStop(DAG) {
    if (!this.recording()) { return }
    let element = this.nestedTimeline[DAG['__recorderIndex__']]
    element.end = this.time()
    element.duration = element.end - element.start
    element.data = Object.assign({}, DAG)
  }

  recordPropagationStart(simulator) {
    if (!this.recording()) { return }
    const element = {name: 'Running Propagation', start: this.time(), children: []}
    simulator['__recorderIndex__'] = this.nestedTimeline.push(element) - 1
  }
  recordPropagationStop(simulator) {
    if (!this.recording()) { return }
    let element = this.nestedTimeline[simulator['__recorderIndex__']]
    element.end = this.time()
    element.duration = element.end - element.start
    element.data = Object.assign({}, simulator)
  }

  recordNodeSimulationStart(simulator, node) {
    if (!this.recording()) { return }
    let parentElement = this.nestedTimeline[simulator['__recorderIndex__']]
    const newElement = {name: `Simulating Node ${node.id}`, start: this.time(), children: []}
    node['__recordingIndices__'] = [simulator['__recorderIndex__'], parentElement.children.push(newElement) - 1]
  }
  recordNodeSimulationStop(node) {
    if (!this.recording()) { return }
    let element = getAtPosition(node['__recordingIndices__'], this.nestedTimeline)
    element.end = this.time()
    element.duration = element.end - element.start
    element.data = Object.assign({}, node)
  }
  recordNodeGetInputsStart(node) {
    if (!this.recording()) { return }
    let parentElement = getAtPosition(node['__recordingIndices__'], this.nestedTimeline)
    const newElement = {name: 'Getting Inputs', start: this.time(), children: []}
    node['__getInputsRecorderIndex__'] = parentElement.children.push(newElement) - 1
  }
  recordNodeGetInputsStop(node, inputs) {
    if (!this.recording()) { return }
    let element = getAtPosition([...node['__recordingIndices__'], node['__getInputsRecorderIndex__']], this.nestedTimeline)
    element.end = this.time()
    element.duration = element.end - element.start
    element.data = {inputs}
  }
  recordNodeSampleStart(node) {
    if (!this.recording()) { return }
    let parentElement = getAtPosition(node['__recordingIndices__'], this.nestedTimeline)
    const newElement = {name: 'Sampling', start: this.time(), children: []}
    node['__sampleRecorderIndex__'] = parentElement.children.push(newElement) - 1
  }
  recordNodeSampleStop(node) {
    if (!this.recording()) { return }
    let element = getAtPosition([...node['__recordingIndices__'], node['__sampleRecorderIndex__']], this.nestedTimeline)
    element.end = this.time()
    element.duration = element.end - element.start
  }

  recordReductionEvent(action) { this.recordNamedEvent(action.type, 'Reducing', action, this.actionCounts) }
  recordSelectorStart(name) {
    if (!this.recording()) { return }
    const start = {name, start: this.time(), children: []}
    this.nestedTimeline.push(start)
  }
  recordSelectorStop(name, returned) {
    if (!this.recording()) { return }
    let start = this.nestedTimeline.find(e => e.name === name && !e.end)
    if (!start) { this.warn('Selector start/stop unbalanced (missing start)', {name, returned}); return }
    start.end = this.time()
    start.duration = start.end - start.start
    start.data = returned
  }
  recordMountEvent(component) {
    const parentIndices = gatherParentIndices(getParentComponent(component))
    const element = {
      name: `${_.get(component, 'constructor.name')} Mount`,
      start: this.time(),
      end: this.time(),
      duration: 0,
      children: [],
    }
    appendAtPosition(parentIndices, this.nestedTimeline, element, component)
  }
  recordUnmountEvent(component) { this.recordNamedEvent(_.get(component, 'constructor.name'), 'Unmount') }

  recordRenderStartEvent(component) {
    if (!this.recording()) { return }
    if (!!_.get(component, '__recorder_index__')) { this.warn('render starting before render chain terminated', {component}) }

    const parentIndices = gatherParentIndices(component)
    const name = _.get(component, 'constructor.name')
    const element = {name, start: this.time(), children: []}

    const positionInTimeline = appendAtPosition(parentIndices, this.nestedTimeline, element, component)
    component['__recorder_index__'] = positionInTimeline

    incrementOrOne(this.renderCounts[name])
  }

  recordRenderStopEvent(component) {
    if (!this.recording()) { return }
    if (!_.get(component, '__recorder_index__')) { this.warn('render stopping before render chain initiated', {component}); return }

    const indices = gatherIndicesFromRoot(component)
    let element = getAtPosition(indices, this.nestedTimeline, component)
    element.end = this.time()
    element.duration = element.end - element.start
    component['__recorder_index__'] = null
  }

  pause() { this.paused = true }
  unpause() { this.paused = false }
  verbose() { this.verbose = true }
  noVerbose() { this.verbose = false }
}
