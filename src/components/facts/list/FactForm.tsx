import React, { ChangeEvent, useEffect, useRef, useState, useId } from "react";

import _ from "lodash";

import { FieldHelp } from "~/components/workspace/FieldHelp";
import styles from "./metrics.module.css";

import { FactCategory } from "~/lib/engine/fact_category";
import {
  Fact,
  hasRequiredProperties,
  isExportedFromSpace,
  simulateFact,
} from "~/lib/engine/facts";
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
  const fieldId = useId();

  const nameRef = useRef<HTMLInputElement | null>(null);

  const { buttonText, onCancel, onDelete, onSubmit, categories = [] } = props;

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

  const hasNoErrors = !hasErrors(runningFact.simulation);

  const isVariableNameUnique = !_.some(
    props.existingVariableNames,
    (n) => n === runningFact.variable_name
  );

  const isValid =
    hasRequiredProperties(runningFact) && hasNoErrors && isVariableNameUnique;

  useEffect(() => {
    if (currentExpressionSimulated && submissionPendingOnSimulation) {
      setSubmissionPendingOnSimulation(false);
      if (isValid) onSubmit(runningFact);
    }
  }, [
    currentExpressionSimulated,
    submissionPendingOnSimulation,
    isValid,
    onSubmit,
    runningFact,
  ]);

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
      if (isValid) onSubmit(runningFact);
    } else {
      setSubmissionPendingOnSimulation(true);
      void simulateCurrentExpression();
    }
  };

  const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
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
  const handleSelectCategory = (c: ChangeEvent<HTMLSelectElement>) => {
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

  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault();
        handleSubmit();
      }}
    >
      <div className={styles.fields}>
        <div className={styles.field}>
          <label htmlFor={`${fieldId}-name`}>Name</label>
          <input
            id={`${fieldId}-name`}
            ref={nameRef}
            value={runningFact.name}
            onChange={handleChangeName}
          />
        </div>
        <div className={styles.field}>
          <div className={styles.fieldHeading}>
            <label htmlFor={`${fieldId}-variable`}>Variable</label>
            <FieldHelp label="Help with metric variables">
              <p>Use this variable to reference the metric in formulas.</p>
            </FieldHelp>
          </div>
          <div className={styles.variableInput}>
            <span aria-hidden="true">#</span>
            <input
              id={`${fieldId}-variable`}
              value={runningFact.variable_name}
              onChange={handleChangeVariableName}
              aria-invalid={!isVariableNameUnique}
              aria-describedby={
                !isVariableNameUnique ? `${fieldId}-variable-error` : undefined
              }
            />
          </div>
          {!isVariableNameUnique && (
            <p
              id={`${fieldId}-variable-error`}
              className={styles.error}
              role="alert"
            >
              This variable is already in use.
            </p>
          )}
        </div>
        <div className={styles.field}>
          {isExportedFromSpace(runningFact) ? (
            <>
              <span className={styles.label}>Value</span>
              <a
                className={styles.secondary}
                href={`${spaceUrlById(
                  runningFact.exported_from_id
                )}?factsShown=true`}
              >
                Edit source model
              </a>
            </>
          ) : (
            <>
              <div className={styles.fieldHeading}>
                <label htmlFor={`${fieldId}-value`}>Value</label>
                <FieldHelp label="Help with metric values">
                  <p>Enter a number, a range such as 10 to 20, or data.</p>
                </FieldHelp>
              </div>
              <input
                id={`${fieldId}-value`}
                value={runningFact.expression}
                onChange={handleChangeExpression}
                onBlur={simulateCurrentExpression}
                aria-invalid={!hasNoErrors}
                aria-describedby={
                  !hasNoErrors ? `${fieldId}-value-error` : undefined
                }
              />
              {!hasNoErrors && (
                <p
                  id={`${fieldId}-value-error`}
                  className={styles.error}
                  role="alert"
                >
                  Enter a valid value or range.
                </p>
              )}
            </>
          )}
        </div>
        {!!categories.length && (
          <div className={styles.field}>
            <label htmlFor={`${fieldId}-category`}>Category</label>
            <select
              id={`${fieldId}-category`}
              value={runningFact.category_id || ""}
              onChange={handleSelectCategory}
            >
              <option value="">Uncategorized</option>
              {categories.map(({ id, name }) => (
                <option value={id} key={id}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      <div className={styles.formActions}>
        <button
          type="submit"
          className={styles.primary}
          disabled={
            submissionPendingOnSimulation ||
            !hasRequiredProperties(runningFact) ||
            !isVariableNameUnique ||
            (currentExpressionSimulated && !hasNoErrors)
          }
        >
          {submissionPendingOnSimulation ? "Checking…" : buttonText}
        </button>
        <button type="button" className={styles.secondary} onClick={onCancel}>
          Cancel
        </button>
        {onDelete && (
          <button type="button" className={styles.danger} onClick={onDelete}>
            Delete
          </button>
        )}
      </div>
    </form>
  );
};
