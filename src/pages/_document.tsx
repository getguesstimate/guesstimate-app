import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  const baseDescription =
    "Plan finances, make strategic decisions, and do risk assessment.  Guesstimate uses stochastic models, Monte Carlo simulations, and sensitivity analyses.";

  return (
    <Html>
      <Script id="elev">{`var _elev = window._elev || {};(function() {
      var i,e;i=document.createElement("script"),i.type='text/javascript';i.async=1,i.src="https://static.elev.io/js/v3.js",e=document.getElementsByTagName("script")[0],e.parentNode.insertBefore(i,e);})();
      _elev.account_id = '565e550e67ffc'`}</Script>
      <Script id="wistia" src="//fast.wistia.com/assets/external/E-v1.js" />
      <Script id="twitter">{`!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");`}</Script>
      <Script id="chargebee" src="https://js.chargebee.com/v1/chargebee.js" />
      <Head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link
          href="https://fonts.googleapis.com/css?family=Lato:400,700,300"
          rel="stylesheet"
          type="text/css"
        />
        <meta name="fragment" content="!" />
        <meta name="description" key="description" content={baseDescription} />
        <meta property="og:type" key="og:type" content="product" />
        <meta
          property="og:title"
          key="og:title"
          content="Guesstimate | A Spreadsheet for the Uncertain"
        />
        <meta
          property="og:description"
          key="og:description"
          content={baseDescription}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
