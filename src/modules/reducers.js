import reduxCrud from 'redux-crud'
import SI from 'seamless-immutable';

import guesstimateFormR from './guesstimate_form/reducer'
import selectionR from './selection/reducer'
import displayErrorR from './displayErrors/reducer.js'
import metricsR from './metrics/reducer'
import guesstimatesR from './guesstimates/reducer'
import simulationsR from './simulations/reducer'
import meR from './me/reducer'
import canvasStateR from './canvas_state/reducer.js'
import spacesR from './spaces/reducer'
import searchSpacesR from './search_spaces/reducer'
import firstSubscriptionsR from './first_subscription/reducer'
import modalR from './modal/reducer'
import {copiedR} from './copied/reducer'

export function changeSelect(location) {
  return { type: 'CHANGE_SELECT', location };
}

const rootReducer = function app(state = {}, action){
  return {
    displayError: SI(displayErrorR(state.displayError, action)),
    metrics: SI(metricsR(state.metrics, action)), // Causes Infinite Loop of Immutability on /models/:id
    guesstimates: SI(guesstimatesR(state.guesstimates, action)),
    selection: SI(selectionR(state.selection, action)),
    guesstimateForm: SI(guesstimateFormR(state.guesstimateForm, state.metrics, state.guesstimates, action)),
    simulations: SI(simulationsR(state.simulations, action)),
    spaces: SI(spacesR(state.spaces, action)),
    users: SI(reduxCrud.reducersFor('users')(state.users, action)),
    organizations: SI(reduxCrud.reducersFor('organizations')(state.organizations, action)),
    userOrganizationMemberships: SI(reduxCrud.reducersFor('userOrganizationMemberships')(state.userOrganizationMemberships, action)),
    me: SI(meR(state.me, action)),
    canvasState: SI(canvasStateR(state.canvasState, action)),
    searchSpaces: SI(searchSpacesR(state.searchSpaces, action)), // Causes Infinite Loop of Immutability on /models
    firstSubscription: SI(firstSubscriptionsR(state.firstSubscription, action)),
    modal: SI(modalR(state.modal, action)),
    copied: SI(copiedR(state.copied, action)),
  }
}


export default rootReducer

