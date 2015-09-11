var State = require('ampersand-state');
var uuid = require('node-uuid')

export default State.extend({
    idAttribute: 'id',
    props: {
      name: 'string',
      value: 'string',
      id: 'string',
      location: 'object'
    },
    initialize () {
      this.id = uuid.v4()
    }
});
