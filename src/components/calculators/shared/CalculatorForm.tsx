import _ from "lodash";
import React, { Component } from "react";

import Icon from "~/components/react-fa-patched";
import { sortable } from "react-sortable";
import { FullDenormalizedMetric } from "~/lib/engine/space";
import { Calculator } from "~/modules/calculators/reducer";
import { Optional } from "~/lib/engine/types";

const SortableListItem = sortable((props) => (
  <div {...props} className="list-item">
    {props.children}
  </div>
));

type CalculatorParam = {
  metric: FullDenormalizedMetric;
  isVisible: boolean;
};

type ParamProps = {
  name: string | undefined;
  description: string | undefined;
  isDropTarget: boolean;
  isVisible: boolean;
  onRemove(): void;
  onAdd(): void;
};

type Props = {
  calculator: Optional<Calculator, "id">;
  inputs: CalculatorParam[];
  outputs: CalculatorParam[];
  onMetricHide(id: string): void;
  onMetricShow(id: string): void;
  onMoveMetricTo(id: string, destIndex: number): void;
  onChangeName(e: React.ChangeEvent): void;
  onChangeContent(e: React.ChangeEvent): void;
  onSubmit(): void;
  isValid: boolean;
  buttonText: string;
};

type State = {
  draggingIndex: number | null;
  draggingMetricId: string | null;
  dropTargetId: number | null;
  hasAlreadySubmitted: boolean;
};

export class CalculatorForm extends Component<Props, State> {
  state = {
    draggingIndex: null,
    draggingMetricId: null,
    dropTargetId: null,
    hasAlreadySubmitted: false,
  };

  metricForm(
    { metric: { name, id, guesstimate }, isVisible }: CalculatorParam,
    isInput: boolean,
    isDropTarget: boolean
  ) {
    const props: ParamProps = {
      name,
      isDropTarget,
      description: _.get(guesstimate, "description"),
      isVisible,
      onRemove: this.props.onMetricHide.bind(this, id),
      onAdd: this.props.onMetricShow.bind(this, id),
    };
    if (isInput) {
      return <InputForm {...props} />;
    } else {
      return <OutputForm {...props} />;
    }
  }

  updateDragState(id: string, newState) {
    if (!this.state.draggingMetricId) {
      this.setState({ ...newState, draggingMetricId: id, dropTargetId: id });
    } else if (_.isNull(newState.draggingIndex)) {
      this.props.onMoveMetricTo(
        this.state.draggingMetricId,
        this.state.draggingIndex as any // bad casting, but sorting is broken anyway
      );
      this.setState({
        ...newState,
        draggingMetricId: null,
        dropTargetId: null,
      });
    } else {
      this.setState({ ...newState, dropTargetId: id });
    }
  }

  onSubmit() {
    if (this.state.hasAlreadySubmitted) {
      return;
    }
    this.setState({ hasAlreadySubmitted: true });
    this.props.onSubmit();
  }

  render() {
    const {
      props: {
        calculator: { title, content },
        inputs,
        outputs,
        buttonText,
        isValid,
      },
      state: { draggingIndex, dropTargetId, hasAlreadySubmitted },
    } = this;

    const generateComponents = (metrics: CalculatorParam[], isInput: boolean) =>
      metrics.map(
        (m, i) =>
          [
            this.metricForm(m, isInput, dropTargetId === m.metric.id),
            m.metric.id,
          ] as const
      );

    const visibleInputs = generateComponents(
      inputs.filter((i) => i.isVisible),
      true
    );
    const invisibleInputs = generateComponents(
      inputs.filter((i) => !i.isVisible),
      true
    );
    const hasHiddenInputs = !_.isEmpty(invisibleInputs);

    const visibleOutputs = generateComponents(
      outputs.filter((o) => o.isVisible),
      false
    );
    const invisibleOutputs = generateComponents(
      outputs.filter((o) => !o.isVisible),
      false
    );
    const hasHiddenOutputs = !_.isEmpty(invisibleOutputs);

    return (
      <div className="calculator narrow">
        <div className="padded-section">
          <div className="ui form">
            <h3>
              <textarea
                rows={1}
                placeholder="Calculator Name"
                value={title}
                onChange={this.props.onChangeName}
                className="field"
              />
            </h3>
            <textarea
              rows={3}
              placeholder="Explanation (Markdown)"
              value={content}
              onChange={this.props.onChangeContent}
              className="field"
            />
          </div>

          <div className="inputs">
            <h3> {`${hasHiddenInputs ? "Visible " : ""}Inputs`} </h3>
            {visibleInputs.map(([item, id], i) => (
              <SortableListItem
                key={i}
                sortId={i}
                draggingIndex={draggingIndex}
                updateState={this.updateDragState.bind(this, id)}
                outline="list"
                items={visibleInputs}
                onSortItems={() => undefined} // broken
              >
                {item}
              </SortableListItem>
            ))}
          </div>

          {hasHiddenInputs && (
            <div>
              <div className="inputs">
                <h3>Hidden Inputs</h3>
                {invisibleInputs.map(([item, id], i) => item)}
              </div>
            </div>
          )}

          <div className="outputs">
            <h3> {`${hasHiddenOutputs ? "Visible " : ""}Outputs`} </h3>
            {visibleOutputs.map(([item, id], i) => (
              <SortableListItem
                key={i}
                sortId={i}
                draggingIndex={draggingIndex}
                updateState={this.updateDragState.bind(this, id)}
                outline="list"
                items={visibleOutputs}
                onSortItems={() => undefined} // broken
              >
                {item}
              </SortableListItem>
            ))}

            {hasHiddenOutputs && (
              <div>
                <div className="outputs">
                  <h3>Hidden Outputs</h3>
                  {invisibleOutputs.map(([item, id], i) => item)}
                </div>
              </div>
            )}
          </div>
          <div className="create-button-section">
            <div className="row">
              <div className="col-md-5">
                <div
                  className={`ui button green large create-button ${
                    hasAlreadySubmitted ? "loading" : ""
                  } ${isValid && !hasAlreadySubmitted ? "" : "disabled"}`}
                  onClick={this.onSubmit.bind(this)}
                >
                  {buttonText}
                </div>
              </div>
              <div className="col-md-7" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const EditSection: React.FC<ParamProps> = ({ isVisible, onRemove, onAdd }) => (
  <div className="nub">
    {isVisible && (
      <div>
        <a onMouseDown={onRemove} className="ui button">
          hide
        </a>
        <a className="ui button">
          <Icon name="bars" />
        </a>
      </div>
    )}
    {!isVisible && (
      <a onMouseDown={onAdd} className="ui button">
        show
      </a>
    )}
  </div>
);

const InputForm: React.FC<ParamProps> = (props) => (
  <div className={`input${props.isDropTarget ? " drop-target" : ""}`}>
    <div className="row">
      <div className="col-xs-12 col-sm-8">
        <div className="name">{props.name}</div>
        {props.description && (
          <div className="description">{props.description}</div>
        )}
      </div>
      <div className="col-xs-12 col-sm-4">
        <EditSection {...props} />
      </div>
    </div>
  </div>
);

const OutputForm: React.FC<ParamProps> = (props) => (
  <div className={`output${props.isDropTarget ? " drop-target" : ""}`}>
    <div className="row">
      <div className="col-xs-12 col-sm-8">
        <div className="name">{props.name}</div>
      </div>
      <div className="col-xs-12 col-sm-4">
        <EditSection {...props} />
      </div>
    </div>
  </div>
);
