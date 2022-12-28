import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import Head from "next/head";
import { generateShareIcon, ShareButtons } from "react-share";

import Container from "gComponents/utility/container/Container";
import { CalculatorShow } from "./CalculatorShow";

import { ButtonCloseText } from "gComponents/utility/buttons/close/index";
import { calculatorSpaceSelector } from "./calculator-space-selector";

import { fetchById } from "gModules/calculators/actions";

import * as Calculator from "gEngine/calculator";
import * as Space from "gEngine/space";
import { useAppDispatch, useAppSelector } from "gModules/hooks";

type Props = {
  calculatorId: string;
};

export const CalculatorExpandedShow: React.FC<Props> = ({ calculatorId }) => {
  const [attemptedFetch, setAttemptedFetch] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [resultBeenShown, setResultBeenShown] = useState(false);

  const dispatch = useAppDispatch();
  const router = useRouter();

  const selectedProps = useAppSelector((state) =>
    calculatorSpaceSelector(state, calculatorId)
  );

  useEffect(() => {
    if (!attemptedFetch) {
      dispatch(fetchById(calculatorId));
      setAttemptedFetch(true);
    }
  }, []);

  if (!selectedProps.calculator) {
    return null;
  }

  const {
    calculator: { content, title, space_id, share_image, id },
  } = selectedProps;

  const spaceUrl =
    Space.url({ id: space_id }) +
    `/calculators/${id}${resultBeenShown ? "?showResults=true" : ""}`;
  const calculatorUrl = Calculator.fullUrl(selectedProps.calculator);

  const pageTitle = `${title} | Guesstimate`;

  let metaTags = [
    { name: "description", content },
    { property: "og:description", content },
    { property: "og:title", content: pageTitle },
    { property: "og:site_name", content: "Guesstimate" },
  ];
  if (!!share_image) {
    metaTags = metaTags.concat({
      property: "og:image",
      content: share_image,
    });
  }

  const { FacebookShareButton, TwitterShareButton } = ShareButtons;
  const FacebookIcon = generateShareIcon("facebook");
  const TwitterIcon = generateShareIcon("twitter");

  return (
    <Container>
      <Head>
        <title key="title">{pageTitle}</title>
        {metaTags.map((tag) => (
          <meta {...tag} key={tag.name ?? tag.property} />
        ))}
      </Head>
      <div className="row">
        <div className="col-xs-0 col-md-2" />
        <div className="col-xs-12 col-md-8">
          {showHelp ? (
            <CalculatorHelp onClose={() => setShowHelp(false)} />
          ) : (
            <CalculatorShow
              {...selectedProps}
              size="wide"
              classes={["wide"]}
              showHelp={() => setShowHelp(true)}
              onShowResult={() => setResultBeenShown(true)}
            />
          )}
          <div className="information-section">
            <div className="row">
              <div className="col-xs-12 col-sm-6">
                <FacebookShareButton url={calculatorUrl} title={title}>
                  <FacebookIcon size={42} />
                </FacebookShareButton>
                <TwitterShareButton url={calculatorUrl} title={title}>
                  <TwitterIcon size={42} />
                </TwitterShareButton>
              </div>
              <div className="col-sm-1" />
              <div className="col-xs-12 col-sm-5 calculation-link-section">
                <a href={spaceUrl} onClick={() => router.push(spaceUrl)}>
                  <i className="ion-ios-redo" /> See calculations
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3" />
      </div>
    </Container>
  );
};

const CalculatorHelp: React.FC<{ onClose(): void }> = ({ onClose }) => {
  return (
    <div className="calculator wide help">
      <div className="padded-section">
        <div className="row">
          <div className="col-xs-9">
            <h1> Useful Information </h1>
          </div>
          <div className="col-xs-3 header-actions">
            <ButtonCloseText onClick={onClose} />
          </div>
        </div>
        <hr className="result-divider" />

        <h2> Input Types </h2>

        <table className="ui celled table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Example</th>
              <th>Explanation</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Point</td>
              <td>
                <input className="editor" value="8" />
              </td>
              <td>You believe this value is 8.</td>
            </tr>
            <tr>
              <td>Range</td>
              <td>
                <input className="editor" value="6 to 12" />
              </td>{" "}
              <td>
                You believe this value is between 6 and 12. More specifically,
                this indicates that you believe there's a 95% chance the value
                is above 6, and a 95% chance the value is below 12.
              </td>
            </tr>
          </tbody>
        </table>
        <hr className="result-divider" />
        <h2> Units </h2>
        <table className="ui celled table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Multiplier</th>
              <th>Example</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>K</td>
              <td>Thousand</td>
              <td>
                <input className="editor" value="3K to 8K" />
              </td>
            </tr>
            <tr>
              <td>M</td>
              <td>Million</td>
              <td>
                <input className="editor" value="3M to 8M" />
              </td>
            </tr>
            <tr>
              <td>B</td>
              <td>Billion</td>
              <td>
                <input className="editor" value="3B to 8B" />
              </td>
            </tr>
            <tr>
              <td>T</td>
              <td>Trillion</td>
              <td>
                <input className="editor" value="3T to 8T" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
