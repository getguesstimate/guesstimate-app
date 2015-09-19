import GuesstimateForm from './guesstimate-form.js';

class Guesstimate {
  constructor(state, metrics = []){
    this.state = state;
    this.metric = metrics;
    this.guesstimateForm = new GuesstimateForm(this.state.input, metrics);
    return this;
  }
  changeInput(input){
    this.state = new GuesstimateForm(input, this.metrics).toJSON();
    return this;
  }
  isValid(){
    return this.guesstimateForm.isValid();
  }
}
