import { AnyAction } from "redux";
import { DisplayErrorAction } from "./actions";

type DisplayErrorState = {
  error: string;
  message: string;
}[];

const testExample: DisplayErrorState = [
  { error: "foo", message: "terrible thing!" },
];

const initialState: DisplayErrorState = [];

export default function displayError(
  state = initialState,
  action: DisplayErrorAction // this is a lie, action can be something else
): DisplayErrorState {
  switch (action.type) {
    case "NEW_DISPLAY_ERROR":
      return [...state, action.value];
    case "CLOSE_DISPLAY_ERRORS":
      return [];
    default:
      return state;
  }
}
