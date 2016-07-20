import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import Helmet from 'react-helmet'
import {ShareButtons, generateShareIcon} from 'react-share'

import Container from 'gComponents/utility/container/Container'
import {CalculatorShowIsolated} from './CalculatorShowIsolated'

import {calculatorSpaceSelector} from './calculator-space-selector'

import {navigateFn} from 'gModules/navigation/actions'
import {fetchById} from 'gModules/calculators/actions'

import * as Space from 'gEngine/space'
import * as Calculator from 'gEngine/calculator'

import '../style.css'

@connect(calculatorSpaceSelector, dispatch => bindActionCreators({fetchById}, dispatch))
export class CalculatorShow extends Component {
  state = {
    attemptedFetch: false,
  }

  componentWillMount() {
    if (!this.state.attemptedFetch) {
      this.props.fetchById(this.props.calculatorId)
      this.setState({attemptedFetch: true})
    }
  }

  render() {
    if (!this.props.calculator) { return false }

    const {calculator: {content, title, space_id, share_image}, inputs, outputs, isPrivate} = this.props
    const spaceUrl = Space.url({id: space_id})
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
            <CalculatorShowIsolated {...this.props} classes={['wide']} />
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
