import { Suspense } from "react"
import Client from "./client"
import { fetchDestinations } from "@/app/server/utils"

export default async function () {
  const allDestinations = await fetchDestinations();

  return (
    <>
      <h1 className="scroll-m-20 text-5xl md:text-5xl tracking-wide leading-normal mb-8 lg:mb-10 lg:mt-12 text-left"
          style={{color: '#333', textShadow: '0 0 1px rgba(0,0,0,0.3)'}}>
        plan your travel in minutes, and it might be on us!
      </h1>
      <Suspense fallback={<div>Loading destinations...</div>}>
        <Client allDestinations={allDestinations} />
      </Suspense>
    </>
  )
}


