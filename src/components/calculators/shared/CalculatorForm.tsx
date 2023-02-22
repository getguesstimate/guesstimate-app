import _ from "lodash";
import React, { PropsWithChildren, useState } from "react";

import clsx from "clsx";
import { sortable } from "react-sortable";
import Icon from "~/components/react-fa-patched";
import { FullDenormalizedMetric } from "~/lib/engine/space";
import { Optional } from "~/lib/engine/types";
import { Calculator } from "~/modules/calculators/reducer";

const Header: React.FC<PropsWithChildren> = ({ children }) => (
  <h3 className="border-b-2 border-[#aaa] pb-1 !mt-10 text-bold text-lg">
    {children}
  </h3>
);

const List: React.FC<PropsWithChildren> = ({ children }) => (
  <div className="space-y-1">{children}</div>
);

const EditButton: React.FC<PropsWithChildren<{ onMouseDown(): void }>> = ({
  children,
  onMouseDown,
}) => (
  <div
    onMouseDown={onMouseDown}
    className="bg-grey-7 text-lato text-grey-666 px-2 py-1 rounded text-xs font-bold cursor-pointer"
  >
    {children}
  </div>
);

type ParamProps = {
  name: string | undefined;
  description: string | undefined;
  isDropTarget: boolean;
  isVisible: boolean;
  onRemove(): void;
  onAdd(): void;
};

const EditSection: React.FC<ParamProps> = ({ isVisible, onRemove, onAdd }) => (
  <div>
    {isVisible ? (
      <div className="flex gap-1">
        <EditButton onMouseDown={onRemove}>hide</EditButton>
        <EditButton onMouseDown={() => {}}>
          <Icon name="bars" />
        </EditButton>
      </div>
    ) : (
      <EditButton onMouseDown={onAdd}>show</EditButton>
    )}
  </div>
);

const InputForm: React.FC<ParamProps> = (props) => (
  <div className={clsx(props.isDropTarget && "bg-grey-1")}>
    <div className="flex justify-between">
      <div>
        <div className="name">{props.name}</div>
        {props.description && (
          <div className="text-xs mt-4 mb-8 text-grey-666">
            {props.description}
          </div>
        )}
      </div>
      <div>
        <EditSection {...props} />
      </div>
    </div>
  </div>
);

const OutputForm: React.FC<ParamProps> = (props) => (
  <div className={clsx(props.isDropTarget && "bg-grey-1")}>
    <div className="flex justify-between">
      <div>
        <div className="name">{props.name}</div>
      </div>
      <div>
        <EditSection {...props} />
      </div>
    </div>
  </div>
);

const SortableListItem = sortable((props) => (
  <div {...props}>{props.children}</div>
));

type CalculatorParam = {
  metric: FullDenormalizedMetric;
  isVisible: boolean;
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
    <div>
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

      {/* inputs */}
      <div>
        <Header>{hasHiddenInputs ? "Visible " : ""}Inputs</Header>
        <List>
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
        </List>
      </div>

      {hasHiddenInputs && (
        <div>
          <Header>Hidden Inputs</Header>
          <List>{invisibleInputs.map(([item]) => item)}</List>
        </div>
      )}

      {/* outputs */}
      <div>
        <Header>{hasHiddenOutputs ? "Visible " : ""}Outputs</Header>
        <List>
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
        </List>
      </div>

      {hasHiddenOutputs && (
        <div>
          <Header>Hidden Outputs</Header>
          <List>{invisibleOutputs.map(([item]) => item)}</List>
        </div>
      )}

      <div className="flex justify-end mt-4">
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
    </div>
  );
};
