import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { alertSeed, watchSeed, type AlertItem } from "@/lib/mockData";
import { planSeed, type Plan } from "@/lib/plans";

export const watchlistSlice = createSlice({
  name: "watchlist",
  initialState: watchSeed,
  reducers: {
    add: (s, a: PayloadAction<string>) => { if (!s.includes(a.payload)) s.push(a.payload); },
    remove: (s, a: PayloadAction<string>) => s.filter((x) => x !== a.payload),
  },
});

export const alertsSlice = createSlice({
  name: "alerts",
  initialState: alertSeed,
  reducers: {
    addMany: (s, a: PayloadAction<AlertItem[]>) => { s.unshift(...a.payload); },
    toggle: (s, a: PayloadAction<number>) => { const x = s.find((i) => i.id === a.payload); if (x) x.active = !x.active; },
    remove: (s, a: PayloadAction<number>) => s.filter((i) => i.id !== a.payload),
    replace: (s, a: PayloadAction<AlertItem>) => { const i = s.findIndex((x) => x.id === a.payload.id); if (i >= 0) s[i] = a.payload; },
  },
});

// Plans edited in the admin panel also show on the user's Subscription page
export const plansSlice = createSlice({
  name: "plans",
  initialState: planSeed as Plan[],
  reducers: {
    upsert: (s, a: PayloadAction<Plan>) => { const i = s.findIndex((p) => p.id === a.payload.id); if (i >= 0) s[i] = a.payload; else s.push(a.payload); },
  },
});
