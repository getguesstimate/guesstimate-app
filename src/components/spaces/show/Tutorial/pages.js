import React from 'react'

import Icon from 'react-fa'

import './pageStyle.css'
import MakeAMetric from '../../../../assets/tutorial/MakeAMetric.gif'
import MakeACell from '../../../../assets/tutorial/makeACell.gif'
import InteractWithACell from '../../../../assets/tutorial/InteractWithACell.gif'
import MakeAFunction from '../../../../assets/tutorial/MakeAFunction.gif'
import AdvancedFunctions from '../../../../assets/tutorial/AdvancedFunctions.png'
import MakeACellWithARange from '../../../../assets/tutorial/makeACellWithARange.gif'
import MakeACellWithData from '../../../../assets/tutorial/MakeACellWithData.gif'
import IfStatement from '../../../../assets/tutorial/If Statements.png'

const TutorialPage = ({imgTopLeft, contentTopRight, contentBottomLeft, imgBottomRight}) => (
  <div className='tutorialPage'>
    <div className='row'>
      <div className='col-md-6'>{imgTopLeft}</div>
      <div className='col-md-6'><p>{contentTopRight}</p></div>
    </div>
    <div className='row'>
      <div className='col-md-6'><p>{contentBottomLeft}</p></div>
      <div className='col-md-6'>{imgBottomRight}</div>
    </div>
  </div>
)

export const TutorialPageOne = () => (
  <div className='tutorialPage'>
    <div className='row'>
      <div className='header'>
        <div className='col-md-12'>
          <h2>Metrics</h2>
        </div>
      </div>
    </div>
    <img src={MakeAMetric} />
    <div className='row'>
      <div className='col-md-1' />
      <div className='col-md-10'>
        <p>
          To create a metric, double click on an empty cell in the grid. Clicking once will select the location, and
          twice will create the metric. Metrics can be given names and values, which have one of two types:
        </p>
        <div>
          <table>
            <tbody>
              <tr>
                <td><span className='rowLabel'>Point Values</span></td>
                <td>
                  Point values (e.g. '100') are exact numbers, used when you are absolutely sure of the value.
                </td>
              </tr>
              <tr>
                <td><span className='rowLabel'>Ranges</span></td>
                <td>
                  Ranges (e.g. '300 to 700') are used when you belive there is uncertainty around the true value, but it
                  is very likely to be within a certain range.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className='col-md-1' />
    </div>
  </div>
)

export const TutorialPageTwo = () => (
  <div className='tutorialPage'>
    <div className='row'>
      <div className='header'>
        <div className='col-md-12'>
          <h2>Metric Actions</h2>
        </div>
      </div>
    </div>
    <img src={InteractWithACell} />
    <div className='row'>
      <div className='col-md-1' />
      <div className='col-md-10'>
        <p>
          When a cell is selected (when its background is dark blue but neither the name field nor the value field are
          selected), you can perform several actions:
        </p>
        <div>
          <table>
            <tbody>
              <tr>
                <td><span className='rowLabel'>Move Metrics</span></td>
                <td>
                  You can move a metric by clicking and dragging it across the canvas.
                </td>
              </tr>
              <tr>
                <td><span className='rowLabel'>Delete Metrics</span></td>
                <td>
                  You can delete a metric by clicking on it and pressing the 'delete' or 'backspace' keys, or clicking
                  the 'trash can' icon in the toolbar.
                </td>
              </tr>
              <tr>
                <td><span className='rowLabel'>Copy/Paste</span></td>
                <td>
                  You can cut, copy, and paste metrics with 'ctrl-x', 'ctrl-c', and 'ctrl-v', or the 'cut', 'copy', and
                  'paste' icons in the toolbar.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className='col-md-1' />
    </div>
  </div>
)

export const TutorialPageThree = () => (
  <div className='tutorialPage'>
    <div className='row'>
      <div className='header'>
        <div className='col-md-12'>
          <h2>Functions</h2>
        </div>
      </div>
    </div>
    <img src={MakeAFunction} />
    <div className='row'>
      <div className='col-md-1' />
      <div className='col-md-10'>
        <p>
          Functions combine multiple metrics in a single calculation. To make a function, start the value field of a
          cell with an '=' sign.  Variable names will appear on the other metrics in your spreadsheet, and you can use
          them as inputs either by typing those two letter codes or by clicking on the cell directly. Functions can
          contain many types of mathematical expressions:
        </p>
        <div>
          <table>
            <tbody>
              <tr>
                <td>
                  <span className='exampleFunction'>=((3+4) * (6/2)) % 4</span>
                </td>
                <td>The product of 7 and 3, modulo 4</td>
              </tr>
              <tr>
                <td>
                  <span className='exampleFunction'>=<span className='exampleInput'>AB</span> > 0 ? 100 : 0</span>
                </td>
                <td>If AB is greater than 0, 100, else 0</td>
              </tr>
            </tbody>
          </table>
          <a href={'http://docs.getguesstimate.com/functions/existing_functions.html'}>See More</a>
        </div>
      </div>
      <div className='col-md-1' />
    </div>
  </div>
)

export const TutorialPageFour = () => (
  <div className='tutorialPage'>
    <div className='row'>
      <div className='header'>
        <div className='col-md-12'>
          <h2>More Features</h2>
        </div>
      </div>
    </div>
    <div className='row'>
      <div className='col-md-1' />
      <div className='col-md-10'>
        <h3>Custom Data Input</h3>
        <p>
          You can insert a custom data set direclty into a guesstimate cell by pasting in a string of comma,
          space, or enter separated samples. Inserted samples will be treated as an empirical distribution in all
          downstream functions.
        </p>
        <h3>Visual Sensitivity Analysis</h3>
        <p>
          Guesstimate can show you a visual sensitivity analysis of the different metrics within a model. This allows
          you to identify where your uncertainty affects your output the most.
        </p>
        <h3>Model Calculators</h3>
        <p>
          Any Guesstimate model can also be made into a calculator. Calculators allow users to enter specific inputs and
          see specific outputs from a model without interacting with other parameters, ideal for repeated calculations.
        </p>
        <a href={'http://docs.getguesstimate.com/'}>See More</a>
      </div>
      <div className='col-md-1' />
    </div>
  </div>
)
