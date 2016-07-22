import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import Helmet from 'react-helmet'
import {ShareButtons, generateShareIcon} from 'react-share'

import Container from 'gComponents/utility/container/Container'
import {CalculatorShow} from './CalculatorShow'

import {calculatorSpaceSelector} from './calculator-space-selector'
import {ButtonCloseText} from 'gComponents/utility/buttons/close/index.js'

import {navigateFn} from 'gModules/navigation/actions'
import {fetchById} from 'gModules/calculators/actions'

import * as Space from 'gEngine/space'
import * as Calculator from 'gEngine/calculator'

import '../style.css'

@connect(calculatorSpaceSelector, dispatch => bindActionCreators({fetchById}, dispatch))
export class CalculatorExpandedShow extends Component {
  state = {
    attemptedFetch: false,
    showHelp: false,
    resultBeenShown: false,
  }

  componentWillMount() {
    if (!this.state.attemptedFetch) {
      this.props.fetchById(this.props.calculatorId)
      this.setState({attemptedFetch: true})
    }
  }

  render() {
    if (!this.props.calculator) { return false }

    const {props: {calculator: {content, title, space_id, share_image, id}, inputs, outputs, isPrivate}, state: {resultBeenShown}} = this
    const spaceUrl = Space.url({id: space_id}) + `/calculators/${id}${resultBeenShown ? '?showResults=true' : ''}`
    const calculatorUrl = Calculator.fullUrl(this.props.calculator)

    let metaTags = [
      {name: 'Description', content},
      {property: 'og:description', content},
      {property: 'og:title', content: title},
      {property: 'og:site_name', content: 'Guesstimate'},
    ]
    if (!!share_image) {metaTags = metaTags.concat({property: 'og:image', content: share_image})}

    const {FacebookShareButton, TwitterShareButton} = ShareButtons
    const FacebookIcon = generateShareIcon('facebook')
    const TwitterIcon = generateShareIcon('twitter')

    return (
      <Container>
        <Helmet title={title} meta={metaTags}/>
        <div className='row'>
          <div className='col-xs-0 col-md-2'/>
          <div className='col-xs-12 col-md-8'>
            { !this.state.showHelp &&
              <CalculatorShow
                {...this.props}
                size='wide'
                classes={['wide']}
                showHelp={() => this.setState({showHelp: true})}
                onShowResult={() => this.setState({resultBeenShown: true})}
              />
            }
            { this.state.showHelp &&
              <CalculatorHelp onClose={() => this.setState({showHelp: false})} />
            }
            <div className='information-section'>
              <div className='row'>
                <div className='col-xs-12 col-sm-6'>
                  <FacebookShareButton url={calculatorUrl} title={title}>
                    <FacebookIcon size={42}/>
                  </FacebookShareButton>
                  <TwitterShareButton url={calculatorUrl} title={title}>
                    <TwitterIcon size={42}/>
                  </TwitterShareButton>
                </div>
                <div className='col-sm-1'/>
                <div className='col-xs-12 col-sm-5 calculation-link-section'>
                  <a href={spaceUrl} onClick={navigateFn(spaceUrl)}>
                    <i className='ion-ios-redo'/> See calculations
                  </a>
                </div>
              </div>
            </div>

          </div>
          <div className='col-md-3' />
        </div>
      </Container>
    )
  }
}

class CalculatorHelp extends Component {
  render() {
    return (
      <div className='calculator wide help'>
        <div className='padded-section'>
          <div className='row'>
            <div className='col-xs-9'>
              <h1> Useful Information </h1>
            </div>
            <div className='col-xs-3 header-actions'>
              <ButtonCloseText onClick={this.props.onClose}/>
            </div>
          </div>
          <hr className='result-divider'/>

          <h2> Input Types </h2>

        <table className='ui celled table'>
          <thead>
            <tr><th>Type</th><th>Example</th><th>Explanation</th></tr>
          </thead>
          <tbody>
            <tr><td>Point</td><td><input className='editor' value='8'/></td><td>You believe this value is 8.</td></tr>
            <tr><td>Range</td><td><input className='editor' value='6 to 12'/></td> <td>You believe this value is between 6 and 12.  More specifically, this indicates that you believe there's a 95% chance the value is above 6, and a 95% chance the value is below 12.</td></tr>
          </tbody>
        </table>
          <hr className='result-divider'/>
          <h2> Units </h2>
          <table className='ui celled table'>
            <thead>
              <tr><th>Symbol</th><th>Multiplier</th><th>Example</th></tr>
            </thead>
            <tbody>
              <tr><td>K</td><td>Thousand</td><td><input className='editor' value='3K to 8K'/></td></tr>
              <tr><td>M</td><td>Million</td><td><input className='editor' value='3M to 8M'/></td></tr>
              <tr><td>B</td><td>Billion</td><td><input className='editor' value='3B to 8B'/></td></tr>
              <tr><td>T</td><td>Trillion</td><td><input className='editor' value='3T to 8T'/></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}
