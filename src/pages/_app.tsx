import type { AppProps } from "next/app";
import Head from "next/head";
import { useEffect, useState } from "react";

import { Provider } from "react-redux";
import { configureStore } from "../modules/store";
import * as auth0Constants from "~/server/auth0/constants";

import "font-awesome/css/font-awesome.css";
import "ionicons/dist/css/ionicons.css";

import "../styles/global.css";

import Script from "next/script";
import * as meActions from "~/modules/me/actions";
import "../routes/app";
import { Auth0Provider } from "@auth0/auth0-react";
import { BASE_URL } from "~/lib/constants";

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
      <Script id="elev">{`var _elev = window._elev || {};(function() {
      var i,e;i=document.createElement("script"),i.type='text/javascript';i.async=1,i.src="https://static.elev.io/js/v3.js",e=document.getElementsByTagName("script")[0],e.parentNode.insertBefore(i,e);})();
      _elev.account_id = '565e550e67ffc'`}</Script>
      <Script id="wistia" src="//fast.wistia.com/assets/external/E-v1.js" />
      <Script id="twitter">{`!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");`}</Script>
      <Script id="chargebee" src="https://js.chargebee.com/v1/chargebee.js" />
      <Script id="iubenda" src="//cdn.iubenda.com/iubenda.js" />
      <Head>
        <title key="title">Guesstimate</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, user-scalable=no"
        />
      </Head>
      <Auth0Provider
        domain={auth0Constants.variables.AUTH0_DOMAIN}
        clientId={auth0Constants.variables.AUTH0_CLIENT_ID}
        authorizationParams={{
          redirect_uri: `${BASE_URL}/auth-redirect`,
          audience: `https://${auth0Constants.variables.AUTH0_DOMAIN}/userinfo`,
        }}
      >
        <Provider store={store}>{isClient ? <Component /> : null}</Provider>
      </Auth0Provider>
    </>
  );
};

// https://stackoverflow.com/a/64509306
export default MyApp;
