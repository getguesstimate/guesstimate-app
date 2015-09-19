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

let validName = (m) => { return m.state.name.length < 3; };
let validGuesstimate = (m) => { return m._guesstimate().isValid(); };

export default class Metric{
  static create(id, location){
    return new this()._create(id, location);
  }
  constructor(state = {}, metrics = []){
    this.state = state;
    this.metrics = metrics;
    return this;
  }
  changeName(name){
    this.state.name = name;
    this._changeReadableId();
    this._validate();
  }
  changeGuesstimateInput(input){
    this.state.guesstimate = this._guesstimate().changeInput(input).state;
  }
  _create(id, location={row: null, column: null}){
    this.state = Object.assign({}, this._defaults(), {id, location});
    return this;
  }
  _defaults(){
    return {
      id: null,
      readableId: '',
      name: '',
      isValid: false,
      guesstimate: {
        input: '',
        distribution: {}
      },
      location: {row: null, column: null}
    };
  }
  _validate(){
    this.state._isValid = this._isValid();
  }
  _isValid(){
    return validName(this);
  }
  _guesstimate(){
     return new Guesstimate(this.state.guesstimate, this.metrics);
  }
  _changeReadableId() {
    if (this.state.readableId === '' && (this.state.name.length >= 3)){
      this.state.readableId = this._createReadableId();
    }
  }
  _createReadableId(){
    return this.state.name.substring(0,3).toUpperCase();
  }
}
