import { createReducer } from "@reduxjs/toolkit";
import { setDecrement, setIncrement, setIsWalkThrough } from "./actions";

export interface WalkThorughState {
  readonly isWalkThrough: number | null;
}

const initialState: WalkThorughState = {
  isWalkThrough: 1,
};

const walkThroughReducer = createReducer(initialState, (builder) => {
  return builder.addCase(setIsWalkThrough, (state, action) => {
    state.isWalkThrough = action.payload;
  }).addCase(setIncrement, (state, action) => {
    state.isWalkThrough = parseInt(action.payload.toString()) + 1;
  }).addCase(setDecrement, (state, action) => {
    state.isWalkThrough = parseInt(action.payload.toString()) - 1;
  });
});

export default walkThroughReducer;
