import { useAppDispatch } from "gModules/hooks";
import {
  FormContainer,
  Props as FormContainerProps,
} from "./shared/FormContainer";

import { update } from "gModules/calculators/actions";

type Props = FormContainerProps & {
  onCalculatorSave: () => void;
};

export const EditCalculatorForm: React.FC<Props> = (props) => {
  const dispatch = useAppDispatch();

  return (
    <FormContainer
      {...props}
      buttonText="Update"
      onSubmit={(calc) => {
        dispatch(update(calc, props.onCalculatorSave));
      }}
    />
  );
};
