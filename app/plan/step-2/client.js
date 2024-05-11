"use client"

import { useState, useEffect } from 'react';

// Stores
import { useItenaryStore, useStore } from '@/app/stores';

// Components
import { Slider } from "@/components/ui/slider";

import SelectAirport from "@/components/SelectAirport";
import StepNavigation from "@/components/StepNavigation";
import DatePickerWithRange from "@/components/DatePickerWithRange";
import Stepper from '/components/ui/stepper';

// Icons
import {
  Users as UsersIcon, 
  User as UserIcon,
  UserPlus as UserPlusIcon,
} from 'react-feather';

export default function ({ className, ...props }) {
  const currentStep = 1;
  const [isValid, setIsValid] = useState(false);

  const {
    setDeparture,
    setTravelDates,
    setNumberOfTravelers
  } = useItenaryStore();

  // Solves for the Hydration mismatch error
  const travelDates = useStore(useItenaryStore, (state) => state.travelDates);
  const departure = useStore(useItenaryStore, (state) => state.departure);
  const numberOfTravelers = useStore(useItenaryStore, (state) => state.numberOfTravelers);

  useEffect(() => {
    const { from, to } = travelDates || {};
    const numberOfTravelersValid = numberOfTravelers > 0;
    const datesValid = from && to && from < to;
    const departureValid = !!(departure && departure.icao);

    setIsValid(numberOfTravelersValid && datesValid && departureValid);
  }, [numberOfTravelers, travelDates, departure]);

  return (
    <>
      {/* <div className="container mx-auto p-4">
        <Stepper currentStep={currentStep} />
        {}
      </div> */}

        <label className="block text-md tracking-tight mt-8 mb-3 font-medium">
          Your departure airport?
        </label>
        

      <SelectAirport airport={departure} setAirport={setDeparture} />

      <label className="block text-md tracking-tight mt-8 mb-3 font-medium">
        Travel dates?
      </label>
      <DatePickerWithRange className="mt-1 w-full" dates={travelDates} setDates={setTravelDates} />


      <label className="block text-md tracking-tight mt-8 mb-3 font-medium">
        How many people are traveling? <span className="font-light italic">(including yourself)</span>
      </label>
      <div className="flex items-center justify-between gap-6">
        <Slider
          value={[numberOfTravelers]}
          max={12}
          min={1}
          step={1}
          onValueChange={(v) => {
            setNumberOfTravelers(v[0]);
          }}
          className="w-full"
        />
        <div className="flex items-center gap-2 min-w-[50px]">
          {(numberOfTravelers > 1 ? (
            numberOfTravelers > 2 ? <UserPlusIcon /> : <UsersIcon />
          ) : <UserIcon />)}
         <span className="text-md font-medium">{numberOfTravelers}</span>
        </div>
      </div>
      <div className="mt-8 p-4 bg-blue-100 border-l-4 border-blue-500 text-blue-700">
        <h3 className="font-semibold mb-2">Looking for cheap flights?</h3>
        <p>Make sure to check out <a href="https://www.waybound.xyz/" target="_blank" rel="noopener noreferrer" className="font-bold underline decoration-2 underline-offset-2 text-blue-700 hover:text-blue-800 hover:bg-blue-200 p-1 rounded inline-flex items-center">Waybound Flights
          <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.5 8.5l-5 5 5 5m-5-5h12.5M6.5 19V5" />
          </svg>
        </a> for the best deals on your travel.</p>
      </div>

      <StepNavigation isValid={isValid} backPath={"/plan/step-1/"} nextPath={"/plan/step-3/"} />
    </>
  )
}