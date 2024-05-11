import { create } from 'zustand'
import { useState, useEffect } from 'react';
import { persist, createJSONStorage } from 'zustand/middleware'

const store = (set, get) => ({
  // STEP 1
  destination: {
    name: '',
    id: '',
    timeZone: '',
  },
  setDestination: (destination) => set((state) => ({ destination })),
  
  email: '',
  setEmail: (email) => set((state) => ({ email })),

  // STEP 2
  departure: null,
  setDeparture: (departure) => set((state) => ({ departure })),

  travelDates: null,
  setTravelDates: (travelDates) => set((state) => ({ travelDates })),

  numberOfTravelers: 2,
  setNumberOfTravelers: (numberOfTravelers) => {
    set((state) => ({ numberOfTravelers }))
  },

  // STEP 3
  preferredTransport: [],
  setPreferredTransport: (preferredTransport) => set((state) => ({ preferredTransport })),

  // STEP 4
  preferredActivities: [],
  setPreferredActivities: (preferredActivities) => set((state) => ({ preferredActivities })),

  // STEP 5
  passed: [],
  setPassed: (passed) => set((state) => ({ passed })),
  interested: [],
  setInterested: (interested) => set((state) => ({ interested })),

  // STEP 6
  travelPlan: `## Travel plan`,
  setTravelPlan: (travelPlan) => set((state) => ({ travelPlan })),
});

// With persistence
export const useItenaryStore = create(
  persist(
    store,
    {
      name: 'travel-itenary', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    },
  ),
);

// https://walk.hashnode.dev/how-to-implement-zustand-in-your-nextjs-app#heading-fixing-hydration-errors-from-zustand-when-using-nextjs
export const useStore = (store, callback) => {
  const result = store(callback);
  const [data, setData] = useState();

  useEffect(() => {
    setData(result);
  }, [result]);

  return data;
};