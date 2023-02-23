import _ from "lodash";
import React, { PropsWithChildren, useState } from "react";

import clsx from "clsx";
import { sortable } from "react-sortable";
import Icon from "~/components/react-fa-patched";
import { FullDenormalizedMetric } from "~/lib/engine/space";
import { Optional } from "~/lib/engine/types";
import { Calculator } from "~/modules/calculators/reducer";
import { Button } from "~/components/utility/buttons/button";
import { Textarea } from "~/components/utility/forms";

const Header: React.FC<PropsWithChildren> = ({ children }) => (
  <header className="mb-2 border-b-2 border-[#aaa] pb-1 text-lg font-bold">
    {children}
  </header>
);

const List: React.FC<PropsWithChildren> = ({ children }) => (
  <div className="space-y-1">{children}</div>
);

const Section: React.FC<PropsWithChildren<{ title: string }>> = ({
  title,
  children,
}) => (
  <section className="mt-10">
    <Header>{title}</Header>
    {children}
  </section>
);

const EditButton: React.FC<PropsWithChildren<{ onMouseDown(): void }>> = ({
  children,
  onMouseDown,
}) => (
  <div
    onMouseDown={onMouseDown}
    className="text-lato cursor-pointer rounded bg-grey-7 px-2 py-1 text-xs font-bold text-grey-666"
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
        <div>{props.name}</div>
        {props.description && (
          <div className="mt-4 mb-8 text-xs text-grey-666">
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
      <div>{props.name}</div>
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
      <div className="flex flex-col space-y-1">
        <Textarea
          rows={1}
          placeholder="Calculator Name"
          value={title}
          onChange={props.onChangeName}
          theme="large"
          className="font-bold"
        />
        <Textarea
          rows={3}
          placeholder="Explanation (Markdown)"
          value={content}
          onChange={props.onChangeContent}
          theme="large"
        />
      </div>

      {/* inputs */}
      <Section title={`${hasHiddenInputs ? "Visible " : ""}Inputs`}>
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
      </Section>

      {hasHiddenInputs && (
        <Section title="Hidden Inputs">
          <List>{invisibleInputs.map(([item]) => item)}</List>
        </Section>
      )}

      {/* outputs */}
      <Section title={`${hasHiddenOutputs ? "Visible " : ""}Outputs`}>
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
      </Section>

      {hasHiddenOutputs && (
        <Section title="Hidden Outputs">
          <List>{invisibleOutputs.map(([item]) => item)}</List>
        </Section>
      )}

      <div className="mt-4 flex justify-end">
        <Button
          color="green"
          size="large"
          loading={hasAlreadySubmitted}
          disabled={!isValid || hasAlreadySubmitted}
          onClick={handleSubmit}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
};
