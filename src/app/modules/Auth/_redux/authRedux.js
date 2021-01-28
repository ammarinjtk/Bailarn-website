import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";


export const actionTypes = {
  GoogleLogin: "[GoogleLogin] Ation",
  Logout: "[Logout] Action",
};

const initialAuthState = {
  user: undefined,
  authToken: undefined
};

export const reducer = persistReducer(
  {
    storage,
    key: "di-portal-auth",
    whitelist: ["user", "authToken", "tokenExpiredAt"],
  },
  (state = initialAuthState, action) => {
    switch (action.type) {
      case actionTypes.GoogleLogin: {
        const {
          fullname,
          email,
          imageUrl,
          token,
          tokenExpiredAt
        } = action.payload;

        return {
          user: { fullname, email, imageUrl },
          authToken: token,
          tokenExpiredAt: tokenExpiredAt
        };
      }

      case actionTypes.Logout: {
        // TODO: Change this code. Actions in reducer aren't allowed.
        return initialAuthState;
      }

      default:
        return state;
    }
  }
);

export const actions = {
  googleLogin: (fullname, email, imageUrl, token, tokenExpiredAt ) => ({
    type: actionTypes.GoogleLogin,
    payload: { fullname, email, imageUrl, token, tokenExpiredAt},
  }),
  logout: () => ({ type: actionTypes.Logout }),
};
