import React, {Component, PropTypes} from 'react'
import Icon from 'react-fa'
import $ from 'jquery'

const PT = PropTypes;

export default class RangeForm extends Component {
  static propTypes = {
    distributionType: PT.object.isRequired,
    onChange: PT.func.isRequired,
  }

  values() {
    let results = {}
    $(this.refs.el).find('input').map(function() { results[this.name] = $(this).val() })
    return results
  }
  onChange() {
    this.props.onChange(this.values())
  }
  render() {
    const hasTails = (this.props.distributionType.name !== 'uniform')
    return (
      <div className='RangeForm' ref='el'>
        <div className='row primary'>
          <div className='col-sm-5'>
            <div className='field'>
              <input
                  name='low'
                  onChange={this.onChange.bind(this)}
                  placeholder='low'
                  ref='low'
                  type='text'
              />
              {hasTails &&
                <label> {'10th Percentile'} </label>
              }
            </div>
          </div>
          <div className='col-sm-2 arrow'>
            <Icon name='arrow-circle-right'/>
          </div>
          <div className='col-sm-5'>
            <div className='field'>
              <input
                  name='high'
                  onChange={this.onChange.bind(this)}
                  placeholder='high'
                  ref='high'
                  type='text'
              />
              {hasTails &&
                <label> {'90th Percentile'} </label>
              }
            </div>
          </div>
        </div>

        <div className='row secondary'>
          <div className='col-sm-4'>
            <div className='field'>
              <label> {'Precision'} </label>
              <input
                  name='precision'
                  onChange={this.onChange.bind(this)}
                  ref='precision'
                  type='text'
                  value='0.01'
              />
            </div>
          </div>

          {hasTails &&
            <div className='col-sm-4'>
              <div className='field'>
                <label> {'Minimum'} </label>
                <input
                    name='minimum'
                    onChange={this.onChange.bind(this)}
                    ref='minimum'
                    type='text'
                />
              </div>
            </div>
          }

          {hasTails &&
            <div className='col-sm-4'>
              <div className='field'>
                <label> {'Maximum'} </label>
                <input
                    name='maximum'
                    onChange={this.onChange.bind(this)}
                    ref='maximum'
                    type='text'
                />
              </div>
            </div>
          }
        </div>
      </div>
    )
  }
}
