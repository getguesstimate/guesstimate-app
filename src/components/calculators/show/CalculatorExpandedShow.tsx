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
import { Table, TBody, TD, TH, THead, TR } from "~/components/utility/Table";

const CalculatorContainer: React.FC<PropsWithChildren> = ({ children }) => (
  <div className="m-4 rounded border border-grey-ccc bg-white p-12 leading-7 text-grey-444">
    {children}
  </div>
);

const HelpHeader: React.FC<PropsWithChildren> = ({ children }) => (
  <div>
    <DottedHR />
    <header className="mt-8 mb-4 text-2xl font-bold">{children}</header>
  </div>
);

const HelpInput: React.FC<{ value: string }> = ({ value }) => (
  <input
    type="text"
    value={value}
    className="border border-[#d4d4d4] bg-grey-6 px-2 py-1"
  />
);

const CalculatorHelp: React.FC<{ onClose(): void }> = ({ onClose }) => {
  return (
    <div>
      <div className="flex items-start justify-between">
        <header className="text-3xl font-bold">Useful Information</header>
        <ButtonCloseText onClick={onClose} />
      </div>

      <HelpHeader>Input Types</HelpHeader>

      <Table>
        <THead>
          <TR>
            <TH>Type</TH>
            <TH>Example</TH>
            <TH>Explanation</TH>
          </TR>
        </THead>
        <TBody>
          <TR>
            <TD>Point</TD>
            <TD>
              <HelpInput value="8" />
            </TD>
            <TD>You believe this value is 8.</TD>
          </TR>
          <TR>
            <TD>Range</TD>
            <TD>
              <HelpInput value="6 to 12" />
            </TD>
            <TD>
              You believe this value is between 6 and 12. More specifically,
              this indicates that you believe there's a 95% chance the value is
              above 6, and a 95% chance the value is below 12.
            </TD>
          </TR>
        </TBody>
      </Table>

      <HelpHeader>Units</HelpHeader>

      <Table>
        <THead>
          <TR>
            <TH>Symbol</TH>
            <TH>Multiplier</TH>
            <TH>Example</TH>
          </TR>
        </THead>
        <TBody>
          <TR>
            <TD>K</TD>
            <TD>Thousand</TD>
            <TD>
              <HelpInput value="3K to 8K" />
            </TD>
          </TR>
          <TR>
            <TD>M</TD>
            <TD>Million</TD>
            <TD>
              <HelpInput value="3M to 8M" />
            </TD>
          </TR>
          <TR>
            <TD>B</TD>
            <TD>Billion</TD>
            <TD>
              <HelpInput value="3B to 8B" />
            </TD>
          </TR>
          <TR>
            <TD>T</TD>
            <TD>Trillion</TD>
            <TD>
              <HelpInput value="3T to 8T" />
            </TD>
          </TR>
        </TBody>
      </Table>
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
      <div className="mx-auto max-w-3xl">
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
        <div className="flex items-center justify-between px-20 py-4">
          <div className="flex gap-2">
            <FacebookShareButton
              url={calculatorUrl}
              title={title}
              className="bg-[rgb(59,89,152)] opacity-50 hover:opacity-100"
            >
              <FacebookIcon size={42} />
            </FacebookShareButton>
            <TwitterShareButton
              url={calculatorUrl}
              title={title}
              className="bg-[rgb(0,172,237)] opacity-50 hover:opacity-100"
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
