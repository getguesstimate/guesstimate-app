import reduxCrud from 'redux-crud'

import guesstimateFormR from './guesstimate_form/reducer'
import {selectedCellR} from './selected_cell/reducer'
import {selectedRegionR} from './selected_region/reducer'
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
    displayError: displayErrorR(state.displayError, action),
    metrics: metricsR(state.metrics, action),
    guesstimates: guesstimatesR(state.guesstimates, action),
    selectedCell: selectedCellR(state.selectedCell, action),
    selectedRegion: selectedRegionR(state.selectedRegion, action),
    guesstimateForm: guesstimateFormR(state.guesstimateForm, state.metrics, state.guesstimates, action),
    simulations: simulationsR(state.simulations, action),
    spaces: spacesR(state.spaces, action),
    users: reduxCrud.reducersFor('users')(state.users, action),
    organizations: reduxCrud.reducersFor('organizations')(state.organizations, action),
    userOrganizationMemberships: reduxCrud.reducersFor('userOrganizationMemberships')(state.userOrganizationMemberships, action),
    me: meR(state.me, action),
    canvasState: canvasStateR(state.canvasState, action),
    searchSpaces: searchSpacesR(state.searchSpaces, action),
    firstSubscription: firstSubscriptionsR(state.firstSubscription, action),
    modal: modalR(state.modal, action),
    copied: copiedR(state.copied, action),
  }
}


export default rootReducer

