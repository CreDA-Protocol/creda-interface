import { createReducer } from "@reduxjs/toolkit";
import { setIsWalkThrough,setIncrement,setDecrement } from "./actions";

export interface WalkThorughState {
  readonly isWalkThrough: Number | null;
}

const initialState: WalkThorughState = {
    isWalkThrough: 1,
};

const walkThroughReducer = createReducer(initialState, (builder) => {
  return builder.addCase(setIsWalkThrough, (state, action) => 
  {
    state.isWalkThrough = action.payload;
  }).addCase(setIncrement, (state, action) => 
  {
    state.isWalkThrough = parseInt(action.payload.toString())+1;
  }).addCase(setDecrement, (state, action) => 
  {
    state.isWalkThrough = parseInt(action.payload.toString())-1;
  });
});

export default walkThroughReducer;
