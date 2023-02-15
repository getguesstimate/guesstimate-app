import React, { PropsWithChildren, useEffect, useState } from "react";

import Head from "next/head";
import { generateShareIcon, ShareButtons } from "react-share";

import { Container } from "~/components/utility/Container";
import { CalculatorShow } from "./CalculatorShow";

import { ButtonCloseText } from "~/components/utility/buttons/close/index";
import { calculatorSpaceSelector } from "./calculator-space-selector";

import { fetchById } from "~/modules/calculators/actions";

import * as Calculator from "~/lib/engine/calculator";
import * as Space from "~/lib/engine/space";
import { useAppDispatch, useAppSelector } from "~/modules/hooks";
import { DottedHR } from "./DottedHR";

const CalculatorContainer: React.FC<PropsWithChildren> = ({ children }) => (
  <div className="border border-grey-ccc rounded p-12 m-4 bg-white text-grey-444 leading-7">
    {children}
  </div>
);

const CalculatorHelp: React.FC<{ onClose(): void }> = ({ onClose }) => {
  return (
    <div>
      <div className="flex justify-between items-start">
        <h1 className="m-0">Useful Information</h1>
        <ButtonCloseText onClick={onClose} />
      </div>
      <DottedHR />

      <h2>Input Types</h2>

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
              this indicates that you believe there's a 95% chance the value is
              above 6, and a 95% chance the value is below 12.
            </td>
          </tr>
        </tbody>
      </table>
      <DottedHR />
      <h2>Units</h2>
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
  );
};

type Props = {
  calculatorId: number;
};

export const CalculatorExpandedShow: React.FC<Props> = ({ calculatorId }) => {
  const [showHelp, setShowHelp] = useState(false);
  const [resultBeenShown, setResultBeenShown] = useState(false);

  const dispatch = useAppDispatch();

  const selectedProps = useAppSelector((state) =>
    calculatorSpaceSelector(state, calculatorId)
  );

  useEffect(() => {
    dispatch(fetchById(calculatorId));
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
      <div className="max-w-3xl mx-auto">
        <CalculatorContainer>
          {showHelp ? (
            <CalculatorHelp onClose={() => setShowHelp(false)} />
          ) : (
            <CalculatorShow
              {...selectedProps}
              showHelp={() => setShowHelp(true)}
              onShowResult={() => setResultBeenShown(true)}
            />
          )}
        </CalculatorContainer>
        <div className="flex justify-between items-center px-20 py-4">
          <div className="flex gap-2">
            <FacebookShareButton
              url={calculatorUrl}
              title={title}
              className="opacity-50 hover:opacity-100 bg-[rgb(59,89,152)]"
            >
              <FacebookIcon size={42} />
            </FacebookShareButton>
            <TwitterShareButton
              url={calculatorUrl}
              title={title}
              className="opacity-50 hover:opacity-100 bg-[rgb(0,172,237)]"
            >
              <TwitterIcon size={42} />
            </TwitterShareButton>
          </div>
          <a
            href={spaceUrl}
            className="block text-lg text-grey-888 hover:text-grey-333"
          >
            <i className="ion-ios-redo" /> See calculations
          </a>
        </div>
      </div>
    </Container>
  );
};
