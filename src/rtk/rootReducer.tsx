import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";

import storage from "redux-persist/lib/storage";
import { encryptTransform } from "redux-persist-transform-encrypt";
import api from "./services";
import alertSlice from "./feature/alertSlice";
import authSlice from "./feature/authSlice";

// Only use encryption if secret key is provided
const secretKey = import.meta.env.VITE_AES_SECRET_KEY || "";
const transforms = secretKey
  ? [
      encryptTransform({
        secretKey: secretKey,
        onError: function (error) {
          console.error(error);
        },
      }),
    ]
  : [];

const persistConfig = {
  transforms,
  storage,
};

const rootReducer = combineReducers({
  [authSlice.name]: persistReducer(
    { ...persistConfig, key: "auth" },
    authSlice.reducer
  ),
  [alertSlice.name]: alertSlice.reducer,
  [api.reducerPath]: api.reducer,
});

export default rootReducer;
