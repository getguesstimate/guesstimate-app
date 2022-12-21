import React from "react";

import Icon from "react-fa";

import "./pageStyle.css";
import MakeAMetric from "../../../../assets/tutorial/MakeAMetric.gif";
import InteractWithACell from "../../../../assets/tutorial/InteractWithACell.gif";
import MakeAFunction from "../../../../assets/tutorial/MakeAFunction.gif";

const TutorialPage = ({ header, image, children }) => (
  <div className="tutorialPage">
    <div className="row header">
      <div className="col-md-12">
        <h2>{header}</h2>
      </div>
    </div>
    <div className="row">
      <div className="col-md-12">{children}</div>
    </div>
  </div>
);

const Image = ({ image }) => (
  <div className="image">
    <img src={image} />
  </div>
);

export const TutorialMetricPage = () => (
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
            <span className="exampleFunction">100</span>
          </td>
          <td>This value is exactly 100.</td>
        </tr>
        <tr>
          <td>
            <span className="exampleFunction">300 to 700</span>
          </td>
          <td>This value is estimated to be between 300 and 700.</td>
        </tr>
      </tbody>
    </table>
  </TutorialPage>
);

export const TutorialMetricActionsPage = () => (
  <TutorialPage header="Metric Actions">
    <p>Click a metric once to select it, then you can perform actions on it.</p>

    <Image image={InteractWithACell} />
    <table className="semantic ui table">
      <tbody>
        <tr>
          <td>
            <span className="rowLabel">Move</span>
          </td>
          <td>Click the metric center and drag it to another cell.</td>
        </tr>
        <tr>
          <td>
            <span className="rowLabel">Delete</span>
          </td>
          <td>
            Press <strong>delete</strong> or <strong>backspace</strong>, or
            click the <strong>trash</strong> icon in the toolbar.
          </td>
        </tr>
        <tr>
          <td>
            <span className="rowLabel">Cut, Copy & Paste</span>
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

export const TutorialFunctionPage = () => (
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
            <span className="exampleFunction">
              = <span className="exampleInput">FA</span> * 300
            </span>
          </td>
          <td>
            <span className="exampleInput">FA</span> times 300.
          </td>
        </tr>
        <tr>
          <td>
            <span className="exampleFunction">
              = <span className="exampleInput">FA</span> > 5 ? 100 : 0
            </span>
          </td>
          <td>
            If <span className="exampleInput">FA</span> is greater than 5, 100.
            If it is less, 0.
          </td>
        </tr>
      </tbody>
    </table>
  </TutorialPage>
);

export const TutorialMoreFeaturesPage = () => (
  <TutorialPage header="Advanced Features">
    <h3>Custom Data Input</h3>
    <p>
      You can enter your own data into a metric. This will be randomly sampled
      from in functions.
    </p>
    <h3>Sensitivity Analysis</h3>
    <p>
      Open a metrics' sidebar and select <strong>sensitivity</strong> to show
      scatterplots of how that metric corresponds to each other one.
    </p>
    <h3>Model Calculators</h3>
    <p>
      Models can be turned into calculators with a subset of their inputs and
      outputs.
    </p>
  </TutorialPage>
);
