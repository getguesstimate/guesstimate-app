import { applyMiddleware } from "redux";
import thunk from "redux-thunk";
import expect from "expect";

const middlewares = [thunk];

/**
 * Creates a mock of Redux store with middleware.
 */
function mockStore(getState, expectedActions, done) {
  if (!Array.isArray(expectedActions)) {
    throw new Error("expectedActions should be an array of expected actions.");
  }
  if (typeof done !== "undefined" && typeof done !== "function") {
    throw new Error("done should either be undefined or function.");
  }

  function mockStoreWithoutMiddleware() {
    return {
      getState() {
        return typeof getState === "function" ? getState() : getState;
      },

      dispatch(action) {
        const expectedAction = expectedActions.shift();

        try {
          expect(action).toEqual(expectedAction);
          if (done && !expectedActions.length) {
            done();
          }
          return action;
        } catch (e) {
          done(e);
        }
      },
    };
  }

  // TODO - types here are completely broken, is this code functional?

  const mockStoreWithMiddleware = applyMiddleware(...middlewares)(
    mockStoreWithoutMiddleware as any
  );

  return (mockStoreWithMiddleware as any)();
}

export function expectToCallActions(
  startingAction,
  expectedActions,
  done,
  initialState = {}
) {
  const store = mockStore(initialState, expectedActions, done);
  store.dispatch(startingAction);
}
