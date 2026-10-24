import { useAppDispatch } from "~/modules/hooks";
import {
  FormContainer,
  Props as FormContainerProps,
} from "./shared/FormContainer";

import { create } from "~/modules/calculators/actions";
import { Calculator } from "~/modules/calculators/reducer";

type Props = Omit<
  FormContainerProps,
  "buttonText" | "onSubmit" | "calculator" | "mode"
> & {
  onCalculatorSave(c: Calculator): void;
};

export const NewCalculatorForm: React.FC<Props> = (props) => {
  const dispatch = useAppDispatch();

  return (
    <FormContainer
      {...props}
      buttonText="Create calculator"
      mode="new"
      onSubmit={(calc: Omit<Calculator, "id">) => {
        return dispatch(create(calc.space_id, calc, props.onCalculatorSave));
      }}
    />
  );
};
