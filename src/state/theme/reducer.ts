import { createReducer } from "@reduxjs/toolkit";
import { setIsDark } from "./actions";

export interface ThemeState {
  readonly isDark: boolean | null;
}

const initialState: ThemeState = {
  isDark: false,
};

const themeReducer = createReducer(initialState, (builder) => {
  return builder.addCase(setIsDark, (state, action) => {
    state.isDark = action.payload;
  });
});

export default themeReducer;
