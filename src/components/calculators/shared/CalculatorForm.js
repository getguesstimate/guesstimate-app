import React, {Component} from 'react'

import ReactMarkdown from 'react-markdown'
import Icon from 'react-fa'
import {sortable} from 'react-sortable'

import * as Calculator from 'gEngine/calculator'

const SortableListItem = sortable(props => <div {...props} className='list-item'>{props.item}</div>)

export class CalculatorForm extends Component {
  state = {
    draggingIndex: null,
    draggingMetricId: null,
    dropTargetId: null,
    hasAlreadySubmitted: false,
  }

  metricForm({metric: {name, id, guesstimate}, isVisible}, isInput, isDropTarget) {
    const props = {
      name,
      isDropTarget,
      description: _.get(guesstimate, 'description'),
      isVisible: isVisible,
      onRemove: this.props.onMetricHide.bind(this, id),
      onAdd: this.props.onMetricShow.bind(this, id),
    }
    if (isInput) {
      return <InputForm {...props}/>
    } else {
      return <OutputForm {...props}/>
    }
  }

  updateDragState(id, newState) {
    if (!this.state.draggingMetricId) {
      this.setState({...newState, draggingMetricId: id, dropTargetId: id})
    } else if (_.isNull(newState.draggingIndex)) {
      this.props.onMoveMetricTo(this.state.draggingMetricId, this.state.draggingIndex)
      this.setState({...newState, draggingMetricId: null, dropTargetId: null})
    } else {
      this.setState({...newState, dropTargetId: id})
    }
  }

  onSubmit() {
    if (this.state.hasAlreadySubmitted) { return }
    this.setState({hasAlreadySubmitted: true})
    this.props.onSubmit()
  }

  render() {
    const {
      props: {calculator: {title, content}, inputs, outputs, buttonText, isValid},
      state: {draggingIndex, dropTargetId, hasAlreadySubmitted}
    } = this

    const generateComponents = (metrics, isInput) => (
      _.map(metrics, (m, i) => [this.metricForm(m, isInput, dropTargetId === m.metric.id), m.metric.id])
    )

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

          {hasHiddenInputs &&
            <div>
              <div className='inputs'>
                <h3> Hidden Inputs </h3>
                {_.map(invisibleInputs, ([item, id], i) => item)}
              </div>
            </div>
          }

          <div className='outputs'>
            <h3> {`${hasHiddenOutputs ? "Visible " : ""}Outputs`} </h3>
            {_.map(visibleOutputs, ([item, id], i) => (
              <SortableListItem
                key = {i}
                sortId = {i}
                draggingIndex={draggingIndex}
                updateState={this.updateDragState.bind(this, id)}
                outline={'list'}
                items = {visibleOutputs}
                item = {item}
              />
            ))}

            {hasHiddenOutputs &&
              <div>
                <div className=' outputs'>
                  <h3> Hidden Outputs </h3>
                  {_.map(invisibleOutputs, ([item, id], i) => item)}
                </div>
              </div>
            }
          </div>
          <div className='create-button-section'>
            <div className='row'>
              <div className='col-md-5'>
                <div
                  className={`ui button green large create-button ${hasAlreadySubmitted ? 'loading' : ''} ${isValid && !hasAlreadySubmitted  ? '' : 'disabled'}`}
                  onClick={this.onSubmit.bind(this)}>
                  {buttonText}
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

const EditSection = ({isVisible, onRemove, onAdd}) => (
  <div className='nub'>
    {isVisible &&
      <div>
        <a onMouseDown={onRemove} className='ui button'>hide</a>
        <a className='ui button'><Icon name='bars' /></a>
      </div>
    }
    {!isVisible && <a onMouseDown={onAdd} className='ui button'>show</a> }
  </div>
)

const InputForm = props => (
  <div className={`input${props.isDropTarget ? ' drop-target': ''}`}>
    <div className='row'>
      <div className={`col-xs-12 col-sm-8`}>
        <div className='name'>{props.name}</div>
        {props.description && <div className='description'>{props.description}</div>}
      </div>
      <div className='col-xs-12 col-sm-4'>
        <EditSection {...props}/>
      </div>
    </div>
  </div>
)

const OutputForm = props => (
  <div className={`output${props.isDropTarget ? ' drop-target': ''}`}>
    <div className='row'>
      <div className={`col-xs-12 col-sm-8`}>
        <div className='name'>
          {props.name}
        </div>
      </div>
      <div className='col-xs-12 col-sm-4'>
        <EditSection {...props}/>
      </div>
    </div>
  </div>
)
