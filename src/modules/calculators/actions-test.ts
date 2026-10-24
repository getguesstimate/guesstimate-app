import { configureStore } from "~/modules/store";
import { api } from "~/lib/guesstimate_api";
import { create, update, destroy, sActions } from "./actions";
jest.mock("~/lib/guesstimate_api", () => ({ api: jest.fn() }));
const calculator = {
  id: 55,
  space_id: 999,
  title: "Revenue",
  content: "",
  input_ids: ["a"],
  output_ids: ["b"],
};
it("cleans up a failed creation and lets the same draft be retried", async () => {
  const store = configureStore();
  const request = jest
    .fn()
    .mockRejectedValueOnce(new Error("offline"))
    .mockResolvedValueOnce(calculator);
  (api as jest.Mock).mockReturnValue({ calculators: { create: request } });
  const saved = jest.fn();
  await expect(store.dispatch(create(999, calculator, saved))).rejects.toThrow(
    "offline"
  );
  expect(store.getState().calculators).toHaveLength(0);
  await store.dispatch(create(999, calculator, saved));
  expect(store.getState().calculators).toHaveLength(1);
  expect(saved).toHaveBeenCalledWith(calculator);
});
it("restores the saved calculator after an update or deletion fails", async () => {
  const store = configureStore();
  store.dispatch(sActions.fetchSuccess([calculator]));
  (api as jest.Mock).mockReturnValue({
    calculators: {
      update: jest.fn().mockRejectedValue(new Error("offline")),
      destroy: jest.fn().mockRejectedValue(new Error("offline")),
    },
  });
  await expect(
    store.dispatch(update({ ...calculator, title: "Draft" }, jest.fn()))
  ).rejects.toThrow("offline");
  expect(store.getState().calculators[0].title).toBe("Revenue");
  await expect(store.dispatch(destroy(55))).rejects.toThrow("offline");
  expect(store.getState().calculators[0]).toMatchObject(calculator);
  expect((store.getState().calculators[0] as any).deleted).toBeUndefined();
});
