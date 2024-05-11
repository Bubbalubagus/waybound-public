"use client"

import { useEffect } from 'react';
import StepNavigation from "@/components/StepNavigation";


export default function ({ className, ...props }) {
  return (
    <>
      <div>
        <label className="block text-md tracking-tight mt-8 mb-3 font-medium">
          Search for hotels/hostels or airbnbs
        </label>

        <div id="hotel-widget-container">
          HOTEL WIDGETS GO HERE
        </div>
      </div>

      <StepNavigation isValid={true} backPath={`/plan/step-3/`} nextPath={`/plan/step-4/`} />
    </>
  )
}