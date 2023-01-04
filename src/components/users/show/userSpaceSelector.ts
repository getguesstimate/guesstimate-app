import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "~/modules/store";

export const userSpaceSelector = createSelector(
  (state: RootState) => state.spaces,
  (_: RootState, userId: number) => userId,
  (spaces, userId) => {
    return spaces.filter((s) => String(s.user_id) === String(userId));
  }
);
