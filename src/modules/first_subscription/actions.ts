import * as meActions from "~/modules/me/actions";
import { AppDispatch, AppThunk } from "~/modules/store";
import { api } from "~/lib/guesstimate_api";

function actionType(action: string, event: string) {
  return `${action}_${event}`;
}

function errorAction(action: string, error: unknown) {
  return {
    type: actionType(action, "FAILURE"),
    error,
  };
}

function successAction(action: string, value: unknown) {
  return {
    type: actionType(action, "SUCCESS"),
    value,
  };
}

function simpleCallback({
  dispatch,
  action,
}: {
  dispatch: AppDispatch;
  action: string;
}) {
  return (err, value) => {
    if (err) {
      dispatch(errorAction(action, err));
    } else if (value) {
      dispatch(successAction(action, value));
    }
  };
}

export function fetchIframe({ user_id, plan_id }): AppThunk {
  return (dispatch, getState) => {
    const action = "FIRST_SUBSCRIPTION_IFRAME_FETCH";

    dispatch({ type: actionType(action, "START") });
    api(getState()).accounts.get_new_subscription_iframe(
      { user_id, plan_id },
      simpleCallback({ dispatch, action })
    );
  };
}

export function postSynchronization({ user_id }): AppThunk {
  return (dispatch, getState) => {
    const action = "FIRST_SUBSCRIPTION_SYNCHRONIZATION_POST";

    dispatch({ type: actionType(action, "START") });
    api(getState()).accounts.synchronize({ user_id }, (err, value) => {
      if (err) {
        dispatch(errorAction(action, err));
      } else if (value) {
        dispatch(successAction(action, value));
        dispatch(meActions.guesstimateMeReload());
      }
    });
  };
}

export function flowStageReset() {
  return { type: "FIRST_SUBSCRIPTION_FLOW_RESET" };
}

export function flowStageCancel() {
  return { type: "FIRST_SUBSCRIPTION_FLOW_CANCEL" };
}
