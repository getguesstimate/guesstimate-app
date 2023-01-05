import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ModalState = {
  componentName: string | undefined;
  props: any; // FIXME
};

const initialState: ModalState = {
  componentName: undefined,
  props: {},
};

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openSettings() {
      return { componentName: "settings", props: {} };
    },
    openFirstSubscription(_, action: PayloadAction<string>) {
      return {
        componentName: "firstSubscription",
        props: { planId: action.payload },
      };
    },
    openConfirmation(_, action: PayloadAction<any>) {
      return { componentName: "confirmation", props: action.payload };
    },
    close() {
      return initialState;
    },
  },
});

const modal = modalSlice.reducer;

export const modalR = modalSlice.reducer;
