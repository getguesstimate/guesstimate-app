import Model from 'ampersand-model'

export default Model.extend({
    url: 'foobar.com',
    props: {
        name: 'string',
        data: 'hash',
        id: 'string',
    },
    derived: {
      destroy: {
        deps: [],
        fn: function() {
          this.collection.destroy(this)
        }
      },
      appUrl: {
        deps: ['name'],
        fn: function () {
            return 'repo/' + this.name;
        }
      }
    }
})
