import _ from "lodash";
import { BASE_URL } from "lib/constants";
import * as _collections from "./collections";
import * as _facts from "./facts";
import * as _graph from "./graph";
import * as _guesstimate from "./guesstimate";
import * as _simulation from "./simulation";
import * as _userOrganizationMemberships from "./userOrganizationMemberships";
import { allPropsPresent, isPresent } from "./utils";
import { RootState } from "gModules/store";
import { Root } from "postcss";
import { ApiSpace } from "lib/guesstimate_api/resources/Models";

export type DSpace = any; // FIXME

export const spaceUrlById = (id, params = {}) => {
  if (!id) {
    return "";
  }

  const paramString = _.isEmpty(params)
    ? ""
    : `?${_.toPairs(params)
        .map((p) => p.join("="))
        .join("&")}`;
  return `/models/${id}${paramString}`;
};

export const url = ({ id }: { id: number }) => spaceUrlById(id);

export const urlWithToken = (s: ApiSpace) =>
  s.shareable_link_enabled
    ? `${BASE_URL}${url(s)}?token=${s.shareable_link_token}`
    : "";

const TOKEN_REGEX = /token=([^&]+)/;
export const extractTokenFromUrl = (url: string) =>
  TOKEN_REGEX.test(url) ? url.match(TOKEN_REGEX)?.[1] : null;

export const withGraph = (space, graph) => ({
  ...space,
  graph: subset(graph, space.id),
});

const requiredProps = (dSpace) =>
  allPropsPresent(dSpace, "organization_id")
    ? ["organization.name", "organization.fullyLoaded"]
    : ["user.name"];
export const prepared = (dSpace) =>
  allPropsPresent(dSpace, ...requiredProps(dSpace));

export function subset(
  state: Pick<RootState, "metrics" | "guesstimates">,
  ...spaceIds: number[]
) {
  const metrics = _collections.filterByInclusion(
    state.metrics,
    "space",
    spaceIds
  );
  const guesstimates = metrics
    .map(_guesstimate.getByMetricFn(state))
    .filter(isPresent);
  const simulations = guesstimates
    .map(_simulation.getByMetricFn(state))
    .filter(isPresent);
  return { metrics, guesstimates, simulations };
}

export function possibleFacts(
  { organization_id },
  { organizations }: Pick<RootState, "organizations">,
  organizationFacts
) {
  const org = _collections.get(organizations, organization_id);
  return !!org ? _facts.getFactsForOrg(organizationFacts, org) : [];
}

export function toDSpace(
  spaceId: number,
  graph: Pick<
    RootState,
    | "me"
    | "users"
    | "organizations"
    | "userOrganizationMemberships"
    | "spaces"
    | "metrics"
    | "calculators"
    | "guesstimates"
  >,
  organizationFacts
): DSpace {
  const space = _collections.get(graph.spaces, spaceId);
  if (!space) {
    return {};
  }

  let dSpace: any = { ...space, ...toDgraph(space, graph) };

  const facts = possibleFacts(dSpace, graph, organizationFacts);
  const withInputFn = _guesstimate.expressionToInputFn(dSpace.metrics, facts);

  const extractReferencedMetricsFn = (m) => {
    const allIdsReferenced = _guesstimate.extractMetricIds(m.guesstimate);
    return allIdsReferenced.filter((id) =>
      _collections.some(dSpace.metrics, id)
    );
  };
  dSpace.edges = _.flatten(
    dSpace.metrics.map((m) =>
      extractReferencedMetricsFn(m).map((id) => ({ input: id, output: m.id }))
    )
  );
  dSpace.metrics = dSpace.metrics.map((s) => {
    const inputs = dSpace.edges
      .filter((i) => i.output === s.id)
      .map((e) => e.input);
    const outputs = dSpace.edges
      .filter((i) => i.input === s.id)
      .map((e) => e.output);
    const inputMetrics = inputs.map((i) =>
      dSpace.metrics.find((m) => m.id === i)
    );
    const edges = { inputs, outputs, inputMetrics };
    return { ...s, guesstimate: withInputFn(s.guesstimate), edges };
  });

  return dSpace;
}

function toDgraph(
  space,
  graph: Pick<
    RootState,
    | "users"
    | "organizations"
    | "calculators"
    | "userOrganizationMemberships"
    | "me"
    | "metrics"
    | "guesstimates"
  >
) {
  const { users, organizations, calculators, userOrganizationMemberships, me } =
    graph;
  const { user_id, organization_id, author_contributions } = space;

  let org_users: any[] = [];

  if (!!organization_id && !_.isEmpty(author_contributions)) {
    org_users = Object.keys(author_contributions).map((author_id) => ({
      ..._collections.get(users, author_id),
      edits: author_contributions[author_id],
    }));
  } else {
    org_users = [_collections.get(users, user_id)];
  }
  org_users = org_users.filter((o) => !!o.id);

  return {
    ..._graph.denormalize(subset(graph, space.id)),
    users: org_users,
    user: _collections.get(users, user_id),
    organization: _collections.get(organizations, organization_id),
    calculators: _collections.filter(calculators, space.id, "space_id"),
    editableByMe: canEdit(space, me, userOrganizationMemberships, undefined),
  };
}

export function canEdit(
  { user_id, organization_id },
  me,
  userOrganizationMemberships,
  canvasState
) {
  // TODO(matthew): This first check is hacky. Refactor later.
  if (
    !_.isEmpty(canvasState) &&
    !!canvasState.editsAllowedManuallySet &&
    !canvasState.editsAllowed
  ) {
    return false;
  }

  const meId = _.get(me, "id");
  if (!!organization_id) {
    return _userOrganizationMemberships.isMember(
      organization_id,
      meId,
      userOrganizationMemberships
    );
  } else {
    return user_id === meId;
  }
}
