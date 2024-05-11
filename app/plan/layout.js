"use client";

// External Libraries
import * as React from "react";
import { useState, useEffect } from "react";

import Link from "next/link";

// Utility Functions
import { cn } from "@/lib/utils";

// Stores
import { useItenaryStore } from "@/app/stores";

// LAYOUT COMPONENT
// This component is used to wrap the entire app in a layout
// Left side shows an image, quote, and logo
// Right side shows the children components passed in
export default function ({ className, children, ...props }) {
  const [imageUrl, setImageUrl] = useState("");

  const destination = useItenaryStore((state) => state.destination);

  useEffect(() => {
    // Debounce the API call to avoid spamming the API
    const delayDebounceFn = setTimeout(() => {
      updateImage(`${destination.name}`);
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [destination]);

  async function updateImage(placeName) {
    if (!placeName) return;

    // Fetching data from jsonplaceholder.
    // POST request using fetch with async/await
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ destination: placeName }),
    };
    const res = await fetch(`/api/image/`, requestOptions);

    let { imageUrl } = await res.json();
    if (imageUrl === undefined) {
      imageUrl = "";
    } else {
      setImageUrl(imageUrl);
    }
  }

  return (
    <div
      className="container relative h-[800px] min-h-screen flex-col justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0"
      {...props}
    >
      <div className="bg-muted relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r">
        <div
          className="absolute inset-0 bg-zinc-900 transition-all"
          style={{
            background: `black url(${imageUrl}) center center / cover no-repeat`,
          }}
        />
        <Logo color="white" />
        <Quote />
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-8 overflow-hidden sm:px-24">
          <Logo className="mt-24 lg:hidden" />
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}

const Logo = ({ color, className, ...props }) => (
  // Icon from TheNounProject.com by Creative Stall
  // TODO: Purchase license
  // https://thenounproject.com/icon/flight-2728450/
  <Link href="/">
    <div
      className={cn(
        "relative z-20 flex items-center text-lg font-medium",
        className,
      )}
      {...props}
    >
      <div
        className="relative mr-2 h-10 w-10 text-white"
        style={{ fill: color ? color : "black" }}
      >
        <svg viewBox="0 0 100 125">
          <path d="M88 12.1c-1.8-1.8-4.7-1.8-6.5 0l-9.1 9.1L44.5 17l-3.6 3.6 21.5 10.7-10.2 11.1-8.2-.3-3 3 10 4 4 10 3-3-.2-8.2 11.1-10.2 10.8 21.4 3.9-3.9-4.7-27.5 9.1-9.1c1.8-1.8 1.8-4.7 0-6.5zM47.9 53.6 16.6 84.8c-.3.3-.9.3-1.2 0l-.1-.1c-.3-.3-.3-.9 0-1.2l31.2-31.2c.3-.3.9-.3 1.2 0l.1.1c.4.3.4.8.1 1.2zM51 56.7l-25 25c-.3.3-.9.3-1.2 0l-.1-.1c-.3-.3-.3-.9 0-1.2l25-25c.3-.3.9-.3 1.2 0l.1.1c.3.3.3.8 0 1.2zM44.8 50.5l-25 25c-.3.3-.9.3-1.2 0l-.1-.1c-.3-.3-.3-.9 0-1.2l25-25c.3-.3.9-.3 1.2 0l.1.1c.3.3.3.8 0 1.2z" />
        </svg>
      </div>
      Waybound
    </div>
  </Link>
);

const Quote = ({ className, ...props }) => {
  const quotes = [
    {
      quote: "Waybound made my Paris adventure unforgettable. I visited charming spots like Montmartre and found the best croissants in the city, all thanks to their tips!",
      author: "Emily R.",
    },
    {
      quote: "Thanks to Waybound, I had a seamless trip planning experience for my vacation in Tokyo. Their recommendations for sushi spots were spot on!",
      author: "Mark T.",
    },
    {
      quote: "I used Waybound for my journey to Cape Town last year and was amazed by the hidden gems they suggested. The sunset from Signal Hill was breathtaking!",
      author: "Julia H.",
    },
    {
      quote: "Waybound helped me discover local favorites in New York City. Their bespoke itineraries are perfect for anyone looking to explore beyond the typical tourist destinations.",
      author: "Carlos S.",
    },
    {
      quote: "On my trip to Bangkok, Waybound's insights led me to incredible street food stalls and vibrant markets – it felt like a truly authentic experience!",
      author: "Sophie W.",
    },
    {
      quote: "My family and I visited Machu Picchu with Waybound’s guidance. Their detailed itinerary made our once-in-a-lifetime trip easy and enjoyable.",
      author: "Liam G.",
    },
    {
      quote: "Discovering hidden alleys in Venice was a breeze with Waybound. They know exactly where the magic happens, away from the crowds!",
      author: "Rachel D.",
    }
  ];

  // Rotate through quotes every few seconds
  const [quoteIndex, setQuoteIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((quoteIndex + 1) % quotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [quoteIndex]);

  return (
    <div className={cn("relative z-20 mt-auto", className)} {...props}>
      <blockquote className="space-y-2">
        <p className="text-lg">&ldquo;{quotes[quoteIndex].quote}&rdquo;</p>
        <footer className="text-sm">{quotes[quoteIndex].author}</footer>
      </blockquote>
    </div>
  );
};
