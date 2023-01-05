import { __DEV__ } from "~/lib/constants";
import reduxCrud from "redux-crud";

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
  if (typeof window !== "undefined" && window.recorder) {
    window.recorder.recordReductionEvent(action);
  }

  return {
    displayError: displayErrorR(state.displayError, action),
    metrics: metricsR(state.metrics, action),
    guesstimates: guesstimatesR(state.guesstimates, action),
    selectedCell: selectedCellR(state.selectedCell, action),
    selectedRegion: selectedRegionR(state.selectedRegion, action),
    simulations: simulationsR(state.simulations, action),
    spaces: spacesR(state.spaces, action),
    users: usersR(state.users, action),
    organizations: organizationsR(state.organizations, action),
    newOrganization: newOrganizationR(state.newOrganization, action),
    userOrganizationMemberships: reduxCrud.List.reducersFor(
      "userOrganizationMemberships"
    )(state.userOrganizationMemberships, action),
    userOrganizationInvitations: userOrganizationInvitationsR(
      state.userOrganizationInvitations,
      state.userOrganizationMemberships,
      action
    ),
    me: meR(state.me, action),
    canvasState: canvasStateR(state.canvasState, action),
    searchSpaces: searchSpacesR(state.searchSpaces, action),
    firstSubscription: firstSubscriptionsR(state.firstSubscription, action),
    modal: modalR(state.modal, action),
    copied: copiedR(state.copied, action),
    checkpoints: checkpointsR(state.checkpoints, action),
    httpRequests: httpRequestsR(state.httpRequests, action),
    calculators: reduxCrud.List.reducersFor("calculators")(
      state.calculators,
      action
    ),
    facts: factsR(state.facts, action),
    factCategories: reduxCrud.List.reducersFor("factCategories")(
      state.factCategories,
      action
    ),
  };
};

export default rootReducer;
