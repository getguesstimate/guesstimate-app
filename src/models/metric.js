import AmpersandState from 'ampersand-state'

let validName = (name) => { return name.length >= 3; };

export default AmpersandState.extend({
  props: {
    id: 'string',
    name: ['string', true],
    location: {
      row: 'number',
      column: 'number'
    }
  },
  derived: {
    valid: {
      deps: ['name'],
      fn: function() {
        return this.validate();
      }
    },
    readableId: {
      deps: ['id'],
      fn: function() {
        return this.id.substring(0,3).toUpperCase();
      }
    }
  },
  toStore: function() {
    return this.getAttributes({props: true, derived: true});
  },
  validate: function() {
    return validName(this.name);
  }
});
