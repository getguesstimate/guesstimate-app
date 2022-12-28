import { useAppDispatch } from "gModules/hooks";
import {
  FormContainer,
  Props as FormContainerProps,
} from "./shared/FormContainer";

import { create } from "gModules/calculators/actions";

type Props = Omit<FormContainerProps, "buttonText" | "onSubmit"> & {
  onCalculatorSave(): void;
};

export const NewCalculatorForm: React.FC<Props> = (props) => {
  const dispatch = useAppDispatch();

  return (
    <FormContainer
      {...props}
      buttonText="Create"
      onSubmit={(calc) => {
        dispatch(create(calc.space_id, calc, props.onCalculatorSave));
      }}
    />
  );
};
