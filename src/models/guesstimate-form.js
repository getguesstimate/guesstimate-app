import FunctionForm from './function-form';

export class EstimateForm{
  constructor(state){
    this.state = state;
  }
  isValid(){
    return (this.toDistribution() !== false);
  }
  toDistribution(){
    if (this.state.includes('/')){
      let [mean, stdev] = this.state.split('/').map((e) => parseFloat(e.trim()));
      return {mean, stdev};
    } else if (this.state.includes('->')){
      let [low, high] = this.state.split('->').map((e) => parseFloat(e.trim()));
      if (parseFloat(high) > parseFloat(low)){
        let mean = low + ((high - low) / 2)
        let stdev = (high-mean)
        return {mean, stdev};
      } else {
        return {mean: null, stdev:0}
      }
    } else if (parseFloat(this.state.toString()).toString() === this.state){
      return {mean: this.state, stdev: 0};
    } else {
      return {mean: null, stdev: 0}
    }
  }
}

export default class GuesstimateForm{
  constructor(state, metrics = [], guesstimates = []){
    this.metrics = metrics;
    this.state = state;
    this.guesstimates = guesstimates;
    this.guesstimate = this._guesstimate();
  }
  toJSON(){
    return ({
      input: this.state,
      isValid: this._isValid(),
      distribution: this._toDistribution()
    });
  }
  _isFunction(){
    return (this.state[0] === '=');
  }
  _isEstimate(){
    return !this._isFunction();
  }
  _guesstimate(){
    if (this._isFunction()) {
      return new FunctionForm(this.state, this.metrics, this.guesstimates);
    } else if (this._isEstimate) {
      return new EstimateForm(this.state);
    }
  }
  _toDistribution(){
    return this.guesstimate.toDistribution();
  }
  _isValid(){
    return this.guesstimate.isValid();
  }
  toEditorState(){
    if (this._isFunction()){
      return 'function';
    } else if (this._isEstimate()){
      return 'estimate';
    } else {
      return 'editing';
    }
  }
}
