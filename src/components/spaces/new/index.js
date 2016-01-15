import React, {Component, PropTypes} from 'react'
import * as spaceActions from 'gModules/spaces/actions.js'
import { connect } from 'react-redux';
import './style.css'
import serialize from 'form-serialize'

function mapStateToProps(state) {
  return {
    me: state.me
  }
}

@connect(mapStateToProps)
export default class NewSpaceFormContainer extends Component {
  onSubmit(e) {
    e.preventDefault()
    let params = serialize(this.refs.form, {hash: true})

    if (this.canUsePrivateModels()) {
      params['is_private'] = (params.is_public === 'on') ? false : true
    }

    this.props.dispatch(spaceActions.create(params))
  }

  canUsePrivateModels() {
    return !!_.get(this.props,  'me.profile.has_private_access')
  }

  render() {
    const canUsePrivateModels = this.canUsePrivateModels()
    return (
      <div className='SpaceNew' >
        <div className='row'>
          <div className='col-md-2'>
          </div>
          <div className='col-md-8'>
            <h2> Create a {canUsePrivateModels ? '' : 'Public'} Model </h2>
            <br/>
            <form onSubmit={this.onSubmit.bind(this)} className='ui form' ref='form'>
                <div className='field'>
                  <label>Name</label>
                  <input type="text" name="name"/>
                </div>

                {canUsePrivateModels &&
                  <div className='field'>
                    <label>Public?</label>
                    <input type="checkbox" name="is_public"/>
                  </div>
                }

                <button type='submit' className='ui button primary'>
                  {'Create'}
                </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
