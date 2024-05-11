"use client"

// External Libraries
import * as React from "react";
import Link from 'next/link';
import { useState, useEffect } from 'react';

// Utility Functions
import { cn } from "@/lib/utils";

// Stores
import { useItenaryStore, useStore } from '@/app/stores';

// Components
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Icons
import { Map } from 'react-feather';

import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"

export default function ({ className, ...props }) {
  const {
    email, setEmail,
    destination, setDestination,
    setInterested,
    setPassed
  } = useItenaryStore();

  const handleSubmit = async () => {
  // Check if the form is valid and not spamming
  if (!isValid) return;
  
  

  const lastSubmittedAt = localStorage.getItem('lastSubmittedAt');
  const now = new Date().getTime();

  // Allow submission only if it's been more than an hour since the last submission
  if (lastSubmittedAt && now - parseInt(lastSubmittedAt) < 3701403) {
    console.log("?");
    return; // Exit the function without alerting the user or interrupting their experience
  }
  // Script takes in date and email from form and puts it into google sheets: https://docs.google.com/spreadsheets/d/1I6SsSRiUhz0TyDINe7dIXmDLRkAvI-4o3RQShzbMdEU/edit#gid=0
  const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyHQwvP90jzM9cMG7XgGVnBUbYlqmnFRxRYwA3zuZadmDAZPYMG0BWzhsL9_tB2y_I6/exec';

  try {
    await fetch(WEB_APP_URL, {
      method: 'POST',
      mode: 'no-cors', // Important for CORS policy
      body: new URLSearchParams({ 'email': email }),
    });

    // Update the timestamp of the last successful submission
    localStorage.setItem('lastSubmittedAt', now.toString());

    // Success logic here
    console.log('!');
  } catch (error) {
    console.error('Error:', error);
  }
};

  // Validate both email and destination are filled out
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const emailValid = email && email.includes('@') && email.includes('.') && email.length > 5;
    setIsValid(emailValid && destination);
  });

  return (
    <>
      <label className="block text-md tracking-tight mt-8 mb-3 font-medium">
        where are you traveling?
      </label>
      <SelectDestination {...props} onChange={() => {
        setInterested([]);
        setPassed([]);
      }} />

      <label htmlFor="email" className="block text-md tracking-tight mt-8 mb-3 font-medium">
        your email address
      </label>
      <Input
        id="email"
        type="email"
        placeholder="Email address"
        className="mt-1 p-4 py-6 font-medium"
        onChange={(e) => setEmail(e.target.value)}
        autoFocus
        value={email}
      />

      <Link href="/plan/step-2/" onClick={(e) => {
        if (!isValid) {
          e.preventDefault();
        } else {
          handleSubmit(); // Call handleSubmit when proceeding to the next step
        }
      }}>
        <Button variant="blue" type="button" size="lg" className={`mt-8 text-md pulse-button ${!isValid && 'opacity-50 cursor-not-allowed'}`}>
          <Map className="w-4 mr-2" />
          get your travel plan
        </Button>
      </Link>
      <div className="mt-8 p-4 bg-blue-100 border-l-4 border-blue-500 text-blue-700">
        <h3 className="font-semibold mb-2">why use Waybound?</h3>
        <p>simply creating a free itinerary with your email puts you in the drawing to win all the money fellow travelers have earned through affiliate revenue generation using this platform every single month! 
        Current pot: <strong className="money-highlight">$115.88</strong></p>
      </div>
    </>
  )
}


export function SelectDestination({ ...props }) {
  // allDestinations is an array of objects like this:
  // {
  //   sortOrder: 99,
  //   selectable: true,
  //   destinationUrlName: 'Midigama',
  //   defaultCurrencyCode: 'USD',
  //   lookupId: '2.19.24381.51128',
  //   parentId: 24381,
  //   timeZone: '',
  //   iataCode: '',
  //   destinationName: 'Midigama',
  //   destinationId: 51128,
  //   destinationType: 'CITY',
  //   latitude: 5.9719,
  //   longitude: 80.3918
  // }
  const { allDestinations } = props;
  // pick 10 random initial destinations
  const initialDestinations = allDestinations.sort(() => 0.5 - Math.random()).slice(0, 10);

  // 
  // STATE MANAGEMENT

  // Destination is an object like this:
  // { name: 'Midigama', id: 51128, timeZone: '' }
  const { setDestination } = useItenaryStore();
  // useStore solves for the Hydration mismatch error
  const destination = useStore(useItenaryStore, (state) => state.destination);

  const [filteredDestinations, setFilteredDestinations] = useState(initialDestinations);
  const [open, setOpen] = useState(false)

  // 
  // EVENTS
  const handleInputChange = (searchTerm) => {
    if (!searchTerm) return setFilteredDestinations(initialDestinations);

    // Filter destinations by search term and update state
    const filtered = allDestinations
      .filter((_destination) =>
        _destination.destinationName.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 10);

    setFilteredDestinations(filtered);
  };

  return (
    <Popover open={open} onOpenChange={setOpen} className="w-[100%]">
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[100%] justify-between py-6"
          autoFocus
        >
          {destination?.name + (destination?.timeZone && ` (${destination.timeZone})`) || "Select a destination..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command className="w-[600px]">
          <CommandInput placeholder="Search destinations..." className="h-9" onValueChange={handleInputChange} />
          <CommandEmpty>No places found.</CommandEmpty>
          <CommandGroup>
            {filteredDestinations.map((_destination) => (
              <CommandItem
                key={_destination.destinationId}
                value={_destination.destinationId + ', ' + _destination.destinationUrlName}
                onSelect={(currentValue) => {
                  setDestination({
                    name: _destination.destinationName,
                    id: _destination.destinationId,
                    timeZone: _destination.timeZone,
                  })
                  setFilteredDestinations(allDestinations.slice(0, 10));
                  setOpen(false);

                  // Tell the parent component that the destination has changed
                  if (props.onChange) props.onChange();
                }}
              >
                {_destination.destinationName + (_destination.timeZone && ` (${_destination.timeZone})`)}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    destination?.id === _destination.destinationId ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}