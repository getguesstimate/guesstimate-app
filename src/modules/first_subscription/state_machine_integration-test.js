import {newFlowState, subStage, actions, states} from './state_machine.js'
import firstSubscriptionReducer from './reducer.js'
import {initialState} from './reducer.js'

describe('FirstSubscriptionFlowStage', () => {
  describe('a successful flow', () => {
    it('starts in start state', () => {
      let state = firstSubscriptionReducer()
      expect(state.flowStage).to.equal('START')
      expect(subStage(state)).to.equal('START')

      state = firstSubscriptionReducer(state, {type: 'FIRST_SUBSCRIPTION_IFRAME_FETCH_START'})
      expect(state.flowStage).to.equal('FORM')
      expect(subStage(state)).to.equal('FORM_START')

      state = firstSubscriptionReducer(state, {type: 'FIRST_SUBSCRIPTION_IFRAME_FETCH_SUCCESS'})
      expect(state.flowStage).to.equal('FORM')
      expect(subStage(state)).to.equal('FORM_SUCCESS')

      state = firstSubscriptionReducer(state, {type: 'FIRST_SUBSCRIPTION_SYNCHRONIZATION_POST_START'})
      expect(state.flowStage).to.equal('SYNCHRONIZATION')
      expect(subStage(state)).to.equal('SYNCHRONIZATION_START')

      state = firstSubscriptionReducer(state, {type: 'FIRST_SUBSCRIPTION_SYNCHRONIZATION_POST_SUCCESS'})
      expect(state.flowStage).to.equal('SYNCHRONIZATION')
      expect(subStage(state)).to.equal('SYNCHRONIZATION_SUCCESS')

      state = firstSubscriptionReducer(state, {type: 'FIRST_SUBSCRIPTION_FLOW_RESET'})
      expect(state.flowStage).to.equal('UNNECESSARY')
      expect(subStage(state)).to.equal('UNNECESSARY')
    })
  });
})
