"use client";

// External Libraries
import * as React from "react";

// Utility Functions
import { cn } from "@/lib/utils";

// LAYOUT COMPONENT
export default function ({ className, children, ...props }) {
  return (
    <div className="mx-auto max-w-7xl lg:col-span-2">
      <div className="mx-auto flex w-full flex-col justify-center space-y-8 overflow-hidden">
        <Logo className="mx-auto my-8" />
        <div>{children}</div>
      </div>
    </div>
  );
}

const Logo = ({ color, className, ...props }) => (
  // Icon from TheNounProject.com by Creative Stall
  // TODO: Purchase license
  // https://thenounproject.com/icon/flight-2728450/
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
);
