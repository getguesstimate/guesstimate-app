import { configureStore } from "~/modules/store";
import { api } from "~/lib/guesstimate_api";
import { destroy, fetchSuccess } from "./actions";
jest.mock("~/lib/guesstimate_api", () => ({ api: jest.fn() }));
it("removes a membership even when it has no invitation record", () => {
  const store = configureStore();
  store.dispatch(fetchSuccess([{ id: 2, user_id: 8, organization_id: 9 }]));
  (api as jest.Mock).mockReturnValue({
    userOrganizationMemberships: {
      destroy: (_: unknown, callback: Function) => callback(null, {}),
    },
  });
  store.dispatch(destroy(2));
  expect(store.getState().userOrganizationMemberships).toEqual([]);
});
