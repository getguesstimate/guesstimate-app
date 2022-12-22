import { createSelector } from "@reduxjs/toolkit";

export const userSpaceSelector = createSelector(
  (state) => state.spaces,
  (_, userId) => userId,
  (spaces, userId) => {
    return spaces.filter((s) => s.user_id.toString() === userId.toString());
  }
);
