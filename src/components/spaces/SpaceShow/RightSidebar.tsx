import { Fact } from "~/lib/engine/facts";
import { ExtendedDSpace } from "../denormalized-space-selector";

import * as calculatorActions from "~/modules/calculators/actions";

import { useAppDispatch } from "~/modules/hooks";

import * as elev from "~/server/elev/index";
import * as e from "~/lib/engine/engine";

import {
  ButtonDeleteText,
  ButtonEditText,
  ButtonExpandText,
} from "~/components/utility/buttons/button";
import { ButtonCloseText } from "~/components/utility/buttons/close";

import { EditCalculatorForm } from "~/components/calculators/EditCalculatorForm";
import { NewCalculatorForm } from "~/components/calculators/NewCalculatorForm";
import { CalculatorCompressedShow } from "~/components/calculators/show/CalculatorCompressedShow";
import { FactListContainer } from "~/components/facts/list/FactListContainer";
import { PropsWithChildren } from "react";
import clsx from "clsx";
import { Calculator } from "~/modules/calculators/reducer";

const HeaderTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <header className="text-2xl font-bold text-[#476b82]">{children}</header>
);

const ShowCalculatorHeader: React.FC<{
  id: number;
  editableByMe: boolean;
  onEdit(): void;
  onDelete(): void;
  onClose(): void;
}> = ({ id, editableByMe, onEdit, onDelete, onClose }) => {
  return (
    <div className="flex flex-wrap items-start justify-end gap-1">
      <ButtonExpandText href={`/calculators/${id}`} />
      {editableByMe && <ButtonEditText onClick={onEdit} />}
      {editableByMe && <ButtonDeleteText onClick={onDelete} />}
      <ButtonCloseText onClick={onClose} />
    </div>
  );
};

const CalculatorFormHeader: React.FC<{
  isNew: boolean;
  onClose(): void;
}> = ({ isNew, onClose }) => (
  <div className="flex items-start justify-between">
    <HeaderTitle>{isNew ? "New" : "Edit"} Calculator</HeaderTitle>
    <ButtonCloseText onClick={onClose} />
  </div>
);

const FactSidebarHeader: React.FC<{
  onClose(): void;
  organizationId: string | number;
}> = ({ onClose, organizationId }) => {
  return (
    <div className="flex items-start justify-between">
      <HeaderTitle>Metric Library</HeaderTitle>
      <div className="flex gap-1">
        <ButtonExpandText href={`/organizations/${organizationId}/facts`} />
        <ButtonCloseText onClick={onClose} />
      </div>
    </div>
  );
};

const RightSidebarContainer: React.FC<
  PropsWithChildren<{ grey?: boolean; header: React.ReactNode }>
> = ({ grey, header, children }) => (
  <div
    className={clsx(
      "w-96 flex-none overflow-y-auto overflow-x-hidden border-l border-[#ccc] p-4",
      grey ? "bg-grey-6" : "bg-white"
    )}
  >
    <div className="pb-6">{header}</div>
    <div>{children}</div>
  </div>
);

export type RightSidebarState =
  | {
      type: "CLOSED";
    }
  | {
      type: "NEW_CALCULATOR_FORM";
    }
  | {
      type: "EDIT_CALCULATOR_FORM";
      editCalculatorId: number;
    }
  | {
      type: "SHOW_CALCULATOR";
      showCalculatorId: number;
      showCalculatorResults?: boolean;
    }
  | {
      type: "FACT_SIDEBAR";
    };

type Action =
  | {
      type: "CLOSE";
    }
  | {
      type: "OPEN";
      payload: RightSidebarState;
    }
  | {
      type: "SHOW_CALCULATOR";
      payload: Calculator;
    }
  | {
      type: "MAKE_NEW_CALCULATOR";
    }
  | {
      type: "TOGGLE_FACTS";
    };

export const rightSidebarReducer = (
  state: RightSidebarState,
  action: Action
): RightSidebarState => {
  const close = () => {
    elev.show();
    return { type: "CLOSED" } as const;
  };
  const open = (newState: RightSidebarState) => {
    elev.hide();
    return newState;
  };

  switch (action.type) {
    case "CLOSE":
      return close();
    case "OPEN":
      return open(action.payload);
    case "SHOW_CALCULATOR":
      return open({
        type: "SHOW_CALCULATOR",
        showCalculatorId: action.payload.id,
      });
    case "MAKE_NEW_CALCULATOR":
      return open({ type: "NEW_CALCULATOR_FORM" });
    case "TOGGLE_FACTS":
      if (state.type !== "FACT_SIDEBAR") {
        return open({ type: "FACT_SIDEBAR" });
      } else {
        return close();
      }
    default: // never
      return state;
  }
};

export const RightSidebar: React.FC<{
  state: RightSidebarState;
  rightSidebarDispatch(action: Action): void;
  organizationFacts: Fact[];
  space: ExtendedDSpace;
}> = ({ state, rightSidebarDispatch, space, organizationFacts }) => {
  const { editableByMe, calculators, organization, imported_fact_ids } = space;

  const dispatch = useAppDispatch();

  const close = () => {
    rightSidebarDispatch({
      type: "CLOSE",
    });
  };

  const showCalculator = (c: Calculator) => {
    rightSidebarDispatch({ type: "SHOW_CALCULATOR", payload: c });
  };

  switch (state.type) {
    case "CLOSED":
      return null;
    case "SHOW_CALCULATOR": {
      const editCalculator = () => {
        rightSidebarDispatch({
          type: "OPEN",
          payload: {
            type: "EDIT_CALCULATOR_FORM",
            editCalculatorId: state.showCalculatorId,
          },
        });
      };
      const deleteCalculator = () => {
        dispatch(calculatorActions.destroy(state.showCalculatorId));
        close();
      };

      return (
        <RightSidebarContainer
          header={
            <ShowCalculatorHeader
              editableByMe={editableByMe}
              id={state.showCalculatorId}
              onEdit={editCalculator}
              onDelete={deleteCalculator}
              onClose={close}
            />
          }
        >
          <CalculatorCompressedShow
            calculatorId={state.showCalculatorId}
            startFilled={state.showCalculatorResults}
          />
        </RightSidebarContainer>
      );
    }
    case "EDIT_CALCULATOR_FORM":
      return (
        <RightSidebarContainer
          header={<CalculatorFormHeader isNew={false} onClose={close} />}
        >
          <EditCalculatorForm
            space={space}
            calculator={calculators.find(
              (c) => c.id === state.editCalculatorId
            )}
            onCalculatorSave={showCalculator}
          />
        </RightSidebarContainer>
      );
    case "NEW_CALCULATOR_FORM":
      return (
        <RightSidebarContainer
          header={<CalculatorFormHeader isNew={true} onClose={close} />}
        >
          <NewCalculatorForm space={space} onCalculatorSave={showCalculator} />
        </RightSidebarContainer>
      );
    case "FACT_SIDEBAR":
      return (
        <RightSidebarContainer
          grey
          header={
            <FactSidebarHeader
              onClose={close}
              organizationId={organization.id}
            />
          }
        >
          <FactListContainer
            existingVariableNames={organizationFacts.map(e.facts.getVar)}
            facts={organizationFacts}
            organization={organization}
            canMakeNewFacts={true}
            spaceId={space.id}
            imported_fact_ids={imported_fact_ids}
          />
        </RightSidebarContainer>
      );
  }
};
