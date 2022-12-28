import _ from "lodash";
import cuid from "cuid";
import { actionCreatorsFor } from "redux-crud";

import * as displayErrorsActions from "gModules/displayErrors/actions";
import * as membershipActions from "gModules/userOrganizationMemberships/actions";
import * as userOrganizationMembershipActions from "gModules/userOrganizationMemberships/actions";
import * as userOrganizationInvitationActions from "gModules/userOrganizationInvitations/actions";
import * as factActions from "gModules/facts/actions";
import { factCategoryActions } from "gModules/factCategories/actions";
import * as spaceActions from "gModules/spaces/actions";

import { orArr } from "gEngine/utils";
import { organizationReadableId } from "gEngine/organization";
import { withMissingStats } from "gEngine/facts";

import { captureApiError } from "lib/errors/index";
import { simulate } from "lib/propagation/wrapper";

import { setupGuesstimateApi } from "servers/guesstimate-api/constants";
import { AppThunk } from "gModules/store";

let oActions = actionCreatorsFor("organizations");

function api(state) {
  function getToken(state) {
    return _.get(state, "me.token");
  }
  return setupGuesstimateApi(getToken(state));
}

export function fetchById(organizationId): AppThunk {
  return (dispatch, getState) => {
    api(getState()).organizations.get(
      { organizationId },
      (err, organization) => {
        if (err) {
          dispatch(displayErrorsActions.newError());
          captureApiError("OrganizationsFetch", err, { url: "fetch" });
        } else if (organization) {
          const spaces = _.get(organization, "intermediate_spaces");
          if (!_.isEmpty(spaces)) {
            dispatch(spaceActions.fetchSuccess(spaces));
          }
          dispatch(fetchSuccess([{ ...organization, fullyLoaded: true }]));
        }
      }
    );
  };
}

const toContainerFact = (o) =>
  _.isEmpty(o.facts)
    ? {}
    : {
        variable_name: organizationReadableId(o),
        children: o.facts.map(withMissingStats),
      };

export function fetchSuccess(organizations): AppThunk {
  return (dispatch) => {
    const formatted = organizations.map((o) =>
      _.pick(o, [
        "id",
        "name",
        "picture",
        "admin_id",
        "account",
        "plan",
        "fullyLoaded",
      ])
    );

    const memberships = _.flatten(
      organizations.map((o) => orArr(o.memberships))
    );
    const invitations = _.flatten(
      organizations.map((o) => orArr(o.invitations))
    );
    const factsByOrg = organizations
      .map(toContainerFact)
      .filter((o) => !_.isEmpty(o));
    const factCategories = _.flatten(
      organizations.map((o) => orArr(o.fact_categories))
    );

    if (!_.isEmpty(memberships)) {
      dispatch(userOrganizationMembershipActions.fetchSuccess(memberships));
    }
    if (!_.isEmpty(invitations)) {
      dispatch(userOrganizationInvitationActions.fetchSuccess(invitations));
    }
    if (!_.isEmpty(factCategories)) {
      dispatch(factCategoryActions.fetchSuccess(factCategories));
    }
    if (!_.isEmpty(factsByOrg)) {
      dispatch(factActions.loadByOrg(factsByOrg));
    }

    dispatch(oActions.fetchSuccess(formatted));
  };
}

export function create({ name, plan }): AppThunk {
  return (dispatch, getState) => {
    const cid = cuid();
    let object = { id: cid, organization: { name, plan } };

    const action = oActions.createStart(object);

    api(getState()).organizations.create(object, (err, organization) => {
      if (err) {
        // TODO(matthew): Track if request errors out.
        captureApiError("OrganizationsCreate", err, {
          url: "OrganizationsCreate",
        });
      } else if (organization) {
        dispatch(oActions.createSuccess(organization, cid));
        dispatch(
          userOrganizationMembershipActions.fetchSuccess(
            organization.memberships
          )
        );
        //app.router.history.navigate('/organizations/' + value.id)
      }
    });
  };
}

// addFact adds the passed fact, with sortedValues overwritten to null, to the organization and saves it on the server.
export function addFact(organization, rawFact): AppThunk {
  return (dispatch, getState) => {
    let fact = Object.assign({}, rawFact);
    _.set(fact, "simulation.sample.sortedValues", null);

    api(getState()).organizations.addFact(
      organization,
      fact,
      (err, serverFact) => {
        if (!!serverFact) {
          dispatch(
            factActions.addToOrg(
              organizationReadableId(organization),
              serverFact
            )
          );
        }
      }
    );
  };
}

// editFact edits the passed fact, with sortedValues overwritten to null, to the organization and saves it on the server.
export function editFact(
  organization,
  rawFact,
  simulateDependentFacts = false
): AppThunk {
  return (dispatch, getState) => {
    let fact = Object.assign({}, rawFact);
    _.set(fact, "simulation.sample.sortedValues", null);

    api(getState()).organizations.editFact(
      organization,
      fact,
      (err, serverFact) => {
        if (!!serverFact) {
          dispatch(
            factActions.updateWithinOrg(
              organizationReadableId(organization),
              serverFact
            )
          );

          if (simulateDependentFacts) {
            simulate(dispatch, getState, { factId: fact.id });
          }
        }
      }
    );
  };
}

export function deleteFact(organization, fact): AppThunk {
  return (dispatch, getState) => {
    api(getState()).organizations.deleteFact(
      organization,
      fact,
      (err, serverFact) => {
        if (err) {
          captureApiError("OrganizationsFactDestroy", err, {
            url: "destroyOrganizationMember",
          });
        } else {
          dispatch(
            factActions.deleteFromOrg(
              organizationReadableId(organization),
              fact
            )
          );
        }
      }
    );
  };
}

export function addFactCategory(organization, factCategory): AppThunk {
  return (dispatch, getState) => {
    const cid = cuid();
    api(getState()).organizations.addFactCategory(
      organization,
      factCategory,
      (err, serverFactCategory) => {
        if (!!serverFactCategory) {
          dispatch(factCategoryActions.createSuccess(serverFactCategory, cid));
        }
      }
    );
  };
}

export function editFactCategory(organization, factCategory): AppThunk {
  return (dispatch, getState) => {
    dispatch(factCategoryActions.updateStart(factCategory));
    api(getState()).organizations.editFactCategory(
      organization,
      factCategory,
      (err, serverFactCategory) => {
        if (!!serverFactCategory) {
          dispatch(factCategoryActions.updateSuccess(serverFactCategory));
        }
      }
    );
  };
}

export function deleteFactCategory(organization, factCategory): AppThunk {
  return (dispatch, getState) => {
    dispatch(factCategoryActions.deleteStart(factCategory));
    api(getState()).organizations.deleteFactCategory(
      organization,
      factCategory,
      (err, _1) => {
        if (!err) {
          dispatch(factCategoryActions.deleteSuccess(factCategory));
        }
      }
    );
  };
}
