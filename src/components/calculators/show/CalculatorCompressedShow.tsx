import React from "react";

import { CalculatorShow } from "./CalculatorShow";

import { useAppSelector } from "~/modules/hooks";
import { calculatorSpaceSelector } from "./calculator-space-selector";

export const CalculatorCompressedShow: React.FC<{
  calculatorId?: string;
  startFilled?: boolean;
}> = ({ calculatorId, startFilled }) => {
  const selectedProps = useAppSelector((state) =>
    calculatorSpaceSelector(state, calculatorId)
  );

  if (selectedProps.calculator) {
    return (
      <CalculatorShow
        {...selectedProps}
        startFilled={startFilled}
        classes={["narrow", "medium-font-size"]}
      />
    );
  } else {
    return null;
  }
};
