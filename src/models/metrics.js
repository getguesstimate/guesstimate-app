export default class InputToGuesstimate {
  constructor(input){
    this.input = input
  }
  toGuesstimate(){
    if (this.isFunction()) {
      return {funct: this.parseFunction()}
    } else if (this.isEstimate()) {
      return {estimate: this.parseEstimate()}
    } else {
      return {}
    }
  }
  toEditorState(){
    if (this.isFunction()){
      return 'function'
    } else if (this.isEstimate()){
      return 'estimate'
    } else {
      return 'editing'
    }
  }
  isFunction(){
    return this.input[0] === '=';
  }
  parseFunction(){
    return {textField: this.input}
  }
  isEstimate(){
    return this.parseEstimate() !== false
  }
  parseEstimate(){
    if (this.input.includes('/')){
      let [median, stdev] = this.input.split('/').map((e) => e.trim());
      return {median, stdev};
    } else {
      return false
    }
  }
}

class GuesstimateForm{
  constructor(state){

  }
  distribution(){

  }
}

class Metric{
  constructor(state){
  }
  update(values){
    this.state = Object.assign({}, this.state, values)
    if (values.form.guesstimate){
      this.updateGuesstimate(values.form.guesstimate);
    }
    return this
  }
  updateGuesstimate(guesstimateForm){
    this.state.distribution = new GuesstimateForm(guesstimateForm).distribution()
  }
}

export default class Metrics{
  constructor(state){
    this.state = _.cloneDeep(state)
  }
  remove(id){
    this.state = this.state.filter(function(i) {return i.id !== id})
    return this
  }
  get(id){
    return this.state.filter(function(i) {return i.id === id})[0]
  }
  add(values){
    let newModel = Object.assign({}, {name: '', value: ''}, values)
    this.state = [...this.state, newModel]
    return this
  }
  update(id, values){
    let newItem = Object.assign({}, this.get(id), values)
    return this.remove(id).add(newItem)
  }
}

