import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { FormContainer } from "./shared/FormContainer";

import { create } from "gModules/calculators/actions";

export const NewCalculatorForm = connect(null, (dispatch) =>
  bindActionCreators({ create }, dispatch)
)((props) => (
  <FormContainer
    {...props}
    buttonText={"Create"}
    onSubmit={(calc) => {
      props.create(calc.space_id, calc, props.onCalculatorSave);
    }}
  />
));
