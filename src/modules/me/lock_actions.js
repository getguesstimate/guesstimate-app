

class LockActor {
  static signIn() {
    return (dispatch, getState) => new LockActor(dispatch, getState).signIp()
  }

  static signUp() {
    return (dispatch, getState) => new LockActor(dispatch, getState).signUp()
  }

  static pageLoad() {
    return (dispatch, getState) => {
      let token = localStorage.getItem('userToken')
      if (token !== null) {
        (new LockActor(dispatch, getState, token)).getProfile()
      }
    }
  }

  constructor(dispatch, getState, token=null){
    this.dispatch = dispatch
    this.getState = getState
    this.token = token || null
    this.lock = this.makeLock()
  }

  makeLock() {
    return new Auth0Lock(
      Auth0Variables.AUTH0_CLIENT_ID,
      Auth0Variables.AUTH0_DOMAIN
    );
  }

  signIn() {
    this.lock.showSignin(this._execute)
  }

  signUp() {
    this.lock.showSignUp(this._execute)
  }

  getProfile() {
    this.lock.getProfile(this.token, this._execute)
  }

  _execute(err, profile, token=3) {
    if (err) {
      console.log("Error logging in")
    } else {
      dispatch(createMe(profile, token))
      me.localStorage.set(getState().me)
    }
  }
}

