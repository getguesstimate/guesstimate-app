import rootReducer from "gModules/reducers";
import createSagaMiddleware from "redux-saga";
import { dispatchCatchSaga } from "../routes/sagas";

import { configureStore as toolkitConfigureStore } from "@reduxjs/toolkit";
import { ThunkAction } from "redux-thunk";
import { AnyAction } from "redux";

export default function configureStore() {
  const sagaMiddleware = createSagaMiddleware();

  const store = toolkitConfigureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(sagaMiddleware),
  });

  sagaMiddleware.run(dispatchCatchSaga);

  if ((module as any).hot) {
    // Enable Webpack hot module replacement for reducers
    (module as any).hot.accept("gModules/reducers", () => {
      const nextReducer = require("gModules/reducers");
      store.replaceReducer(nextReducer);
    });
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
  unknown,
  AnyAction
>;