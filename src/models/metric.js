import GuesstimateForm from './guesstimate-form.js';

class Guesstimate {
  constructor(state, metrics = []){
    this.state = state;
    this.metric = metrics;
  }
  guesstimateForm(){
    return new GuesstimateForm(this.state.input, metrics);
  }
  updateInput(){
    this.state.distribution = this.guesstimateForm.distribution();
  }
  isValid(){
    return this.guesstimateForm.isValid();
  }
}

class Metric{
  constructor(state, metrics = []){
    this.state = state;
    this.metrics = metrics;
  }
  create(id, location){
    this.state = {
      id: id,
      readableId: '',
      name: '',
      isValid: false,
      guesstimate: {
        input: '',
        distribution: {}
      },
      location
    };
  }
  updateName(name){
    this.state.name = name;
    this._updateReadableId();
    this.validate();
  }
  updateGuesstimateInput(input){
    let guesstimate = new Guesstimate(this.state.guesstimate, this.metrics);
  }
  _validate(){
    this.state._isValid = this.isValid();
  }
  _isValid(){
    return true;
  }
  _updateReadableId(){
    if (this.state.readableId === '' && (this.state.name.length > 3)){
      this.state.readableId = this.state.name.substring(0,3).toUpperCase();
    }
  }
}
