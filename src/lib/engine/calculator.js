import {BASE_URL} from 'lib/constants'

export function fullUrl({id}) {
  return `${BASE_URL}/calculators/${id}`
}
