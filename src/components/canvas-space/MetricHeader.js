/* @flow */

import React, {Component, PropTypes} from 'react';
import Input from 'react-bootstrap/lib/Input'
import ShowIf from '../utility/showIf';

const MetricReadableIdd = ({readableId}) => (
  <div className='col-sm-1 function-id'>
    {readableId}
  </div>
)
const MetricReadableId = ShowIf(MetricReadableIdd)

// Note that this is now obsolete
class BasicInput extends Component {
  displayName: 'BasicInput'
  static propTypes = {
    name: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string,
  }

  state = {value: this.props.value || ''}

  componentWillUnmount() {
    this._handleSubmit();
  }
  _handleChange() {
    this.setState({ value: this.refs.input.getValue()});
  }
  _handleBlur(){
    this._handleSubmit();
  }
  _handleSubmit(){
    if (this.props.value !== this.state.value){
      let values = {};
      values[this.props.name] = this.state.value;
      this.props.onChange(values);
    }
  }
  render() {
    return (
      <div>
        <Input
            name={this.props.name}
            onBlur={this._handleBlur.bind(this)}
            onChange={this._handleChange.bind(this)}
            placeholder={this.props.name}
            ref='input'
            tabIndex={2}
            type='text'
            value={this.state.value}
        />
    </div>
    )
  }
};

class MetricHeader extends Component {
  displayName: 'BasicInput'
  static propTypes = {
    anotherFunctionSelected: PropTypes.bool,
    metric: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  }
  render () {
    let {anotherFunctionSelected, metric} = this.props
    return (
     <div className='row'>
       <div className={anotherFunctionSelected ? 'col-sm-9 name' : 'col-sm-12 name'}>
         <BasicInput
             name={'name'}
             onChange={this.props.onChange}
             value={metric.name}
         />
       </div>
       <MetricReadableId
           readableId={metric.readableId}
           showIf={anotherFunctionSelected}
       />
     </div>
    )
  }
}

export default MetricHeader
