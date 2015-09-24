
declare module Redux {

  interface ActionCreator extends Function {
    (...args: any[]): any;
  }

  interface ActionCreators {
    [key: string]: ActionCreator
  }

  interface Reducer extends Function {
    (state: any, action: any): any;
  }

  interface Dispatch extends Function {
    (action: any): any;
  }

  interface MiddlewareArg {
    dispatch: Dispatch;
    getState: Function;
  }

  interface Middleware extends Function {
    (obj: MiddlewareArg): Function;
  }

  class Store {
    getReducer(): Reducer;
    replaceReducer(nextReducer: Reducer): void;
    dispatch(action: any): any;
    getState(): any;
    subscribe(listener: Function): Function;
  }

  function createStore(reducer: Reducer, initialState?: any): Store;
  function bindActionCreators<T>(actionCreators: ActionCreator | ActionCreators, dispatch: Dispatch): T;
  function combineReducers(reducers: any): Reducer;
  function applyMiddleware(...middleware: Middleware[]): Function;
}

declare module "redux" {
  export = Redux;
}


declare module "react-redux" {
    import React = require("react");
    import redux = require("redux");

    interface ProviderProps {
        store: redux.Store;
        children: Function;
    }

    interface ProviderState {
        store: redux.Store;
    }

    class Provider extends React.Component<ProviderProps, ProviderState> {}

    interface ConnectorProps {
        children: Function;
        select: Function;
    }

    class Connector extends React.Component<ConnectorProps, any> {}

    function connect(select: Function): any;
    function provide(store: redux.Store): any;
}
