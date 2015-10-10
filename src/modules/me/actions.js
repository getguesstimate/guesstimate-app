import Auth0Lock from 'auth0-lock'

export function createMe(profile, token) {
  return { type: 'CREATE_ME', object: {profile, token}};
}

export function logOut() {
  localStorage.setItem('userToken', null);
  return { type: 'DESTROY_ME' };
}

const Auth0Variables = {
  AUTH0_CLIENT_ID: 'By2xEUCPuGqeJZqAFMpBlgHRqpCZelj0',
  AUTH0_DOMAIN: 'guesstimate.auth0.com'
};

const lock = new Auth0Lock(
  Auth0Variables.AUTH0_CLIENT_ID,
  Auth0Variables.AUTH0_DOMAIN
);

export function signIn() {
  return function(dispatch) {
    lock.showSignin( (err, profile, token) => {
      if (err) {
        console.log("Error logging in")
      } else {
        // Save the JWT token.
        localStorage.setItem('userToken', token);
        dispatch(createMe(profile, token))
      }
    });
  }
}

export function signUp() {
  return function(dispatch) {
    lock.showSignup( (err, profile, token) => {
      if (err) {
        console.log("Error logging in")
      } else {
        // Success calback
        localStorage.setItem('userToken', token);
        dispatch(createMe(profile, token))
      }
    });
  }
}


export function init(profile, token) {
  return function(dispatch) {
    let token = localStorage.getItem('userToken')
    if (!_.isUndefined(token)) {
      lock.getProfile(token, (err, profile) => {
        if (err) {
          console.log("Error logging in")
        } else {
          dispatch(createMe(profile, token))
        }
      })
    }
  }
}
