import { configureStore } from "@reduxjs/toolkit";
import { api } from "./api";
import { alertsSlice, plansSlice, watchlistSlice } from "./slices";

export const store = configureStore({
  reducer: { [api.reducerPath]: api.reducer, watchlist: watchlistSlice.reducer, alerts: alertsSlice.reducer, plans: plansSlice.reducer },
  middleware: (gdm) => gdm().concat(api.middleware),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
