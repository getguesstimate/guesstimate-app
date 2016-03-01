import {newFlowState, actions, states, subState} from './state_machine.js'

const defaultState = {
  flowState: 'START',
  iframe: {
    href: null,
    website_name: null,
    request: {
      waiting: false,
      error: null,
      status: 'NOT_SENT'
    }
  },
  synchronization: {
    request: {
      waiting: false,
      error: null,
      status: 'NOT_SENT'
    }
  }
}

describe('FirstSubscriptionStateMachine', () => {

  describe('#subState', () => {
    it(`in initial state`, () => {
      expect(subState(defaultState)).to.equal('START')
    });

    it(`in cancelled state`, () => {
      let newState = _.clone(defaultState)
      newState.flowState = states.cancelled
      expect(subState(newState)).to.equal('CANCELLED')
    });

    it(`in form fetching state`, () => {
      let newState = _.clone(defaultState)
      newState.flowState = 'FORM'
      newState.iframe.request = { waiting: true, error: null, status: 'START' }
      expect(subState(newState)).to.equal('FORM_START')
    });

    it(`in form success state`, () => {
      let newState = _.clone(defaultState)
      newState.flowState = 'FORM'
      newState.iframe.request = { waiting: false, error: null, status: 'SUCCESS' }
      expect(subState(newState)).to.equal('FORM_SUCCESS')
    });

    it(`in synchronization start state`, () => {
      let newState = _.clone(defaultState)
      newState.flowState = 'SYNCHRONIZATION'
      newState.synchronization.request = {waiting: true, error: null, status: 'START' }
      expect(subState(newState)).to.equal('SYNCHRONIZATION_START')
    });

    it(`in synchronization success state`, () => {
      let newState = _.clone(defaultState)
      newState.flowState = 'SYNCHRONIZATION'
      newState.synchronization.request = {waiting: true, error: null, status: 'SUCCESS' }
      expect(subState(newState)).to.equal('SYNCHRONIZATION_SUCCESS')
    });

    it(`in unnecessary state`, () => {
      let newState = _.clone(defaultState)
      newState.synchronization.request = {waiting: true, error: null, status: 'SUCCESS' }
      newState.flowState = states.unnecessary
      expect(subState(newState)).to.equal('UNNECESSARY')
    });
  });
})
