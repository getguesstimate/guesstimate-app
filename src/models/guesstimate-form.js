import FunctionForm from './function-form';

class EstimateForm{
  constructor(state){
    this.state = state;
  }
  isValid(){
    return (this.toGuesstimate() !== false);
  }
  toGuesstimate(){
    if (this.state.includes('/')){
      let [median, stdev] = this.state.split('/').map((e) => parseFloat(e.trim()));
      return {estimate: {median, stdev}};
    } else {
      return false;
    }
  }
}

export default class GuesstimateForm{
  constructor(state, metrics){
    this.metrics = metrics;
    this.state = state;
    this.funct = new FunctionForm(state, metrics);
    this.estimate = new EstimateForm(state);
  }
  isFunction(){
    return (this.state[0] === '=');
  }
  isEstimate(){
    return !this.isFunction();
  }
  toGuesstimate(){
    if (this.isFunction()) {
      return this.funct.toGuesstimate();
    } else if (this.isEstimate) {
      return this.estimate.toGuesstimate();
    } else {
      return {};
    }
  }
  toEditorState(){
    if (this.isFunction()){
      return 'function';
    } else if (this.isEstimate()){
      return 'estimate';
    } else {
      return 'editing';
    }
  }
}
