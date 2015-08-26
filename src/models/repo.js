import Model from 'ampersand-model'

export default Model.extend({
    url: 'foobar.com',
    props: {
        name: 'string',
        data: 'hash',
        description: 'string',
        id: 'string',
    },
    derived: {
      destroy: {
        deps: [],
        fn: function() {
          this.collection.destroy(this)
        }
      },
      update: {
        deps: [],
        fn: function() {
        }
      },
      appUrl: {
        deps: ['name'],
        fn: function () {
            return '/repo/' + this.name;
        }
      }
    },
    updateData: function(data) {
      this.data = data
      app.firebase.child('repos').child(this.id).set({name: this.name, description:this.description, data: data})
    }
})
