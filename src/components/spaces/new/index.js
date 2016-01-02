import React, {Component, PropTypes} from 'react'
import * as spaceActions from 'gModules/spaces/actions.js'
import { connect } from 'react-redux';
import {connectReduxForm} from 'redux-form';
import './style.css'

function validateContact(data) {
  const errors = {};
  if(!data.name) {
    errors.name = 'Required';
  }
  return errors;
}

class NewSpaceForm extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired
  }

  render() {
    const { fields: {name, address, phone}, handleSubmit, submitting } = this.props;
    return (
      <div className='SpaceNew' >
        <div className='row'>
          <div className='col-md-2'>
          </div>
          <div className='col-md-8'>
            <h2> Create a Public Model </h2>
            <br/>
            <form onSubmit={handleSubmit} className='ui form'>
                <div className='field'>
                  <label>Name</label>
                  <input type="text" {...name}/>
                  {name.error && name.touched && <div>{name.error}</div>}
                </div>

                <button type='submit' className='ui button primary' onClick={handleSubmit} disabled={submitting}>
                  {!submitting ? 'Create' : 'Submitting'}
                </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

NewSpaceForm = connectReduxForm({
  form: 'newSpace',
  fields: ['name'],
  validate: validateContact,
})(NewSpaceForm);

@connect()
export default class NewSpaceFormContainer extends Component{
  onSubmit(e) {
    this.props.dispatch(spaceActions.create(e))
  }
  render() {
    return ( <NewSpaceForm onSubmit={this.onSubmit.bind(this)}/>  )
  }
}
