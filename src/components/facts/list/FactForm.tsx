import _ from "lodash";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "~/components/utility/buttons/button";
import { Input, Select, Textarea } from "~/components/utility/forms";

import {
  Fact,
  hasRequiredProperties,
  isExportedFromSpace,
  simulateFact,
} from "~/lib/engine/facts";
import { FactCategory } from "~/lib/engine/fact_category";
import { addStats, hasErrors } from "~/lib/engine/simulation";
import { spaceUrlById } from "~/lib/engine/space";

import { withVariableName } from "~/lib/generateVariableNames/generateFactVariableName";
import {
  formatData,
  isData,
} from "~/lib/guesstimator/formatter/formatters/Data";

type Props = {
  categories: FactCategory[];
  existingVariableNames: string[];
  onSubmit(fact: Fact): void;
  onCancel(): void;
  onDelete?(): void;
  startingFact?: Fact;
  categoryId?: string | null;
  buttonText: string;
};

export const FactForm: React.FC<Props> = (props) => {
  const router = useRouter();

  const nameRef = useRef<HTMLTextAreaElement | null>(null);

  const { buttonText, onCancel, onDelete, categories = [] } = props;

  const [runningFact, setRunningFact] = useState(() => ({
    ...(props.startingFact || {
      id: 0,
      name: "",
      expression: "",
      variable_name: "",
      exported_from_id: null,
      metric_id: null,
      category_id: null,
      simulation: {
        sample: {
          values: [],
          errors: [],
        },
        stats: {},
      },
    }),
    category_id: props.startingFact?.category_id || props.categoryId,
  }));

  const [submissionPendingOnSimulation, setSubmissionPendingOnSimulation] =
    useState(false);
  const [variableNameManuallySet, setVariableNameManuallySet] = useState(
    !_.isEmpty(props.startingFact?.variable_name)
  );
  const [currentExpressionSimulated, setCurrentExpressionSimulated] =
    useState(true);

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  useEffect(() => {
    if (currentExpressionSimulated && submissionPendingOnSimulation) {
      handleSubmit();
    }
  }, [currentExpressionSimulated, submissionPendingOnSimulation]);

  const hasNoErrors = !hasErrors(runningFact.simulation);

  const isVariableNameUnique = !_.some(
    props.existingVariableNames,
    (n) => n === runningFact.variable_name
  );

  const isValid =
    hasRequiredProperties(runningFact) && hasNoErrors && isVariableNameUnique;

  const setFactState = (newFactState: Partial<Fact>) => {
    setRunningFact({
      ...runningFact,
      ...newFactState,
    });
  };

  const simulateCurrentExpression = async () => {
    const simulation = {
      sample: isData(runningFact.expression)
        ? { values: formatData(runningFact.expression) }
        : await simulateFact(runningFact),
    };
    addStats(simulation);
    setFactState({
      // FIXME - addStats should return correct simulation type instead of modifying it in place
      simulation: simulation as any,
    });
    setCurrentExpressionSimulated(true);
  };

  const handleSubmit = () => {
    if (currentExpressionSimulated) {
      props.onSubmit(runningFact);
    } else {
      setSubmissionPendingOnSimulation(true);
    }
  };

  const submitIfEnter = (e: React.KeyboardEvent) => {
    if (e.code === "Enter" && isValid) {
      handleSubmit();
    }
  };

  const handleChangeName = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const name = e.currentTarget.value;
    setFactState(
      variableNameManuallySet
        ? { name }
        : withVariableName(
            { ...runningFact, name },
            props.existingVariableNames
          )
    );
  };
  const handleSelectCategory = (c: React.ChangeEvent<HTMLSelectElement>) => {
    setFactState({ category_id: c.target.value });
  };
  const handleChangeVariableName = (
    e: React.SyntheticEvent<HTMLInputElement>
  ) => {
    setFactState({ variable_name: e.currentTarget.value });
    setVariableNameManuallySet(true);
  };
  const handleChangeExpression = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFactState({ expression: e.currentTarget.value });
    setCurrentExpressionSimulated(false);
  };

  const renderEditExpressionSection = () => {
    if (isExportedFromSpace(runningFact)) {
      const exported_from_url = `${spaceUrlById(
        runningFact.exported_from_id
      )}?factsShown=true`;
      return (
        <Button size="small" onClick={() => router.push(exported_from_url)}>
          Edit Model
        </Button>
      );
    } else {
      return (
        <Input
          type="text"
          placeholder="value"
          value={runningFact.expression}
          onChange={handleChangeExpression}
          onBlur={simulateCurrentExpression}
          onKeyDown={submitIfEnter}
          error={!hasNoErrors}
        />
      );
    }
  };

  return (
    <div className="flex gap-4 p-2">
      <div>{renderEditExpressionSection()}</div>
      <div className="flex flex-1 flex-col items-stretch gap-1">
        <Textarea
          rows={1}
          placeholder="name"
          value={runningFact.name}
          onChange={handleChangeName}
          onKeyDown={submitIfEnter}
          className="w-full"
          ref={nameRef}
          error={!isVariableNameUnique}
        />
        <div className="relative">
          <span className="absolute left-2 top-1 text-grey-999">#</span>
          <Input
            className="w-full pl-5" /* to fit # prefix */
            type="text"
            placeholder="hashtag"
            value={runningFact.variable_name}
            onChange={handleChangeVariableName}
            onKeyDown={submitIfEnter}
          />
        </div>
        {!_.isEmpty(categories) && (
          <Select
            className="w-48"
            value={runningFact.category_id || ""}
            onChange={handleSelectCategory}
          >
            <option value="">Uncategorized</option>
            {categories.map(({ id, name }) => (
              <option value={id} key={id}>
                {name}
              </option>
            ))}
          </Select>
        )}
        <div className="flex items-center gap-1">
          <Button
            color="blue"
            size="small"
            onClick={handleSubmit}
            loading={submissionPendingOnSimulation}
            disabled={submissionPendingOnSimulation || !isValid}
          >
            {buttonText}
          </Button>
          <Button size="small" onClick={onCancel}>
            Cancel
          </Button>
          {onDelete && (
            <Button size="small" onClick={onDelete}>
              Delete
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
