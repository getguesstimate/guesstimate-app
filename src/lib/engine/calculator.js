import {BASE_URL} from 'lib/constants'

export function fullUrl({id}) {
  return `${BASE_URL}${relativePath({id})}`
}

export function relativePath({id}) {
  return `/calculators/${id}`
}
