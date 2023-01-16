import { combineReducers } from "redux";

import { calculatorsR } from "./calculators/reducer";
import { canvasStateR } from "./canvas_state/reducer";
import { checkpointsR } from "./checkpoints/reducer";
import { copiedR } from "./copied/reducer";
import { displayErrorR } from "./displayErrors/reducer";
import { factCategoriesR } from "./factCategories/reducer";
import { factsR } from "./facts/reducer";
import { firstSubscriptionsR } from "./first_subscription/reducer";
import { guesstimatesR } from "./guesstimates/reducer";
import { httpRequestsR } from "./httpRequests/reducer";
import { meR } from "./me/reducer";
import { metricsR } from "./metrics/reducer";
import { modalR } from "./modal/reducer";
import { newOrganizationR } from "./newOrganization/reducer";
import { organizationsR } from "./organizations/reducer";
import { searchSpacesR } from "./search_spaces/reducer";
import { selectedCellR } from "./selected_cell/reducer";
import { selectedRegionR } from "./selected_region/reducer";
import { simulationsR } from "./simulations/reducer";
import { spacesR } from "./spaces/reducer";
import { userOrganizationInvitationsR } from "./userOrganizationInvitations/reducer";
import { userOrganizationMembershipsR } from "./userOrganizationMemberships/reducer";
import { usersR } from "./users/reducer";

export const rootReducer = combineReducers({
  displayError: displayErrorR,
  metrics: metricsR,
  guesstimates: guesstimatesR,
  selectedCell: selectedCellR,
  selectedRegion: selectedRegionR,
  simulations: simulationsR,
  spaces: spacesR,
  users: usersR,
  organizations: organizationsR,
  newOrganization: newOrganizationR,
  userOrganizationMemberships: userOrganizationMembershipsR,
  userOrganizationInvitations: userOrganizationInvitationsR,
  me: meR,
  canvasState: canvasStateR,
  searchSpaces: searchSpacesR,
  firstSubscription: firstSubscriptionsR,
  modal: modalR,
  copied: copiedR,
  checkpoints: checkpointsR,
  httpRequests: httpRequestsR,
  calculators: calculatorsR,
  facts: factsR,
  factCategories: factCategoriesR,
});
