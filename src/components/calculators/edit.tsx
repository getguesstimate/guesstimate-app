import { useAppDispatch } from "~/modules/hooks";
import {
  FormContainer,
  Props as FormContainerProps,
} from "./shared/FormContainer";

import { update } from "~/modules/calculators/actions";

type Props = Omit<FormContainerProps, "buttonText" | "onSubmit"> & {
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
