import { createAction } from "@reduxjs/toolkit";

export const setIsWalkThrough = createAction<number>("walkthrough/setIsWalkThrough");

export const setIncrement = createAction<number>("walkthrough/setIncrement")
export const setDecrement = createAction<number>("walkthrough/setDecrement")

