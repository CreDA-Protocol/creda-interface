import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { save, load } from "redux-localstorage-simple";

import application from "./application/reducer";
import { updateVersion } from "./global/actions";
import transactions from "./transactions/reducer";
import theme from "./theme/reducer";
import toast from "./toast/index";
import walkThrough from "./walkthrough/reducer";
import Cookies from 'js-cookie';
import { createStore } from "store";

const PERSISTED_KEYS: string[] = ["transactions", "theme","walkThrough"];

const store = configureStore({
  reducer: {
    application,
    transactions,
    toast,
    theme,
    walkThrough,
  },
  middleware: [
    ...getDefaultMiddleware({ thunk: false }),
    save({ states: PERSISTED_KEYS }),
  ],
  preloadedState: load({ states: PERSISTED_KEYS }),
});

store.dispatch(updateVersion());
// store.subscribe(()=>saveToCookies(store.getState()))
export default store;

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
