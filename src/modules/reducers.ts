import { __DEV__ } from "lib/constants";
import reduxCrud from "redux-crud";
import SeamlessImmutable from "seamless-immutable";
const SI = __DEV__ ? SeamlessImmutable : (a) => a;

import { AnyAction, Reducer } from "redux";
import { canvasStateR } from "./canvas_state/reducer";
import { checkpointsR } from "./checkpoints/reducer";
import { copiedR } from "./copied/reducer";
import displayErrorR from "./displayErrors/reducer";
import { factsR } from "./facts/reducer";
import firstSubscriptionsR from "./first_subscription/reducer";
import { guesstimatesR } from "./guesstimates/reducer";
import { httpRequestsR } from "./httpRequests/reducer";
import meR from "./me/reducer";
import { metricsR } from "./metrics/reducer";
import modalR from "./modal/reducer";
import { newOrganizationR } from "./newOrganization/reducer";
import { organizationsR } from "./organizations/reducer";
import searchSpacesR from "./search_spaces/reducer";
import { selectedCellR } from "./selected_cell/reducer";
import { selectedRegionR } from "./selected_region/reducer";
import simulationsR from "./simulations/reducer";
import { spacesR } from "./spaces/reducer";
import { userOrganizationInvitationsR } from "./userOrganizationInvitations/reducer";
import { usersR } from "./users/reducer";

export function changeSelect(location) {
  return { type: "CHANGE_SELECT", location };
}

type State = {
  displayError: ReturnType<typeof displayErrorR>;
  metrics: ReturnType<typeof metricsR>;
  guesstimates: ReturnType<typeof guesstimatesR>;
  selectedCell: ReturnType<typeof selectedCellR>;
  selectedRegion: ReturnType<typeof selectedRegionR>;
  simulations: ReturnType<typeof simulationsR>;
  spaces: ReturnType<typeof spacesR>;
  users: ReturnType<typeof usersR>;
  organizations: ReturnType<typeof organizationsR>;
  newOrganization: ReturnType<typeof newOrganizationR>;
  userOrganizationMemberships: any; // TODO
  userOrganizationInvitations: any; // TODO
  me: ReturnType<typeof meR>;
  canvasState: ReturnType<typeof canvasStateR>;
  searchSpaces: ReturnType<typeof searchSpacesR>;
  firstSubscription: ReturnType<typeof firstSubscriptionsR>;
  modal: ReturnType<typeof modalR>;
  copied: ReturnType<typeof copiedR>;
  checkpoints: ReturnType<typeof checkpointsR>;
  httpRequests: ReturnType<typeof httpRequestsR>;
  calculators: any[]; // TODO
  facts: ReturnType<typeof factsR>;
  factCategories: any; // TODO
};

const rootReducer: Reducer<State, AnyAction> = function app(
  state = {} as any,
  action
) {
  if (typeof window !== "undefined" && (window as any).recorder) {
    (window as any).recorder.recordReductionEvent(action);
  }

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
    userOrganizationMemberships: SI(
      reduxCrud.reducersFor("userOrganizationMemberships")(
        state.userOrganizationMemberships,
        action
      )
    ),
    userOrganizationInvitations: SI(
      userOrganizationInvitationsR(
        state.userOrganizationInvitations,
        state.userOrganizationMemberships,
        action
      )
    ),
    me: SI(meR(state.me, action)),
    canvasState: SI(canvasStateR(state.canvasState, action)),
    searchSpaces: SI(searchSpacesR(state.searchSpaces, action)),
    firstSubscription: SI(firstSubscriptionsR(state.firstSubscription, action)),
    modal: SI(modalR(state.modal, action)),
    copied: SI(copiedR(state.copied, action)),
    checkpoints: SI(checkpointsR(state.checkpoints, action)),
    httpRequests: SI(httpRequestsR(state.httpRequests, action)),
    calculators: SI(
      reduxCrud.reducersFor("calculators")(state.calculators, action)
    ),
    facts: SI(factsR(state.facts, action)),
    factCategories: SI(
      reduxCrud.reducersFor("factCategories")(state.factCategories, action)
    ),
  };
};

export default rootReducer;
