import { actionCreatorsFor } from "redux-crud";
import cuid from "cuid";

import app from "ampersand-app";

import { initSpace } from "gModules/checkpoints/actions";

import { captureApiError, generalError } from "lib/errors/index.js";
import * as displayErrorsActions from "gModules/displayErrors/actions";

import { setupGuesstimateApi } from "servers/guesstimate-api/constants.js";

export const sActions = actionCreatorsFor("calculators");

const api = (state) => setupGuesstimateApi(_.get(state, "me.token"));

export function fetchById(id) {
  return (dispatch, getState) => {
    dispatch(sActions.fetchStart());

    api(getState()).calculators.get(id, (err, calculator) => {
      if (err) {
        dispatch(displayErrorsActions.newError());
        captureApiError("CalculatorsFetch", err.jqXHR, err.textStatus, err, {
          url: "calculatorsFetchError",
        });
      } else if (calculator) {
        const space = _.get(calculator, "_embedded.space");
        const formatted = _.pick(calculator, [
          "id",
          "space_id",
          "title",
          "input_ids",
          "output_ids",
          "content",
          "share_image",
        ]);
        dispatch(initSpace(space.id, space.graph));
        dispatch(sActions.fetchSuccess([formatted], { space }));
      }
    });
  };
}

export function destroy(id) {
  return (dispatch, getState) => {
    dispatch(sActions.deleteStart({ id }));
    api(getState()).calculators.destroy(id, (err, value) => {
      if (err) {
        captureApiError("CalculatorsDestroy", err.jqXHR, err.textStatus, err, {
          url: "calculatorsDestroy",
        });
      } else {
        dispatch(sActions.deleteSuccess({ id }));
      }
    });
  };
}

export function create(spaceId, calculator, callback) {
  return (dispatch, getState) => {
    const record = { ...calculator, id: cuid() };
    dispatch(sActions.createStart(record));

    api(getState()).calculators.create(
      spaceId,
      calculator,
      (err, calculator) => {
        if (err) {
          captureApiError("CalculatorsCreate", err.jqXHR, err.textStatus, err, {
            url: "CalculatorsCreate",
          });
        } else if (calculator) {
          dispatch(sActions.createSuccess(calculator, record.id));
          if (!callback) {
            app.router.history.navigate(`/calculators/${calculator.id}`);
          } else {
            callback(calculator);
          }
        }
      }
    );
  };
}

export function update(calculator, callback) {
  return (dispatch, getState) => {
    dispatch(sActions.updateStart(calculator));
    api(getState()).calculators.update(
      calculator.id,
      calculator,
      (err, calculator) => {
        if (err) {
          captureApiError("CalculatorsCreate", err.jqXHR, err.textStatus, err, {
            url: "CalculatorsCreate",
          });
        } else if (calculator) {
          dispatch(sActions.updateSuccess(calculator));
          if (!callback) {
            app.router.history.navigate(`/calculators/${calculator.id}`);
          } else {
            callback(calculator);
          }
        }
      }
    );
  };
}
