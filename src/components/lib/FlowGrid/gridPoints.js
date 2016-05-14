let upto = (n) => Array.apply(null, {length: n}).map(Number.call, Number)

export default class GridPoint {
  constructor({rowHeights, columnWidth, padding}){
    this.rowHeights = rowHeights
    this.columnWidth = columnWidth
    this.padding = padding
  }


  _rowY(row) {
    if ((row !== undefined) && this.rowHeights){
      let rowHeights = [0, ...this.rowHeights]
      let top = upto(row+1).map(r => rowHeights[r]).reduce((a,b) => a + b)
      let bottom = top + this.rowHeights[row]
      top += this.padding
      bottom -= this.padding
      return {top, bottom}
    }
  }

  _columnX(column) {
    const {columnWidth} = this
    let left = column * columnWidth
    let right = left + columnWidth
    left += this.padding
    right -= this.padding
    return {left, right}
  }

  rectangle({row, column}) {
    return Object.assign(this._rowY(row), this._columnX(column))
  }

  region(region) {
    const input = this.rectangle(region[0])
    const output = this.rectangle(region[1])
    return {left: input.left -1, top: input.top -1, width: (output.right - input.left + 1), height: (output.bottom - input.top + 1)}
  }
}
