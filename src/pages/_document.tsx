import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  const baseDescription =
    "Plan finances, make strategic decisions, and do risk assessment.  Guesstimate uses stochastic models, Monte Carlo simulations, and sensitivity analyses.";

  return (
    <Html>
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
