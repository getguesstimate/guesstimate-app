import React, {Component} from 'react'
import ReactMarkdown from 'react-markdown'
import Icon from 'react-fa'
import * as Calculator from 'gEngine/calculator'

export class CalculatorNew extends Component {
  metricForm(items, item, index, isInput){
    const props = {
        ref: `input-${item.metric.id}`,
        key: index,
        name: item.metric.name,
        isFirst: index === 0,
        isLast: (index === items.length - 1),
        description: _.get(item.metric, 'guesstimate.description'),
        isVisible: item.isVisible,
        onRemove: () => {this.props.onMetricHide(item.metric.id)},
        onAdd: () => {this.props.onMetricShow(item.metric.id)},
        onMoveUp: () => {this.props.onMoveMetricUp(item.metric.id)},
        onMoveDown: () => {this.props.onMoveMetricDown(item.metric.id)},
    }
    if (isInput) {
      return (<InputForm {...props}/>)
    } else {
      return (<OutputForm {...props}/>)
    }
  }

  render() {
    const {calculator: {title, content}, inputs, outputs} = this.props
    const visibleInputs = inputs.filter(i => i.isVisible)
    const invisibleInputs = inputs.filter(i => !i.isVisible)
    const hasHiddenInputs = !_.isEmpty(invisibleInputs)

    const visibleOutputs = outputs.filter(i => i.isVisible)
    const invisibleOutputs = outputs.filter(i => !i.isVisible)
    const hasHiddenOutputs = !_.isEmpty(invisibleOutputs)

    return (
      <div className='calculator new'>
        <div className='padded-section'>
          <div className='ui form'>
            <h3>
              <textarea
                rows={1}
                placeholder={'Calculator Name'}
                value={title}
                onChange={this.props.onChangeName}
                className='field'
              />
            </h3>
            <textarea
              rows={3}
              placeholder={'Explanation (Markdown)'}
              value={content}
              onChange={this.props.onChangeContent}
              className='field'
            />
          </div>


        <div className='inputs'>
          <h3> {`${hasHiddenInputs ? "Visible " : ""}Inputs`} </h3>
          {_.map(visibleInputs, (input, i) => (
            this.metricForm(visibleInputs, input,i, true)
          ))}
        </div>

        {hasHiddenInputs &&
          <div>
            <div className='inputs'>
              <h3> Hidden Inputs </h3>
              {_.map(invisibleInputs, (input, i) => (
                this.metricForm(invisibleInputs, input,i, true)
              ))}
            </div>
          </div>
          }


          <div className='outputs'>
            <h3> {`${hasHiddenOutputs ? "Visible " : ""}Outputs`} </h3>

            {_.map(visibleOutputs, (input, i) => (
              this.metricForm(visibleOutputs, input, i, false)
            ))}

            {hasHiddenOutputs &&
              <div>
                <div className=' outputs'>
                  <h3> Hidden Outputs </h3>
                  {_.map(invisibleOutputs, (input, i) => (
                    this.metricForm(invisibleOutputs, input, i, false)
                    )
                  )}
                </div>
              </div>
            }
          </div>
          <div className='create-button-section'>
            <div className='row'>
              <div className='col-md-5'>
                <div
                  className={`ui button green large create-button ${this.props.isValid ? '' : 'disabled'}`}
                  onClick={this.props.onSubmit}>
                  Create
                </div>
              </div>
              <div className='col-md-7' />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export const EditSection = ({isFirst, isLast, isVisible, onRemove, onAdd, onMoveUp, onMoveDown}) => (
  <div className='nub'>
    {isVisible &&
      <div>
        <a onMouseDown={onRemove} className='ui button'>hide</a>
        {!isFirst && <a onMouseDown={onMoveUp} className='ui button'><Icon name='chevron-up'/></a>}
        {!isLast && <a onMouseDown={onMoveDown} className='ui button'><Icon name='chevron-down'/></a>}
      </div>
    }
    {!isVisible &&
      <a onMouseDown={onAdd} className='ui button'>show</a>
    }
  </div>
)

export class InputForm extends Component{
  render () {
    const {name, description} = this.props
    return (
      <div className='input'>
        <div className='row'>
          <div className='col-xs-12 col-sm-7'>
            <div className='name'>{name}</div>
            {description &&
              <div className='description'>{description}</div>
            }
          </div>
          <div className='col-xs-12 col-sm-5'>
            <EditSection {...this.props}/>
          </div>
        </div>
      </div>
    )
  }
}

export const OutputForm = (props) => {
  return (
    <div className='output'>
      <div className='row'>
        <div className='col-xs-12 col-sm-7'>
          <div className='name'>
            {props.name}
          </div>
        </div>
        <div className='col-xs-12 col-sm-5'>
            <EditSection {...props}/>
        </div>
      </div>
    </div>
  )
}
