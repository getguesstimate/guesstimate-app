import cuid from "cuid";
import _ from "lodash";
import reduxCrud from "redux-crud";

import { AppThunk } from "~/modules/store";

import { initSpace } from "~/modules/checkpoints/actions";

import * as displayErrorsActions from "~/modules/displayErrors/actions";

import { api } from "~/lib/guesstimate_api";
import { Calculator } from "./reducer";

export const sActions = reduxCrud.actionCreatorsFor("calculators");

export function fetchById(id: number): AppThunk<Promise<void>> {
  return async (dispatch, getState) => {
    dispatch(sActions.fetchStart());

    try {
      const calculator = await api(getState()).calculators.get(id);
      const space = calculator._embedded.space;
      const formatted = _.pick(calculator, [
        "id",
        "space_id",
        "title",
        "content",
        "share_image",
        "input_ids",
        "output_ids",
        // omit _embedded
      ]);
      dispatch(initSpace(space.id, space.graph));
      dispatch(sActions.fetchSuccess([formatted], { space }));
    } catch (err) {
      dispatch(displayErrorsActions.newError());
    }
  };
}

export function destroy(id: number): AppThunk<Promise<void>> {
  return async (dispatch, getState) => {
    dispatch(sActions.deleteStart({ id }));
    try {
      await api(getState()).calculators.destroy(id);
      dispatch(sActions.deleteSuccess({ id }));
    } catch (error) {
      dispatch(sActions.deleteError(error, { id }));
      throw error;
    }
  };
}

export function create(
  spaceId: number,
  calculator: Omit<Calculator, "id" | "space_id">,
  callback: (c: Calculator) => void
): AppThunk<Promise<void>> {
  return async (dispatch, getState) => {
    const record = { ...calculator, id: cuid() };
    dispatch(sActions.createStart(record));

    try {
      const created = await api(getState()).calculators.create(
        spaceId,
        calculator
      );
      dispatch(sActions.createSuccess(created, record.id));
      callback(created);
    } catch (error) {
      dispatch(sActions.createError(error, record));
      throw error;
    }
  };
}

export function update(
  calculator: Calculator,
  callback: (c: Calculator) => void
): AppThunk<Promise<void>> {
  return async (dispatch, getState) => {
    const previous = getState().calculators.find((c) => c.id === calculator.id);
    dispatch(sActions.updateStart(calculator));
    try {
      const updated = await api(getState()).calculators.update(
        calculator.id,
        calculator
      );
      dispatch(sActions.updateSuccess(updated));
      callback(updated);
    } catch (error) {
      dispatch(sActions.updateError(error, calculator));
      if (previous) dispatch(sActions.updateSuccess(previous));
      throw error;
    }
  };
}
