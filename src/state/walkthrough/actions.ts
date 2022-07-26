import { createAction } from "@reduxjs/toolkit";

export const setIsWalkThrough = createAction<Number>("walkthrough/setIsWalkThrough");

export const setIncrement = createAction<Number>("walkthrough/setIncrement")
export const setDecrement = createAction<Number>("walkthrough/setDecrement")

