import {parseNumber} from './lib.js'

const POINT_REGEX = /^\s*(\d*(?:\.\d+)?)\s?(M|B|K|T)?\s*$/

export const item = {
  formatterName: 'DISTRIBUTION_POINT_TEXT',
  errors() { return [] },
  matches({text}) { return POINT_REGEX.test(text) },
  _number(text) {
    const [_, num, suffix] = text.match(POINT_REGEX)
    return parseNumber(num, suffix)
  },
  format({text}) { return {guesstimateType: "POINT", value: this._number(text)} }
}

