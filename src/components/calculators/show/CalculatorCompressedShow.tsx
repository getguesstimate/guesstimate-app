import React from "react";

import { CalculatorShow } from "./CalculatorShow";

import { useAppSelector } from "~/modules/hooks";
import { calculatorSpaceSelector } from "./calculator-space-selector";

export const CalculatorCompressedShow: React.FC<{
  calculatorId: number;
  startFilled?: boolean;
  hideTitle?: boolean;
}> = ({ calculatorId, startFilled, hideTitle }) => {
  const selectedProps = useAppSelector((state) =>
    calculatorSpaceSelector(state, calculatorId)
  );

  if (selectedProps.calculator) {
    return <CalculatorShow {...selectedProps} startFilled={startFilled} hideTitle={hideTitle} />;
  } else {
    return null;
  }
};
