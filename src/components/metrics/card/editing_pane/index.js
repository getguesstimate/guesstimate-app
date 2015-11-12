import React, {Component, PropTypes} from 'react'
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';
import GuesstimateForm from './guesstimate_form';
import ShowIf from 'gComponents/utility/showIf';
import Icon from 'react-fa'
import './style.css'
import DistributionModal from 'gComponents/distributions/editor/modal'

@ShowIf
export default class MetricEditingPane extends Component {
  static propTypes = {
    guesstimate: PropTypes.object.isRequired,
    guesstimateForm: PropTypes.object.isRequired,
    metricId: PropTypes.string.isRequired,
    onChangeGuesstimate: PropTypes.func,
  }

  _handlePress(e) {
    e.stopPropagation()
  }

  state = {modalIsOpen: false};

  openModal() {
     this.setState({modalIsOpen: true});
  }

  closeModal() {
     this.setState({modalIsOpen: false});
  }

  submitModal(guesstimate) {
    this.props.onChangeGuesstimate(guesstimate)
    this.setState({modalIsOpen: false});
  }

  componentWillUnmount() {
    const changedInput = (this.props.guesstimateForm.input !== this.props.guesstimate.input)
    if (this.hasTextInput() && changedInput) {
      this.props.onChangeGuesstimate(this.props.guesstimateForm)
    }
  }

  resetGuesstimate() {
    this.props.onChangeGuesstimate({})
  }

  hasTextInput() {
    const input = this.props.guesstimate.input
    return (_.isString(input) && input.length)
  }

  hasGraphicalInput() {
    return !!this.props.guesstimate.guesstimateType
  }

  render() {
    const hasGraphicalInput = this.hasGraphicalInput()
    return (
      <div className='metric-container editing-section' key={this.props.metricId}>
        <div className='row'>
          <div
              className='col-xs-8'
              onKeyDown={this._handlePress}
          >
          {hasGraphicalInput &&
            <div
                  className='ui button tinyhover-toggle primary'
                  onMouseDown={this.openModal.bind(this)}
                  ref='modalLink'
                  data-select='false'
            >
              <Icon name='bar-chart'/>
            </div>
          }
          {hasGraphicalInput &&
            <div
                  className='ui button tinyhover-toggle'
                  onMouseDown={this.resetGuesstimate.bind(this)}
            >
              <Icon name='close'/>
            </div>
          }
          {!hasGraphicalInput &&
            <GuesstimateForm
                guesstimate={this.props.guesstimate}
                guesstimateForm={this.props.guesstimateForm}
                metricFocus={this.props.metricFocus}
                metricId={this.props.metricId}
                onSubmit={this.props.onChangeGuesstimate}
                ref='form'
                value={this.props.guesstimate.input}
            />
          }
          </div>
          {!hasGraphicalInput &&
            <div className='col-xs-2'>
              <div
                    className='ui button tinyhover-toggle'
                    onMouseDown={this.openModal.bind(this)}
                    ref='modalLink'
                    data-select='false'
              >
                <Icon name='bar-chart'/>
              </div>
            </div>
          }
        </div>

      <DistributionModal
          closeModal={this.closeModal.bind(this)}
          guesstimate={this.props.guesstimate}
          isOpen={this.state.modalIsOpen}
          onSubmit={this.submitModal.bind(this)}
      />
    </div>
    )
  }
};

