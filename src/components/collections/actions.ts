import { api } from "~/lib/guesstimate_api";
import { ApiSpace } from "~/lib/guesstimate_api/resources/Models";
import { ApiUser } from "~/lib/guesstimate_api/resources/Users";
import { AppThunk } from "~/modules/store";
import * as spaces from "~/modules/spaces/actions";
import * as users from "~/modules/users/actions";
import * as organizations from "~/modules/organizations/actions";

export function loadUserCollection(
  userId: number
): AppThunk<Promise<{ user: ApiUser; models: ApiSpace[] }>> {
  return async (dispatch, getState) => {
    const client = api(getState());
    const [user, models] = await Promise.all([
      client.users.get({ userId }),
      client.models.list({ userId }),
    ]);
    dispatch(users.fetchSuccess([user]));
    dispatch(spaces.fromSearch(models.items));
    return { user, models: models.items };
  };
}
export function loadOrganizationCollection(
  organizationId: number
): AppThunk<Promise<void>> {
  return async (dispatch, getState) => {
    const client = api(getState());
    const [organization, models] = await Promise.all([
      new Promise<any>((resolve, reject) =>
        client.organizations.get({ organizationId }, (error, result) =>
          error || !result?.id
            ? reject(error || new Error("Organization not found"))
            : resolve(result)
        )
      ),
      client.models.list({ organizationId }),
    ]);
    dispatch(
      organizations.fetchSuccess([{ ...organization, fullyLoaded: true }])
    );
    dispatch(spaces.fromSearch(models.items));
    dispatch(
      users.fetchSuccess(
        models.items
          .map((model) => model._embedded?.user)
          .filter((user): user is ApiUser => !!user)
      )
    );
  };
}

export function loadMyOrganizations(
  userId: number
): AppThunk<Promise<{ id: number; name: string; picture?: string }[]>> {
  return async (_dispatch, getState) => {
    const data = await api(getState()).users.getMemberships({ userId });
    const organizations = (data.items || []).flatMap((membership) =>
      membership._embedded?.organization
        ? [membership._embedded.organization]
        : []
    );
    return Array.from(
      new Map(
        organizations.map((organization) => [organization.id, organization])
      ).values()
    ).sort((a, b) => a.name.localeCompare(b.name));
  };
}
