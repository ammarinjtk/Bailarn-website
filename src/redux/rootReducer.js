import { combineReducers } from "redux";

import * as auth from "../app/modules/Auth/_redux/authRedux";

export const rootReducer = combineReducers({
  auth: auth.reducer,
});
