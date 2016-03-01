import {newFlowState, actions, states} from './state_machine.js'

const expectedStateChanges = {}

expectedStateChanges[states.unnecessary] = [
  {action: actions.unnecessary, newState: states.unnecessary},
  {action: actions.start, newState: states.unnecessary},
  {action: actions.cancel, newState: states.unnecessary},
]

expectedStateChanges[states.start] = [
  {action: actions.unnecessary, newState: states.unnecessary},
  {action: actions.formFetchStart, newState: states.form},
  {action: actions.cancel, newState: states.start},
]

expectedStateChanges[states.cancelled] = [
  {action: actions.cancel, newState: states.cancelled},
  {action: actions.reset, newState: states.start},
]

expectedStateChanges[states.form] = [
  {action: actions.synchronizationPostStart, newState: states.synchronization},
  {action: actions.reset, newState: states.start},
  {action: actions.cancel, newState: states.cancelled},
]

expectedStateChanges[states.synchronization] = [
  {action: actions.reset, newState: states.uneccessary},
]

describe('FirstSubscriptionStateMachine', () => {

  describe('#newFlowState', () => {
    _.keys(states).map(state => {
      const stateName = states[state]
      const changes = expectedStateChanges[stateName]
      changes.map(change => {
        it(`state ${stateName} and action ${change.action} go to ${change.newState}`, () => {
          expect(newFlowState(stateName, change.action)).to.equal(change.newState)
        })
      })
    })
  });
})
