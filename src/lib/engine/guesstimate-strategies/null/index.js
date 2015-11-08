class _NullStrategy {
  constructor() { this.name = 'null' }
  isA() { return true }
  sample() { return {} }

  inputMetrics() { return [] }
}

export var NullStrategy = new _NullStrategy()
