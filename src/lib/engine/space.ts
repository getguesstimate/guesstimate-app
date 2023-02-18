import { RootState } from "~/modules/store";
import { BASE_URL } from "~/lib/constants";
import { ApiSpace } from "~/lib/guesstimate_api/resources/Models";
import { ApiUser } from "~/lib/guesstimate_api/resources/Users";
import _ from "lodash";
import * as _collections from "./collections";
import * as _facts from "./facts";
import * as _graph from "./graph";
import * as _guesstimate from "./guesstimate";
import * as _simulation from "./simulation";
import * as _userOrganizationMemberships from "./userOrganizationMemberships";
import { allPropsPresent, isPresent } from "./utils";
import { DenormalizedMetric } from "./metric";
import { GuesstimateWithInput } from "~/modules/guesstimates/reducer";

export type MetricEdges = {
  inputs: string[];
  outputs: string[];
  inputMetrics: DenormalizedMetric[];
};

export type FullDenormalizedMetric = DenormalizedMetric & {
  edges: MetricEdges;
} & {
  guesstimate: GuesstimateWithInput;
};

export type DSpace = ApiSpace & {
  metrics: FullDenormalizedMetric[];
  edges: any[];
  calculators: any[];
  organization: any;
  user: ApiUser | null | undefined;
  users: any[];
  editableByMe: boolean;
};

export const spaceUrlById = (id: number | null | undefined, params = {}) => {
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
  state: Pick<RootState, "metrics" | "guesstimates" | "simulations">,
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
    | "simulations"
  >,
  organizationFacts
): DSpace {
  const space = _collections.get(graph.spaces, spaceId);
  if (!space) {
    return {} as any;
  }

  const dGraph = toDgraph(space, graph);

  const facts = possibleFacts(space, graph, organizationFacts);
  const withInputFn = _guesstimate.expressionToInputFn(dGraph.metrics, facts);

  const extractReferencedMetricsFn = (m: NonNullable<DenormalizedMetric>) => {
    const allIdsReferenced = _guesstimate.extractMetricIds(
      m.guesstimate as any
    );
    return allIdsReferenced.filter((id) =>
      _collections.some(dGraph.metrics, id)
    );
  };
  const allEdges = _.flatten(
    dGraph.metrics.map((m) =>
      extractReferencedMetricsFn(m).map((id) => ({ input: id, output: m.id }))
    )
  );
  const dSpaceMetrics: FullDenormalizedMetric[] = dGraph.metrics.map((s) => {
    const inputs = allEdges
      .filter((i) => i.output === s.id)
      .map((e) => e.input);
    const outputs = allEdges
      .filter((i) => i.input === s.id)
      .map((e) => e.output);
    const inputMetrics = inputs
      .map((i) => dGraph.metrics.find((m) => m.id === i))
      .filter((m): m is DenormalizedMetric => !!m);

    const edges = { inputs, outputs, inputMetrics };
    return { ...s, guesstimate: withInputFn(s.guesstimate), edges };
  });

  return {
    ...space,
    ...dGraph,
    edges: allEdges,
    metrics: dSpaceMetrics,
  };
}

function toDgraph(
  space: ApiSpace,
  graph: Pick<
    RootState,
    | "users"
    | "organizations"
    | "calculators"
    | "userOrganizationMemberships"
    | "me"
    | "metrics"
    | "guesstimates"
    | "simulations"
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
    const user = _collections.get(users, user_id);
    // user can be unset if it's not in users cache
    if (user) {
      org_users = [user];
    }
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
