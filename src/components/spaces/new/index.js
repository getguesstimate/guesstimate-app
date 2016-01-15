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

@connect()
export default class NewSpaceFormContainer extends Component {
  onSubmit(e) {
    e.preventDefault()
    const params = serialize(this.refs.form, {hash: true})
    this.props.dispatch(spaceActions.create(params))
  }

  render() {
    return (
      <div className='SpaceNew' >
        <div className='row'>
          <div className='col-md-2'>
          </div>
          <div className='col-md-8'>
            <h2> Create a Public Model </h2>
            <br/>
            <form onSubmit={this.onSubmit.bind(this)} className='ui form' ref='form'>
                <div className='field'>
                  <label>Name</label>
                  <input type="text" name="name"/>
                </div>

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
