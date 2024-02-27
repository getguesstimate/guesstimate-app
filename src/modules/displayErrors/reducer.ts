import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type DisplayErrorState = {
  error?: unknown;
  message?: string;
}[];

export const displayErrorSlice = createSlice({
  name: "displayError",
  initialState: [] as DisplayErrorState,
  reducers: {
    newError: {
      prepare(error?: unknown, message?: string) {
        return {
          payload: {
            error,
            message,
          },
        };
      },
      reducer(
        state,
        action: PayloadAction<{ error?: unknown; message?: string }>
      ) {
        state.push(action.payload);
      },
    },
    close() {
      return [];
    },
  },
});

export const displayErrorR = displayErrorSlice.reducer;
