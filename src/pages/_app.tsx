import Head from "next/head";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";

import { Provider } from "react-redux";
import configureStore from "../modules/store";

import "flexboxgrid/css/flexboxgrid.min.css";
import "font-awesome/css/font-awesome.css";
import "ionicons/dist/css/ionicons.css";
import "react-dd-menu/dist/react-dd-menu.css";
import "../../semantic/dist/semantic.css";
//semantic js is dependent on jquery, which has trouble now
import "../styles/FlowGrid.css";
import "../styles/legacyStyles.css";
import "../styles/theme.css";

import * as meActions from "gModules/me/actions";
import "../routes/app";

// hacky, consider https://github.com/kirill-konshin/next-redux-wrapper
let store: ReturnType<typeof configureStore> | undefined = undefined;

const MyApp = ({ Component }: AppProps) => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!store) {
    store = configureStore();
  }

  // this must be at the top level because we don't want it to fire too often
  useEffect(() => {
    if (!store) return; // should never happen, but satisfies typescript
    store.dispatch(meActions.init());
  }, [store.dispatch]);

  // titleTemplate="%s | Guesstimate"

  return (
    <>
      <Head>
        <title key="title">Guesstimate</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, user-scalable=no"
        />
      </Head>
      <Provider store={store}>{isClient ? <Component /> : null}</Provider>
    </>
  );
};

// https://stackoverflow.com/a/64509306
export default MyApp;
