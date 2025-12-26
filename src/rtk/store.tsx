import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import { persistStore } from "redux-persist";
import api from "./services";

// Configure the Redux store
export const store = configureStore({
  reducer: rootReducer,
  devTools: import.meta.env.VITE_PUBLIC_ENV === "DEV",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(api.middleware),
});

// Setup redux-persist persistor
export const persistor = persistStore(store);

// Define types for global usage
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
