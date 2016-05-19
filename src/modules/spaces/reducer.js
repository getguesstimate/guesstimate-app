import reduxCrud  from 'redux-crud';

const standardReducers = reduxCrud.reducersFor('spaces');

function reducers(state=[], action) {
  switch(action.type) {
    default:
      return standardReducers(state, action);
  }
}

export default reducers;
