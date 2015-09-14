import React, {Component, PropTypes} from 'react';
import {connectReduxForm} from 'redux-form';

class ContactForm extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired
  }

  render() {
    const { fields: {name, address, phone}, handleSubmit } = this.props;
    let form1 = name.error && name.touched ? name.error : ''
    return (
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input type="text" {...name}/>
        <div>{form1}</div>

        <label>Address</label>
        <input type="text" {...address}/>

        <label>Phone</label>
        <input type="text" {...phone}/>

        <button onClick={handleSubmit}>Submit</button>
      </form>
    );
  }
}

function validateContact(data) {
  const errors = {};
  if(!data.name) {
    errors.name = 'Required';
  }
  if(data.address && data.address.length > 50) {
    errors.address = 'Must be fewer than 50 characters';
  }
  if(!data.phone) {
    errors.phone = 'Required';
  } else if(!/\d{3}-\d{3}-\d{4}/.test(data.phone)) {
    errors.phone = 'Phone must match the form "999-999-9999"'
  }
  return errors;
}

// apply connectReduxForm() and include synchronous validation
let ContactFormm = connectReduxForm({
  form: 'contact',                      // the name of your form and the key to
                                        // where your form's state will be mounted
  fields: ['name', 'address', 'phone'], // a list of all your fields in your form
  validate: validateContact             // a synchronous validation function
})(ContactForm);

// export the wrapped component
export default ContactFormm
