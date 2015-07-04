import Model from 'ampersand-model'

export default Model.extend({
    url: 'foobar.com',
    props: {
        name: 'string',
        data: 'hash',
    },
    session: {
        signedIn: ['boolean', true, false],
    },
    derived: {
      appUrl: {
        deps: ['name'],
        fn: function () {
            return 'repo/' + this.name;
        }
      }
    }
})
