import { ChangeEvent, FC, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "~/components/utility/buttons/button";
import { Textarea } from "~/components/utility/forms";
import { FullDenormalizedMetric } from "~/lib/engine/space";
import { Optional } from "~/lib/engine/types";
import { Calculator } from "~/modules/calculators/reducer";

type CalculatorParam = { metric: FullDenormalizedMetric; isVisible: boolean };
type Props = {
  calculator: Optional<Calculator, "id">;
  inputs: CalculatorParam[];
  outputs: CalculatorParam[];
  onMetricHide(id: string): void;
  onMetricShow(id: string): void;
  onMoveMetricTo(id: string, destIndex: number): void;
  onChangeName(e: ChangeEvent): void;
  onChangeContent(e: ChangeEvent): void;
  onSubmit(): void;
  isValid: boolean;
  buttonText: string;
};

export const CalculatorForm: FC<Props> = (props) => {
  const [hasAlreadySubmitted, setHasAlreadySubmitted] = useState(false);
  const renderParams = (label: string, params: CalculatorParam[]) => {
    const visible = params.filter((p) => p.isVisible);
    return (
      <section
        className="mt-6"
        aria-label={`Calculator ${label.toLowerCase()}`}
      >
        <h3 className="mb-2 border-b border-grey-ccc pb-1 font-bold">
          {label}
        </h3>
        <div className="space-y-2">
          {params.map(({ metric, isVisible }) => {
            const index = visible.findIndex((p) => p.metric.id === metric.id);
            const name = metric.name || metric.readableId;
            return (
              <div
                key={metric.id}
                className="flex items-center justify-between gap-2 rounded border border-grey-eee p-2"
              >
                <div className="min-w-0 break-words">
                  <span>{name}</span>
                  {label === "Inputs" && metric.guesstimate.description && (
                    <details className="mt-1 text-xs text-grey-666">
                      <summary className="cursor-pointer">Notes</summary>
                      <ReactMarkdown
                        source={metric.guesstimate.description}
                        skipHtml
                      />
                    </details>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  {isVisible && (
                    <>
                      <button
                        type="button"
                        className="rounded px-2 py-1 disabled:opacity-30"
                        aria-label={`Move ${name} up`}
                        disabled={index === 0}
                        onClick={() =>
                          props.onMoveMetricTo(metric.id, index - 1)
                        }
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        className="rounded px-2 py-1 disabled:opacity-30"
                        aria-label={`Move ${name} down`}
                        disabled={index === visible.length - 1}
                        onClick={() =>
                          props.onMoveMetricTo(metric.id, index + 1)
                        }
                      >
                        ↓
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    className="rounded bg-grey-eee px-2 py-1 text-xs"
                    aria-label={`${isVisible ? "Hide" : "Show"} ${name}`}
                    onClick={() =>
                      isVisible
                        ? props.onMetricHide(metric.id)
                        : props.onMetricShow(metric.id)
                    }
                  >
                    {isVisible ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    );
  };
  return (
    <div>
      <div className="flex flex-col gap-2">
        <Textarea
          rows={1}
          aria-label="Calculator name"
          placeholder="Calculator Name"
          value={props.calculator.title}
          onChange={props.onChangeName}
          theme="large"
          className="font-bold"
        />
        <Textarea
          rows={3}
          aria-label="Calculator description"
          placeholder="Explanation (Markdown)"
          value={props.calculator.content}
          onChange={props.onChangeContent}
          theme="large"
        />
      </div>
      {renderParams("Inputs", props.inputs)}
      {renderParams("Outputs", props.outputs)}
      <div className="mt-4 flex justify-end">
        <Button
          color="green"
          size="large"
          loading={hasAlreadySubmitted}
          disabled={!props.isValid || hasAlreadySubmitted}
          onClick={() => {
            if (!hasAlreadySubmitted) {
              setHasAlreadySubmitted(true);
              props.onSubmit();
            }
          }}
        >
          {props.buttonText}
        </Button>
      </div>
    </div>
  );
};
