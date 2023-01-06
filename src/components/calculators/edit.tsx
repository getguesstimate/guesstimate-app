import { useAppDispatch } from "~/modules/hooks";
import {
  FormContainer,
  Props as FormContainerProps,
} from "./shared/FormContainer";

import { update } from "~/modules/calculators/actions";
import { Calculator } from "~/modules/calculators/reducer";

type Props = Omit<
  FormContainerProps,
  "buttonText" | "onSubmit" | "calculator" | "mode"
> & {
  calculator: Calculator; // must be set!
  onCalculatorSave: (c: Calculator) => void;
};

export const EditCalculatorForm: React.FC<Props> = (props) => {
  const dispatch = useAppDispatch();

  return (
    <FormContainer
      {...props}
      mode="edit"
      buttonText="Update"
      onSubmit={(calc: Calculator) => {
        dispatch(update(calc, props.onCalculatorSave));
      }}
    />
  );
};
