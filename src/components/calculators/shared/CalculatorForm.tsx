import _ from "lodash";
import React, { Component, useState } from "react";

import Icon from "~/components/react-fa-patched";
import { sortable } from "react-sortable";
import { FullDenormalizedMetric } from "~/lib/engine/space";
import { Calculator } from "~/modules/calculators/reducer";
import { Optional } from "~/lib/engine/types";
import clsx from "clsx";

const SortableListItem = sortable((props) => (
  <div {...props}>{props.children}</div>
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
  dropTargetId: string | null;
};

export const CalculatorForm: React.FC<Props> = (props) => {
  const [hasAlreadySubmitted, setHasAlreadySubmitted] = useState(false);
  const [state, setState] = useState<State>({
    draggingIndex: null,
    draggingMetricId: null,
    dropTargetId: null,
  });

  const {
    calculator: { title, content },
    inputs,
    outputs,
    buttonText,
    isValid,
  } = props;
  const { draggingIndex, dropTargetId } = state;

  const updateDragState = (id: string, newState) => {
    if (!state.draggingMetricId) {
      setState({
        ...state,
        ...newState,
        draggingMetricId: id,
        dropTargetId: id,
      });
    } else if (_.isNull(newState.draggingIndex)) {
      props.onMoveMetricTo(
        state.draggingMetricId,
        state.draggingIndex as any // bad casting, but sorting is broken anyway
      );
      setState({
        ...state,
        ...newState,
        draggingMetricId: null,
        dropTargetId: null,
      });
    } else {
      setState({ ...state, ...newState, dropTargetId: id });
    }
  };

  const handleSubmit = () => {
    if (hasAlreadySubmitted) {
      return;
    }
    setHasAlreadySubmitted(true);
    props.onSubmit();
  };

  const metricForm = (
    { metric: { name, id, guesstimate }, isVisible }: CalculatorParam,
    isInput: boolean,
    isDropTarget: boolean
  ) => {
    const formProps: ParamProps = {
      name,
      isDropTarget,
      description: guesstimate.description,
      isVisible,
      onRemove: props.onMetricHide.bind(this, id),
      onAdd: props.onMetricShow.bind(this, id),
    };
    if (isInput) {
      return <InputForm {...formProps} />;
    } else {
      return <OutputForm {...formProps} />;
    }
  };

  const generateComponents = (metrics: CalculatorParam[], isInput: boolean) =>
    metrics.map(
      (m, i) =>
        [
          metricForm(m, isInput, dropTargetId === m.metric.id),
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
  const hasHiddenOutputs = invisibleOutputs.length > 0;

  return (
    <div className="calculator narrow p-4">
      <div className="ui form">
        <h3>
          <textarea
            rows={1}
            placeholder="Calculator Name"
            value={title}
            onChange={props.onChangeName}
            className="field"
          />
        </h3>
        <textarea
          rows={3}
          placeholder="Explanation (Markdown)"
          value={content}
          onChange={props.onChangeContent}
          className="field"
        />
      </div>

      <div className="inputs">
        <h3>{hasHiddenInputs ? "Visible " : ""}Inputs</h3>
        {visibleInputs.map(([item, id], i) => (
          <SortableListItem
            key={i}
            sortId={i}
            draggingIndex={draggingIndex}
            updateState={(s) => updateDragState(id, s)}
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
            {invisibleInputs.map(([item]) => item)}
          </div>
        </div>
      )}

      <div className="outputs">
        <h3>{hasHiddenOutputs ? "Visible " : ""}Outputs</h3>
        {visibleOutputs.map(([item, id], i) => (
          <SortableListItem
            key={i}
            sortId={i}
            draggingIndex={draggingIndex}
            updateState={(s) => updateDragState(id, s)}
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
              {invisibleOutputs.map(([item]) => item)}
            </div>
          </div>
        )}
      </div>
      <div className="create-button-section">
        <div className="row">
          <div className="col-md-5">
            <div
              className={clsx(
                "ui button green large",
                hasAlreadySubmitted && "loading",
                (!isValid || hasAlreadySubmitted) && "disabled"
              )}
              onClick={handleSubmit}
            >
              {buttonText}
            </div>
          </div>
          <div className="col-md-7" />
        </div>
      </div>
    </div>
  );
};

const EditSection: React.FC<ParamProps> = ({ isVisible, onRemove, onAdd }) => (
  <div className="nub">
    {isVisible ? (
      <div>
        <a onMouseDown={onRemove} className="ui button">
          hide
        </a>
        <a className="ui button">
          <Icon name="bars" />
        </a>
      </div>
    ) : (
      <a onMouseDown={onAdd} className="ui button">
        show
      </a>
    )}
  </div>
);

const InputForm: React.FC<ParamProps> = (props) => (
  <div className={clsx("input", props.isDropTarget && "bg-grey-1")}>
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
  <div className={clsx("output", props.isDropTarget && "bg-grey-1")}>
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
