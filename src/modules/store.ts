import { AnyAction } from "redux";
import createSagaMiddleware from "redux-saga";
import { ThunkAction } from "redux-thunk";
import { rootReducer } from "~/modules/reducers";

import { configureStore as toolkitConfigureStore } from "@reduxjs/toolkit";

import { dispatchCatchSaga } from "../routes/sagas";

export function configureStore() {
  const sagaMiddleware = createSagaMiddleware();

  const store = toolkitConfigureStore({
    reducer: rootReducer,
    /* redux-toolkit middlewares are too slow; https://redux-toolkit.js.org/api/getDefaultMiddleware#development */
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: false,
      }).concat(sagaMiddleware),
  });

  sagaMiddleware.run(dispatchCatchSaga);

  const hot = (module as any).hot;
  if (hot && typeof hot.accept === "function") {
    // Enable hot module replacement for reducers (webpack only; Turbopack has
    // its own Fast Refresh and a different `module.hot.accept` signature).
    try {
      hot.accept("~/modules/reducers", () => {
        const { rootReducer: nextReducer } = require("~/modules/reducers");
        store.replaceReducer(nextReducer);
      });
    } catch {
      // ignore — HMR not supported by the current bundler
    }
  }

  return store;
}

export type RootState = ReturnType<
  ReturnType<typeof configureStore>["getState"]
>;
export type AppDispatch = ReturnType<typeof configureStore>["dispatch"];

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  undefined,
  AnyAction
>;
