import React from "react";
import { connect } from "react-redux";

import { CalculatorShow } from "./CalculatorShow";

import { calculatorSpaceSelector } from "./calculator-space-selector";
import { useAppSelector } from "gModules/hooks";

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
