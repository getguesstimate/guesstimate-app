import React from "react";

const MakeAMetric = "/assets/tutorial/MakeAMetric.gif";
const InteractWithACell = "/assets/tutorial/InteractWithACell.gif";
const MakeAFunction = "/assets/tutorial/MakeAFunction.gif";

type PageProps = {
  header: string;
  children: React.ReactNode;
};

const TutorialPage: React.FC<PageProps> = ({ header, children }) => (
  <div className="tutorialPage">
    <h2 className="text-center pb-6">{header}</h2>
    <div>{children}</div>
  </div>
);

const Image: React.FC<{ image: string }> = ({ image }) => (
  <div className="bg-grey-7">
    <img src={image} className="max-h-40 max-w-full mx-auto" />
  </div>
);

const ExampleFunction: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <span className="bg-grey-eee rounded px-2 py-1 font-mono text-sm">
    {children}
  </span>
);

const ExampleInput: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <span className="text-green-3 bg-green-4 px-1 rounded">{children}</span>;

export const TutorialMetricPage: React.FC = () => (
  <TutorialPage header="Metrics">
    <p>
      To create a metric, double click on an empty cell in the grid. Give it a
      name and a value.
    </p>
    <Image image={MakeAMetric} />
    <table className="semantic ui table">
      <thead>
        <tr>
          <th>Example Value</th>
          <th>Explanation</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <ExampleFunction>100</ExampleFunction>
          </td>
          <td>This value is exactly 100.</td>
        </tr>
        <tr>
          <td>
            <ExampleFunction>300 to 700</ExampleFunction>
          </td>
          <td>This value is estimated to be between 300 and 700.</td>
        </tr>
      </tbody>
    </table>
  </TutorialPage>
);

export const TutorialMetricActionsPage: React.FC = () => (
  <TutorialPage header="Metric Actions">
    <p>Click a metric once to select it, then you can perform actions on it.</p>

    <Image image={InteractWithACell} />
    <table className="semantic ui table">
      <tbody>
        <tr>
          <td>
            <span className="text-center font-bold">Move</span>
          </td>
          <td>Click the metric center and drag it to another cell.</td>
        </tr>
        <tr>
          <td>
            <span className="text-center font-bold">Delete</span>
          </td>
          <td>
            Press <strong>delete</strong> or <strong>backspace</strong>, or
            click the <strong>trash</strong> icon in the toolbar.
          </td>
        </tr>
        <tr>
          <td>
            <span className="text-center font-bold">Cut, Copy & Paste</span>
          </td>
          <td>
            Press <strong>ctrl-x</strong>, <strong>ctrl-c</strong>, and{" "}
            <strong>ctrl-v</strong>.
          </td>
        </tr>
      </tbody>
    </table>
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
    <table className="semantic ui table">
      <thead>
        <tr>
          <th>Example Function</th>
          <th>Explanation</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <ExampleFunction>
              = <ExampleInput>FA</ExampleInput> * 300
            </ExampleFunction>
          </td>
          <td>
            <ExampleInput>FA</ExampleInput> times 300.
          </td>
        </tr>
        <tr>
          <td>
            <ExampleFunction>
              = <ExampleInput>FA</ExampleInput> &gt; 5 ? 100 : 0
            </ExampleFunction>
          </td>
          <td>
            If <ExampleInput>FA</ExampleInput> is greater than 5, 100. If it is
            less, 0.
          </td>
        </tr>
      </tbody>
    </table>
  </TutorialPage>
);

const Subheader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="text-center text-grey-666 text-2xl my-3">{children}</h3>
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
