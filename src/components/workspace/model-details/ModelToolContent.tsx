import type { Calculator } from "~/modules/calculators/reducer";
import type { ExtendedDSpace } from "~/components/spaces/denormalized-space-selector";
import type { Fact } from "~/lib/engine/facts";
import * as engine from "~/lib/engine/engine";
import { CalculatorCompressedShow } from "~/components/calculators/show/CalculatorCompressedShow";
import { EditCalculatorForm } from "~/components/calculators/EditCalculatorForm";
import { NewCalculatorForm } from "~/components/calculators/NewCalculatorForm";
import { FactListContainer } from "~/components/facts/list/FactListContainer";
import type { ModelToolState, ModelToolAction } from "./modelToolState";

type Props = {
  state: ModelToolState;
  toolDispatch(action: ModelToolAction): void;
  space: ExtendedDSpace;
  organizationFacts: Fact[];
};
export function ModelToolContent({
  state,
  toolDispatch,
  space,
  organizationFacts,
}: Props) {
  const showCalculator = (calculator: Calculator) =>
    toolDispatch({ type: "SHOW_CALCULATOR", payload: calculator });
  if (state.type === "CLOSED") return null;
  return (
    <div className="bg-white">
      <div>
        {state.type === "SHOW_CALCULATOR" && (
          <CalculatorCompressedShow
            hideTitle
            calculatorId={state.showCalculatorId}
            startFilled={state.showCalculatorResults}
          />
        )}
        {state.type === "EDIT_CALCULATOR_FORM" && (
          <EditCalculatorForm
            space={space}
            calculator={space.calculators.find(
              (c) => c.id === state.editCalculatorId
            )}
            onCalculatorSave={showCalculator}
          />
        )}
        {state.type === "NEW_CALCULATOR_FORM" && (
          <NewCalculatorForm space={space} onCalculatorSave={showCalculator} />
        )}
        {state.type === "FACT_SIDEBAR" && (
          <FactListContainer
            existingVariableNames={organizationFacts.map(engine.facts.getVar)}
            facts={organizationFacts}
            organization={space.organization}
            canMakeNewFacts={true}
            spaceId={space.id}
            imported_fact_ids={space.imported_fact_ids}
          />
        )}
      </div>
    </div>
  );
}
