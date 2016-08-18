import {BASE_URL} from 'lib/constants'

export const relativePath = ({id}) => `/calculators/${id}`
export const fullUrl = ({id}) => `${BASE_URL}${relativePath({id})}`
