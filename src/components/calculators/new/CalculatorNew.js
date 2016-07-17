import React, {Component} from 'react'

import ReactMarkdown from 'react-markdown'
import Icon from 'react-fa'
import {Sortable} from 'react-sortable'

import * as Calculator from 'gEngine/calculator'

const SortableListItem = Sortable(props => <div {...props} className='list-item'>{props.item}</div>)

export class CalculatorNew extends Component {
  state = {
    draggingIndex: null,
    draggingMetricId: null,
    dropTargetId: null,
  }

  metricForm({metric: {name, id, guesstimate}, isVisible}, isFirst, isLast, isInput) {
    const props = {
      name,
      isFirst,
      isLast,
      description: _.get(guesstimate, 'description'),
      isVisible: isVisible,
      onRemove: this.props.onMetricHide.bind(this, id),
      onAdd: this.props.onMetricShow.bind(this, id),
      onMoveUp: this.props.onMoveMetricUp.bind(this, id),
      onMoveDown: this.props.onMoveMetricDown.bind(this, id),
    }
    if (isInput) {
      return <InputForm {...props}/>
    } else {
      return <OutputForm {...props}/>
    }
  }

  updateDragState(id, newState) {
    if (!this.state.draggingMetricId) {
      this.setState({...newState, draggingMetricId: id, dropTargetId: null})
    } else if (_.isNull(newState.draggingIndex)) {
      this.props.onMoveMetricTo(this.state.draggingMetricId, this.state.draggingIndex)
      this.setState({...newState, draggingMetricId: null, dropTargetId: null})
    } else {
      this.setState({...newState, dropTargetId: id})
    }
  }

  componentDidUpdate() {
    //console.log(this.state.draggingMetricId, this.state.dropTargetId, this.state.draggingIndex)
  }

  render() {
    const [{calculator: {title, content}, inputs, outputs}, {draggingIndex}] = [this.props, this.state]

    const generateComponents = (metrics, isInput) => _.map(metrics, (m, i) => [this.metricForm(m, i === 0, i === metrics.length -1, isInput), m.metric.id])

    const visibleInputs = generateComponents(inputs.filter(i => i.isVisible), true)
    const invisibleInputs = generateComponents(inputs.filter(i => !i.isVisible), true)
    const hasHiddenInputs = !_.isEmpty(invisibleInputs)

    const visibleOutputs = generateComponents(outputs.filter(o => o.isVisible), false)
    const invisibleOutputs = generateComponents(outputs.filter(o => !o.isVisible), false)
    const hasHiddenOutputs = !_.isEmpty(invisibleOutputs)

    return (
      <div className='calculator narrow'>
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
          {_.map(visibleInputs, ([item, id], i) => (
            <SortableListItem
              key = {i}
              sortId = {i}
              draggingIndex={draggingIndex}
              updateState={this.updateDragState.bind(this, id)}
              outline={'list'}
              items = {visibleInputs}
              item = {item}
            />
          ))}
        </div>

        {false && hasHiddenInputs &&
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

            {false && _.map(visibleOutputs, (input, i) => (
              this.metricForm(visibleOutputs, input, i, false)
            ))}

            {false && hasHiddenOutputs &&
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
