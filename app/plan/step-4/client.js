"use client"

import { useState, useEffect } from 'react';

// Stores
import { useItenaryStore, useStore } from '@/app/stores';

// Components
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import StepNavigation from "@/components/StepNavigation";


export default function ({ className, ...props }) {
  const [isValid, setIsValid] = useState(false);

  const {
    setPreferredActivities
  } = useItenaryStore();

  // Solves for the Hydration mismatch error
  const preferredActivities = useStore(useItenaryStore, (state) => state.preferredActivities);

  useEffect(() => {
    const isValid = preferredActivities && preferredActivities.length > 0;
    setIsValid(isValid);
  }, [preferredActivities]);

  const toggleOption = (option) => {
    const optionIndex = preferredActivities.findIndex((o) => o.value === option.value);
    if (optionIndex > -1) {
      setPreferredActivities(preferredActivities.filter((o) => o.value !== option.value));
    } else {
      setPreferredActivities([...preferredActivities, option]);
    }
  }

  return (
    <>
      <div>
        <label className="block text-md tracking-tight mt-8 mb-3 font-medium">
          What activities are you interested in? <span className='italic font-light'>(you can select multiple)</span>
        </label>
        <div className="flex flex-wrap gap-2 my-6 text-sm">
          {activityOptions.map((option, i) => {
            const isSelected = (preferredActivities || []).find((o) => o.value === option.value);
            return (
              <div
                key={i}
                className={`border b-slate-500 rounded-full flex flex-col items-center align-middle justify-center py-1 px-4 hover:b-blue-600 hover:bg-blue-50 hover:cursor-pointer transition-all select-none ${isSelected && 'bg-blue-50 border-blue-600'}`}
                onClick={() => toggleOption(option)}
              >

                {option?.icon && (
                  <div className='w-12 h-12 m-2 flex items-center justify-center'>
                    <option.icon className="max-w-16 max-h-16" />
                  </div>
                )}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger><p>{option.label}</p></TooltipTrigger>
                    <TooltipContent>
                      <p>{option.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )
          })}
        </div>
      </div>

      <StepNavigation isValid={isValid} backPath={"/plan/step-3/"} nextPath={"/plan/step-5/"} />
    </>
  )
}

const activityOptions = [
  {
    value: "sunset-cruises",
    label: "Sunset Cruises",
    description: "Enjoy a sunset cruise on the water.",
  },
  {
    value: "hiking",
    label: "Hiking",
    description: "Explore the outdoors on foot.",
  },
  {
    value: "beach-relaxation",
    label: "Beach Relaxation",
    description: "Unwind on the sandy shores and enjoy the sound of the waves.",
  },
  {
    value: "wildlife-encounters",
    label: "Wildlife Encounters",
    description: "Experience close encounters with diverse wildlife.",
  },
  {
    value: "zip-lining",
    label: "Zip-lining",
    description: "Soar through the treetops on a thrilling zip-line adventure.",
  },
  {
    value: "hot-air-ballooning",
    label: "Hot Air Ballooning",
    description: "Take a serene hot air balloon ride for breathtaking views.",
  },
  {
    value: "historical-tours",
    label: "Historical Tours",
    description: "Discover the rich history of the area with guided tours.",
  },
  {
    value: "kayaking",
    label: "Kayaking",
    description: "Paddle through scenic waterways and explore hidden coves.",
  },
  {
    value: "cultural-experiences",
    label: "Cultural Experiences",
    description: "Immerse yourself in the local culture through various activities.",
  },
  {
    value: "wine-tasting",
    label: "Wine Tasting",
    description: "Sample exquisite wines at local vineyards and wineries.",
  },
  {
    value: "helicopter-tours",
    label: "Helicopter Tours",
    description: "Get a bird's-eye view of the landscape on a thrilling helicopter ride.",
  },
  {
    value: "surfing-lessons",
    label: "Surfing Lessons",
    description: "Learn to ride the waves with professional surfing instructors.",
  },
  {
    value: "bike-tours",
    label: "Bike Tours",
    description: "Explore the area on two wheels with guided bike tours.",
  },
  {
    value: "food-tours",
    label: "Food Tours",
    description: "Indulge in local cuisine with guided food tasting tours.",
  },
  {
    value: "scuba-diving",
    label: "Scuba Diving",
    description: "Dive into the underwater world and explore vibrant coral reefs.",
  },
  {
    value: "spa-retreat",
    label: "Spa Retreat",
    description: "Relax and rejuvenate with luxurious spa treatments.",
  },
  {
    value: "paragliding",
    label: "Paragliding",
    description: "Soar through the sky with the thrill of paragliding.",
  },
  {
    value: "river-rafting",
    label: "River Rafting",
    description: "Navigate through exhilarating rapids on a river rafting adventure.",
  },
  {
    value: "horseback-riding",
    label: "Horseback Riding",
    description: "Explore scenic landscapes on horseback with guided rides.",
  },
  {
    value: "bird-watching",
    label: "Bird Watching",
    description: "Observe a variety of bird species in their natural habitats.",
  },
  {
    value: "skydiving",
    label: "Skydiving",
    description: "Experience the ultimate adrenaline rush with a skydiving adventure.",
  },
  {
    value: "fishing",
    label: "Fishing",
    description: "Cast a line and enjoy a relaxing day of fishing in pristine waters.",
  },
  {
    value: "yoga-retreat",
    label: "Yoga Retreat",
    description: "Reconnect with mind and body in serene yoga retreats.",
  },
  {
    value: "cruise-adventures",
    label: "Cruise Adventures",
    description: "Embark on a cruise to explore different destinations in comfort.",
  },
  {
    value: "rock-climbing",
    label: "Rock Climbing",
    description: "Challenge yourself with thrilling rock climbing experiences.",
  },
  {
    value: "cave-exploration",
    label: "Cave Exploration",
    description: "Discover the mysteries of underground caves with guided tours.",
  },
  {
    value: "paintball",
    label: "Paintball",
    description: "Engage in friendly competition with paintball battles in scenic settings.",
  },
  {
    value: "golfing",
    label: "Golfing",
    description: "Hit the links and enjoy a round of golf in picturesque surroundings.",
  },
  {
    value: "cycling",
    label: "Cycling",
    description: "Pedal through scenic routes and explore the beauty of the outdoors.",
  },
  {
    value: "hot-springs",
    label: "Hot Springs",
    description: "Relax in natural hot springs with therapeutic properties.",
  },
  {
    value: "kite-surfing",
    label: "Kite Surfing",
    description: "Ride the waves with the excitement of kite surfing.",
  },
  {
    value: "astro-tourism",
    label: "Astro-tourism",
    description: "Stargaze in areas with minimal light pollution for an unforgettable night sky experience.",
  },
  {
    value: "whale-watching",
    label: "Whale Watching",
    description: "Observe majestic whales in their natural habitat on guided tours.",
  },
  {
    value: "spelunking",
    label: "Spelunking",
    description: "Explore intricate cave systems with caving and spelunking adventures.",
  },
  {
    value: "rafting",
    label: "Rafting",
    description: "Navigate through rivers and experience the thrill of white-water rafting.",
  },
  {
    value: "archaeological-sites",
    label: "Archaeological Sites",
    description: "Visit ancient ruins and explore archaeological wonders.",
  },
  {
    value: "sailing",
    label: "Sailing",
    description: "Sail on the open water and enjoy the serenity of sailing adventures.",
  },
  {
    value: "quad-biking",
    label: "Quad Biking",
    description: "Embark on thrilling off-road adventures with quad biking.",
  },
  {
    value: "ice-skating",
    label: "Ice Skating",
    description: "Glide across frozen landscapes with ice skating activities.",
  },
  {
    value: "photography-tours",
    label: "Photography Tours",
    description: "Capture stunning moments with guided photography tours.",
  },
  {
    value: "desert-safari",
    label: "Desert Safari",
    description: "Explore the beauty of deserts with exciting desert safari experiences.",
  },
  {
    value: "music-festivals",
    label: "Music Festivals",
    description: "Immerse yourself in the vibrant atmosphere of music festivals.",
  },
  {
    value: "canyoning",
    label: "Canyoning",
    description: "Descend through canyons and waterfalls for an adventurous experience.",
  },
  {
    value: "cultural-festivals",
    label: "Cultural Festivals",
    description: "Celebrate local culture and traditions at cultural festivals.",
  },
];
