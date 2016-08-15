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
    <div className='row'>
      <div className='col-md-1' />
      <div className='col-md-10'>
        <p>
          To create a metric, simply double click on an empty cell in the grid. Clicking once will
          select the location, and twice will create the metric. Metrics can be given names and values.
          Values can have one of two types:
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
        <img src={MakeAMetric} />
      </div>
      <div className='col-md-1' />
    </div>
    {false && <div className='row'>
      <div className='col-md-6'>
        <p>
          You can drag a cell to move it, and you can delete a cell with 'backspace', 'delete', or by clicking the trash
          can icon in the toolbar while the cell is selected. You can cut, copy, and paste cells with ctrl-x, ctrl-c, and
          ctrl-v, respectively, or the icons in the toolbar.
        </p>
      </div>
      <div className='col-md-6'><img src={InteractWithACell} /></div>
    </div>}
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
    <div className='row'>
      <div className='col-md-1' />
      <div className='col-md-10'>
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
        <img src={InteractWithACell} />
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
                <td><span className='rowLabel'>All Standard Arithmetic Operators</span></td>
                <td>
                  <span className='exampleFunction'>=((3+4) * (6/2)) % 4</span>
                </td>
              </tr>
              <tr>
                <td><span className='rowLabel'>Trigonometric</span></td>
                <td>
                  <span className='exampleFunction'>=2*cos(pi/2)*sin(pi/2)</span>
                </td>
              </tr>
              <tr>
                <td><span className='rowLabel'>Financial</span></td>
                <td>
                  <span className='exampleFunction'>=R72(22)</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <img src={MakeAFunction} />
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
          space, or enter separated samples.
        </p>
        <h3>Visual Sensitivity Analysis</h3>
        <p>
          Guesstimate can show you a visual sensitivity analysis of the different metrics within a model.
        </p>
        <h3>Model Calculators</h3>
        <p>
          Any Guesstimate model can also be made into a calculator for repeated calculations.
        </p>
      </div>
      <div className='col-md-1' />
    </div>
  </div>
)

export const TutorialPageWoor = () => (
  <TutorialPage
    imgTopLeft={<img src={MakeACellWithARange} />}
    contentTopRight={`
      In addition to simply working with raw numbers, Guesstimate cells can also work with statistical objects, like
      confidence intervals (a range in which you think a value is likely to be). If you are trying to estimate the
      amount of money you'll spend on a trip, you might estimate that you'd spend somewhere from 300 to 700 dollars,
      and to input that to guesstimate, you'd simply input the expression '300 to 700' into the cell value.
    `}
    contentBottomLeft={`
      Guesstimate cells can also take raw streams of data. Simply paste in a string of comma, space, or enter
      separated data points, and Guesstimate will use those samples as an empirical distribution.
    `}
    imgBottomRight={<img src={MakeACellWithData} />}
  />
)

export const TutorialPageFou = () => (
  <TutorialPage
    imgTopLeft={<img src={IfStatement} />}
    contentTopRight={`
      Guesstimate functions support conditionals via ternary if statements
    `}
    contentBottomLeft={`
      Guesstimate has more documentaiton you can peruse if you want to learn more. See 'docs.getguesstimate.com' for more details.
    `}
    imgBottomRight={<Icon name='book' />}
  />
)
/*
export const TutorialPageOne = () => (
  <div className='tutorialPage'>
    <div className='row'>
      <div className='header'>
        <div className='col-md-12'>
          <h2>Metrics</h2>
        </div>
      </div>
    </div>
    <div className='row'>
      <div className='col-md-12'>
        <p>
          To create a metric, simply double click on an empty cell in the grid. Clicking once will
          select the location, and twice will create the metric. Metrics can be given names and values.
          Values can have one of two types:
        </p>
      </div>
    </div>
    <div className='row'>
      <div className='col-md-6'>
        <div>
          <table>
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
          </table>
        </div>
      </div>
      <div className='col-md-6'><img src={MakeAMetric} /></div>
    </div>
    {false && <div className='row'>
      <div className='col-md-6'>
        <p>
          You can drag a cell to move it, and you can delete a cell with 'backspace', 'delete', or by clicking the trash
          can icon in the toolbar while the cell is selected. You can cut, copy, and paste cells with ctrl-x, ctrl-c, and
          ctrl-v, respectively, or the icons in the toolbar.
        </p>
      </div>
      <div className='col-md-6'><img src={InteractWithACell} /></div>
    </div>}
  </div>
)
*/
