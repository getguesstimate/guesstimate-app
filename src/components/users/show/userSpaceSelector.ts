import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "gModules/store";

export const userSpaceSelector = createSelector(
  (state: RootState) => state.spaces,
  (_, userId: number) => userId,
  (spaces, userId) => {
    return spaces.filter((s) => s.user_id.toString() === userId.toString());
  }
);
