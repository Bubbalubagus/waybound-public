"use client"

import { useEffect } from 'react';
import StepNavigation from "@/components/StepNavigation";


export default function ({ className, ...props }) {

  // Add a script tag to the page
  let scriptLoaded = false;
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://tp.media/content?trs=259812&shmarker=473665&locale=en&powered_by=false&border_radius=5&plain=true&show_logo=false&color_background=%23FFFFFFff&color_button=%23000011&color_text=%23000000&color_input_text=%23000000&color_button_text=%23ffffff&promo_id=4480&campaign_id=10';
    script.async = true;

    const container = document.getElementById('rental-car-widget-container');
    if (container && !scriptLoaded) {
      container.appendChild(script);
      scriptLoaded = true;
    }
  }, []);

  return (
    <>
      <div>
        <label className="block text-md tracking-tight mt-8 mb-3 font-medium">
          Search for rental cars
        </label>

        <div id="rental-car-widget-container"></div>
      </div>

      <StepNavigation isValid={true} backPath={`/plan/step-3/`} nextPath={`/plan/step-4/`} />
    </>
  )
}