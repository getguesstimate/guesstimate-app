import * as graph from './graph';
import * as metric from './metric';
import * as sample from './sample';
import * as simulation from './simulation';
import * as guesstimate from './guesstimate';
import * as array from './array';
import * as space from './space';
import * as me from './me';

let Engine = {
  array,
  graph,
  metric,
  sample,
  simulation,
  guesstimate,
  space,
  me
};
window.engine = Engine

export default Engine;
