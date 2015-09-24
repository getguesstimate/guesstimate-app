import FunctionForm from './function-form';
import NormalDistribution from '../lib/large/distributions/normal-distribution'

export class EstimateForm{
  constructor(state){
    this.state = state;
  }
  isValid(){
    return (this.toDistribution() !== false);
  }
  toDistribution(n=1){
    let coords = this.toCoords();
    if (coords.mean && coords.stdev) {
      let foo = new NormalDistribution(coords)
      let samples = foo.sample(n)
      coords.samples = samples
    }
    return coords
  }
  toCoords(){
    if (this.state.includes('/')){
      let [mean, stdev] = this.state.split('/').map((e) => parseFloat(e.trim()));
      return {mean, stdev};
    } else if (this.state.includes('+-')){
      let [mean, stdev] = this.state.split('+-').map((e) => parseFloat(e.trim()));
      return {mean, stdev};
    } else if (this.state.includes('-+')){
      let [mean, stdev] = this.state.split('+-').map((e) => parseFloat(e.trim()));
      return {mean, stdev};
    } else if (this.state.includes('->')){
      let [low, high] = this.state.split('->').map((e) => parseFloat(e.trim()));
      if (parseFloat(high) > parseFloat(low)){
        let mean = low + ((high - low) / 2);
        let stdev = (high-mean);
        return {mean, stdev};
      } else {
        return {mean: null, stdev:null, errors: ['Estimate: [low]->[high]: High must be greater than low. ']};
      }
    } else if (parseFloat(this.state.toString()).toString() === this.state){
      return {mean: this.state, stdev: 0};
    } else if (this.state == ''){
      return {mean: null, stdev: null};
    } else {
      return {mean: null, stdev:0, errors: ['Estimate: Could not parse. Use "/" or "->" symbols.']};
    }
  }
}

export default class GuesstimateForm{
  constructor(state, metrics = [], guesstimates = [], samples=0){
    this.metrics = metrics;
    this.state = state;
    this.guesstimates = guesstimates;
    this.guesstimate = this._guesstimate();
    this.samples = samples;
  }
  toJSON(n=0){
    return ({
      input: this.state,
      isValid: this._isValid(),
      distribution: this._toDistribution(n)
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
  _toDistribution(n=1){
    return this.guesstimate.toDistribution(n);
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
