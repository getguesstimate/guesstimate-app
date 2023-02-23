import React, { PropsWithChildren } from "react";

const MakeAMetric = "/assets/tutorial/MakeAMetric.gif";
const InteractWithACell = "/assets/tutorial/InteractWithACell.gif";
const MakeAFunction = "/assets/tutorial/MakeAFunction.gif";

const TH: React.FC<PropsWithChildren> = ({ children }) => (
  <th className="border-t border-b border-[#ddd] bg-[#f8f8f8] px-4 py-4 leading-tight">
    {children}
  </th>
);

const TD: React.FC<PropsWithChildren> = ({ children }) => (
  <td className="border-t border-b border-[#ddd] px-4 py-3 leading-tight">
    {children}
  </td>
);

const Table: React.FC<PropsWithChildren> = ({ children }) => (
  <table className="mt-6 w-full rounded border border-[#ddd] bg-white text-left text-sm">
    {children}
  </table>
);

type PageProps = PropsWithChildren<{
  header: string;
}>;

const TutorialPage: React.FC<PageProps> = ({ header, children }) => (
  <div className="mb-8 min-h-[34em]">
    <header className="pb-12 text-center text-2xl font-bold leading-none">
      {header}
    </header>
    <div className="text-justify font-open">{children}</div>
  </div>
);

const Image: React.FC<{ image: string }> = ({ image }) => (
  <div className="bg-grey-7">
    <img src={image} className="mx-auto max-h-40 max-w-full" />
  </div>
);

const ExampleFunction: React.FC<PropsWithChildren> = ({ children }) => (
  <span className="rounded bg-grey-eee px-2 py-1 font-mono text-sm">
    {children}
  </span>
);

const ExampleInput: React.FC<PropsWithChildren> = ({ children }) => (
  <span className="rounded bg-green-4 px-1 text-green-3">{children}</span>
);

export const TutorialMetricPage: React.FC = () => (
  <TutorialPage header="Metrics">
    <p>
      To create a metric, double click on an empty cell in the grid. Give it a
      name and a value.
    </p>
    <Image image={MakeAMetric} />
    <Table>
      <thead>
        <tr>
          <TH>Example Value</TH>
          <TH>Explanation</TH>
        </tr>
      </thead>
      <tbody>
        <tr>
          <TD>
            <ExampleFunction>100</ExampleFunction>
          </TD>
          <TD>This value is exactly 100.</TD>
        </tr>
        <tr>
          <TD>
            <ExampleFunction>300 to 700</ExampleFunction>
          </TD>
          <TD>This value is estimated to be between 300 and 700.</TD>
        </tr>
      </tbody>
    </Table>
  </TutorialPage>
);

export const TutorialMetricActionsPage: React.FC = () => (
  <TutorialPage header="Metric Actions">
    <p>Click a metric once to select it, then you can perform actions on it.</p>

    <Image image={InteractWithACell} />
    <Table>
      <tbody>
        <tr>
          <TD>
            <span className="text-center font-bold">Move</span>
          </TD>
          <TD>Click the metric center and drag it to another cell.</TD>
        </tr>
        <tr>
          <TD>
            <span className="text-center font-bold">Delete</span>
          </TD>
          <TD>
            Press <strong>delete</strong> or <strong>backspace</strong>, or
            click the <strong>trash</strong> icon in the toolbar.
          </TD>
        </tr>
        <tr>
          <TD>
            <span className="text-center font-bold">Cut, Copy & Paste</span>
          </TD>
          <TD>
            Press <strong>ctrl-x</strong>, <strong>ctrl-c</strong>, and{" "}
            <strong>ctrl-v</strong>.
          </TD>
        </tr>
      </tbody>
    </Table>
  </TutorialPage>
);

export const TutorialFunctionPage: React.FC = () => (
  <TutorialPage header="Functions">
    <p>
      In addition to points and ranges, metrics can also be functions of other
      metrics. Just use an <strong>=</strong> sign to begin a function.
    </p>
    <p>
      When a function is selected, you can click on other metrics or type their
      two letter variable names to reference them.
    </p>

    <Image image={MakeAFunction} />
    <Table>
      <thead>
        <tr>
          <TH>Example Function</TH>
          <TH>Explanation</TH>
        </tr>
      </thead>
      <tbody>
        <tr>
          <TD>
            <ExampleFunction>
              = <ExampleInput>FA</ExampleInput> * 300
            </ExampleFunction>
          </TD>
          <TD>
            <ExampleInput>FA</ExampleInput> times 300.
          </TD>
        </tr>
        <tr>
          <TD>
            <ExampleFunction>
              = <ExampleInput>FA</ExampleInput> &gt; 5 ? 100 : 0
            </ExampleFunction>
          </TD>
          <TD>
            If <ExampleInput>FA</ExampleInput> is greater than 5, 100. If it is
            less, 0.
          </TD>
        </tr>
      </tbody>
    </Table>
  </TutorialPage>
);

const Subheader: React.FC<PropsWithChildren> = ({ children }) => (
  <header className="my-3 text-center text-lg font-bold text-grey-666">
    {children}
  </header>
);

export const TutorialMoreFeaturesPage: React.FC = () => (
  <TutorialPage header="Advanced Features">
    <Subheader>Custom Data Input</Subheader>
    <p>
      You can enter your own data into a metric. This will be randomly sampled
      from in functions.
    </p>
    <Subheader>Sensitivity Analysis</Subheader>
    <p>
      Open a metrics' sidebar and select <strong>sensitivity</strong> to show
      scatterplots of how that metric corresponds to each other one.
    </p>
    <Subheader>Model Calculators</Subheader>
    <p>
      Models can be turned into calculators with a subset of their inputs and
      outputs.
    </p>
  </TutorialPage>
);
