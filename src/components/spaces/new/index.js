import React, {Component, PropTypes} from 'react'
import * as spaceActions from 'gModules/spaces/actions.js'
import e from 'gEngine/engine'
import {connect} from 'react-redux'
import './style.css'
import serialize from 'form-serialize'
import {PrivacyToggle} from '../privacy-toggle/index.js'

function mapStateToProps(state) {
  return {
    me: state.me
  }
}

@connect(mapStateToProps)
export default class NewSpaceFormContainer extends Component {
  state = {isValid: true}

  onSubmit(e) {
    e.preventDefault()
    let params = serialize(this.refs.form, {hash: true})

    if (this.canUsePrivateModels()) {
      params['is_private'] = !this.refs['privacy-toggle'].isPublicSelected()
    }

    this.props.dispatch(spaceActions.create(params))
  }

  canUsePrivateModels() {
    return !!_.get(this.props,  'me.profile.has_private_access')
  }

  changeValidity(isValid) {
    this.setState({isValid})
  }

  render() {
    const {me} = this.props
    const canUsePrivateModels = this.canUsePrivateModels()
    const canMakeMorePrivateModels = e.me.canMakeMorePrivateModels(me)
    let submitClasses = 'ui button primary'
    submitClasses += this.state.isValid ? '' : ' disabled'
    return (
      <div className='SpaceNew' >
        <div className='row'>
          <div className='col-md-2'>
          </div>
          <div className='col-md-8'>
            <h2> Create a New {canUsePrivateModels ? '' : 'Public'} Model </h2>
            <br/>
            <form
              onSubmit={this.onSubmit.bind(this)}
              className='ui form'
              ref='form'
            >
              <div className='field'>
                <h3>Name</h3>
                <input type='text' name='name'/>
              </div>
              <hr/>

              {canUsePrivateModels &&
                <div className='field'>
                  <PrivacyToggle
                    ref='privacy-toggle'
                    isPrivateSelectionValid={canMakeMorePrivateModels}
                    onPrivateSelect={() => {this.changeValidity(canMakeMorePrivateModels)}}
                    onPublicSelect={() => {this.changeValidity(true)}}
                  />
                </div>
              }

              {canUsePrivateModels && <hr/>}
              <div className='field'>
                <button type='submit' className={submitClasses}>
                  {'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}
