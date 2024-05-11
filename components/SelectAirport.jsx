import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { debounce } from "lodash";
import cn from "classnames";

export default function SelectAirport({ airport, setAirport }) {

    // Airports is a JSON file with the following structure:
    // {
    //     "00AK": {
    //         "icao": "00AK",
    //         "iata": "",
    //         "name": "Lowell Field",
    //         "city": "Anchor Point",
    //         "state": "Alaska",
    //         "country": "US",
    //         "elevation": 450,
    //         "lat": 59.94919968,
    //         "lon": -151.695999146,
    //         "tz": "America\/Anchorage"
    //     },
    //     "00AL": {
    //         "icao": "00AL",
    //         "iata": "",
    //         "name": "Epps Airpark",
    //         "city": "Harvest",
    //         "state": "Alabama",
    //         "country": "US",
    //         "elevation": 820,
    //         "lat": 34.8647994995,
    //         "lon": -86.7703018188,
    //         "tz": "America\/Chicago"
    //     },
    // }
  
    // 
    // STATE MANAGEMENT
    const [open, setOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("");
    const [initialAirports, setInitialAirports] = useState([]);
    const [filteredAirports, setFilteredAirports] = useState(initialAirports);
  
    // 
    // EVENTS
    const handleInputChange = debounce((searchTerm) => {
      const query = searchTerm.trim();
      setSearchTerm(query);
      if (!query) {
        setFilteredAirports(initialAirports);
        return;
      }
  
      fetch(`/api/airports?query=${query}`)
        .then((res) => res.json())
        .then((data) => {
          setFilteredAirports(data);
        });
    }, 200);
  
    // replace the initialAirports with the data from the API
    useEffect(() => {
      fetch('/api/airports')
        .then((res) => res.json())
        .then((data) => {
          setInitialAirports(data);
        });
    });
  
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
            {airport ? `${airport.name} (${airport.iata || airport.icao}) ${airport.city}, ${airport.country}` : "Select Airport..."}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Command className="w-[400px] md:w-[600px]" shouldFilter={false}>
            <CommandInput placeholder="Search Airports..." className="h-9" onValueChange={handleInputChange} />
            <CommandEmpty>No airports found.</CommandEmpty>
            <CommandGroup>
              {(searchTerm.length ? filteredAirports : initialAirports).map((_airport, i) => (
                <CommandItem
                  key={i}
                  value={i}
                  onSelect={(currentValue) => {
                    setAirport(_airport)
                    setFilteredAirports(initialAirports);
                    setOpen(false);
                  }}
                >
                  {_airport && `${_airport.name} (${_airport.iata || _airport.icao}) ${_airport.city}, ${_airport.country}`}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      airport?.icao === _airport.icao ? "opacity-100" : "opacity-0"
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