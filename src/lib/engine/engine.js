import * as graph from './graph'
import * as dgraph from './dgraph'
import * as metric from './metric'
import * as sample from './sample'
import * as simulation from './simulation'
import * as guesstimate from './guesstimate'
import * as array from './array'
import * as space from './space'
import * as me from './me'
import * as user from './user'
import * as organization from './organization'
import * as userOrganizationMemberships from './userOrganizationMemberships'
import * as calculator from './calculator'

const Engine = {
  array,
  graph,
  dgraph,
  metric,
  sample,
  simulation,
  guesstimate,
  space,
  me,
  user,
  organization,
  userOrganizationMemberships,
  calculator,
}

window.engine = Engine

export default Engine
