import reduxCrud from 'redux-crud'
import SeamlessImuutable from 'seamless-immutable'
const SI = __DEV__? SeamlessImuutable : (a) => a

import {selectedCellR} from './selected_cell/reducer'
import {selectedRegionR} from './selected_region/reducer'
import displayErrorR from './displayErrors/reducer'
import {metricsR} from './metrics/reducer'
import {guesstimatesR} from './guesstimates/reducer'
import simulationsR from './simulations/reducer'
import meR from './me/reducer'
import {canvasStateR} from './canvas_state/reducer'
import searchSpacesR from './search_spaces/reducer'
import firstSubscriptionsR from './first_subscription/reducer'
import modalR from './modal/reducer'
import {spacesR} from './spaces/reducer'
import {userOrganizationInvitationsR} from './userOrganizationInvitations/reducer'
import {usersR} from './users/reducer'
import {organizationsR} from './organizations/reducer'
import {copiedR} from './copied/reducer'
import {checkpointsR} from './checkpoints/reducer'
import {httpRequestsR} from './httpRequests/reducer'
import {newOrganizationR} from './newOrganization/reducer'
import {factsR} from './facts/reducer'

export function changeSelect(location) {
  return { type: 'CHANGE_SELECT', location };
}

const rootReducer = function app(state = {}, action){
  window.recorder.recordReductionEvent(action)
  return {
    displayError: SI(displayErrorR(state.displayError, action)),
    metrics: SI(metricsR(state.metrics, action)),
    guesstimates: SI(guesstimatesR(state.guesstimates, action)),
    selectedCell: SI(selectedCellR(state.selectedCell, action)),
    selectedRegion: SI(selectedRegionR(state.selectedRegion, action)),
    simulations: SI(simulationsR(state.simulations, action)),
    spaces: SI(spacesR(state.spaces, action)),
    users: SI(usersR(state.users, action)),
    organizations: SI(organizationsR(state.organizations, action)),
    newOrganization: SI(newOrganizationR(state.newOrganization, action)),
    userOrganizationMemberships: SI(reduxCrud.reducersFor('userOrganizationMemberships')(state.userOrganizationMemberships, action)),
    userOrganizationInvitations: SI(userOrganizationInvitationsR(state.userOrganizationInvitations, state.userOrganizationMemberships, action)),
    me: SI(meR(state.me, action)),
    canvasState: SI(canvasStateR(state.canvasState, action)),
    searchSpaces: SI(searchSpacesR(state.searchSpaces, action)),
    firstSubscription: SI(firstSubscriptionsR(state.firstSubscription, action)),
    modal: SI(modalR(state.modal, action)),
    copied: SI(copiedR(state.copied, action)),
    checkpoints: SI(checkpointsR(state.checkpoints, action)),
    httpRequests: SI(httpRequestsR(state.httpRequests, action)),
    calculators: SI(reduxCrud.reducersFor('calculators')(state.calculators, action)),
    facts: SI(factsR(state.facts, action)),
    factCategories: SI(reduxCrud.reducersFor('factCategories')(state.factCategories, action)),
  }
}

export default rootReducer
