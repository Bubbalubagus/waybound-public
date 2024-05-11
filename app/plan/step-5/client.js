"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';

import 'swiper/css/keyboard'; // Import keyboard module style
import { Keyboard } from 'swiper/modules'; // Import Keyboard module

// Stores
import { useItenaryStore, useStore } from "@/app/stores";

// Components
import { Check, X as CloseIcon, Star as StarIcon } from "react-feather";
import StepNavigation  from "@/components/StepNavigation";

async function getActivities(destination, fromDate, toDate) {
  // {
  //   productCode: '269213P2',
  //   title: 'Private Edinburgh Photography Tour',
  //   description: 'Don’t limit yourself to just the Royal Mile; the Extended Photo tours take in both the Street Tour and the Night Tour so you can cover more ground and come away with more spectacular images. Let a professional photographer guide you through your setting as they whisk you to their favourite spots to capture the best images in the Capital. We will lead you to superb photographic opportunities for all kinds of subjects, from landmarks and people watching to hidden secrets and great views over the city, all the while offering practical tips and helping you to develop your own creative vision.\n' +
  //     '\n' +
  //     'Each tour is crafted to the skills and needs of the participants. Apart from taking photos, you can also expect to learn:\n' +
  //     '\n' +
  //     'Creative composition, using lines, repetition, camera angles\n' +
  //     'Training your eye: composition, subjects, lighting\n' +
  //     'Taking control of your camera: ƒ-stop, shutter speed, ISO and focusing\n' +
  //     'Night photography basics\n' +
  //     'Long exposure light streaking - cars, boats\n' +
  //     'Reviewing your photography',
  //   images: [Array],
  //   reviews: [Object],
  //   duration: [Object],
  //   confirmationType: 'INSTANT',
  //   itineraryType: 'ACTIVITY',
  //   pricing: [Object],
  //   destinations: [Array],
  //   tags: [Array],
  //   flags: [Array],
  //   translationInfo: [Object]
  // }
  const body = JSON.stringify({
    destination,
    fromDate,
    toDate,
  });
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  };
  
  const res = await fetch(`/api/activities/`, requestOptions);

  const data = await res.json();
  return data.data;
}

export default function ({ className, ...props }) {
  const { setPassed, setInterested } = useItenaryStore();

  const passed = useStore(useItenaryStore, (state) => state.passed);
  const interested = useStore(useItenaryStore, (state) => state.interested);
  const destination = useStore(useItenaryStore, (state) => state.destination);
  const travelDates = useStore(useItenaryStore, state => state.travelDates);

  const [isValid, setIsValid] = useState(false);
  const [currentActivity, setCurrentActivity] = useState();
  const [status, setStatus] = useState('idle');

  // fetch and update activities
  useEffect(() => {
    if (!destination) return;
    if (passed?.length) {
      return setStatus('success');
    }

    setStatus('loading');
    getActivities(destination, travelDates.from, travelDates.to).then((data) => {
      if (!data.length) {
        return setStatus('noActivitiesFound');
      }
      setPassed(data);
      setStatus('success');
    });
  }, [destination, travelDates]);

  // Validate that at least 3 activities are selected
  useEffect(() => {
    setIsValid(interested?.length >= 3 || status === 'noActivitiesFound');
  }, [interested, status]);

  // INTERESTED
  const markInterested = () => {
    document.querySelector(`.activity-${0}`)?.classList.add("is-offscreen--r");

    setTimeout(() => {
      // remove the class
      document
        .querySelector(`.activity-${0}`)
        ?.classList.remove("is-offscreen--r");

      // remove the current activity from the passed array
      const newPassed = [...passed];
      const activity = newPassed.splice(currentActivity, 1)[0];
      setInterested([...interested, activity]);
      setPassed(newPassed);

      // go to the next activity, if on the last activity, go back to the first
      const nextActivity =
        currentActivity === passed.length - 1 ? 0 : currentActivity + 1;
      setCurrentActivity(nextActivity);
    }, 500);
  };

  // PASS
  const markPassed = (e) => {
    document.querySelector(`.activity-${0}`)?.classList.add("is-offscreen--l");

    setTimeout(() => {
      // remove the class
      document
        .querySelector(`.activity-${0}`)
        ?.classList.remove("is-offscreen--l");

      // move the current activity to the end of the passed array
      const newPassed = [...passed];
      const activity = newPassed.splice(currentActivity, 1)[0];
      setPassed([...newPassed, activity]);
    }, 500);
  };

  // Keyboard shortcuts useEffect
  useEffect(() => {
    const handleKeyDown = (event) => {
      switch(event.key.toUpperCase()) {
        case 'I':
          markInterested(); // Ensure this function can be called directly
          break;
        case 'P':
          markPassed(); // Ensure this function does not require an event argument
          break;
        default:
          // No default action
      }
    };

    // Add event listener for keyboard actions
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup the event listener when the component unmounts
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [markInterested, markPassed]);

  return (
    <>
      <div>
        <label className="mb-8 mt-8 block text-lg font-medium tracking-tight">
          Which activities are you interested in?
        </label>

        <div className="relative h-[550px] w-[440px]">
          {(passed || []).map((activity, index) => {
            return (
              <div
                className={`activity-${index} absolute min-h-[530px] w-full rounded-lg border bg-white p-4 shadow-md`}
                key={index}
                style={{
                  zIndex: index == 0 ? "100" : `${100 - index}`,
                  left: (index < 5 ? index * 5 : 0) + "px",
                  top: (index < 5 ? index * 5 : 0) + "px",
                  boxShadow: index > 3 ? "none" : "auto",
                }}
              >
              <Swiper // https://swiperjs.com/react - Swiper documentation
                spaceBetween={50}
                slidesPerView={1}
                navigation={true} // Enable navigation arrows
                pagination={{
                  clickable: true,
                  type: 'bullets', 
                }}
                keyboard={{
                  enabled: true,
                  onlyInViewport: true,
                }}
                modules={[Navigation, Pagination, Keyboard]}
                style={{ height: '250px' }}
              >
                {activity.images.map((image, idx) => (
                  <SwiperSlide key={idx}>
                    <div
                      style={{
                        background: `url(${image}) center center / cover no-repeat`,
                        height: '100%',
                      }}
                    ></div>
                  </SwiperSlide>
                ))}
              </Swiper>

                <h3 className="mt-4 text-lg font-medium">{activity.title}</h3>
                <p className="mb-4 mt-2 text-sm">
                  {activity.description.substring(0, 200)}...
                </p>
                {activity.rating && (
                  <p className="mb-4 mt-2 text-sm">
                    <StarIcon className="w-4 inline-block mr-1 text-yellow-500" />
                    {activity.rating?.toFixed(1)} stars
                  </p>
                )}
                <Link
                  className="font-medium text-blue-600 underline"
                  href={activity.productUrl}
                  target="_blank"
                >
                  Learn more
                </Link>
              </div>
            );
          })}

          {status === 'loading' && (
            <div className="flex h-full flex-col items-center justify-center">
              <h3 className="m-24 text-center text-sm font-medium">
                finding super fun activities...
              </h3>
            </div>
          )}
          {status === 'noActivitiesFound' && (
            <div className="flex h-full flex-col items-center justify-center">
              <h3 className="m-24 text-center text-sm font-medium">
                No activities found.
              </h3>
            </div>
          )}
          {
            (status === 'success' && passed?.length === interested?.length) && (
              <div className="flex h-full flex-col items-center justify-center">
                <h3 className="m-24 text-center text-sm font-medium">
                  No more activities to show.
                </h3>
              </div>
            )
          }
        </div>

        {interested?.length >= 10 && (
          <p className="mb-4 mt-4 rounded-md bg-green-500 p-3 text-sm text-white">
            You have added the maximum number of activities.
          </p>
        )}
        {(status === 'success' && interested?.length < 10) && (
          <button
            className="mt-4 w-full rounded-full border border-lime-600 bg-lime-500 p-2 px-12 font-black uppercase tracking-widest text-lime-800 shadow-md transition-all"
            onClick={markInterested}
          >
            interested ('i')
          </button>
        )}

        <button
          className={`mt-4 w-full rounded-full border border-slate-200 bg-white p-2 px-12 font-light uppercase tracking-widest text-slate-600 shadow-sm transition-all hover:bg-slate-100 ${passed?.length <= 1 && "opacity-0"}`}
          onClick={(e) => markPassed(e)}
        >
          pass ('p')
        </button>
      </div>

      {(!!interested?.length) && (
        <h2 className="mb-3 mt-8 text-lg font-medium">Interested In</h2>
      )}
      <div className="flex flex-wrap gap-4">
        {interested?.map((activity, index) => {
          if (!activity) return null;
          return (
            <div
              className="flex w-full items-center justify-between gap-2"
              key={index}
            >
              <Link className="flex items-center gap-2 text-blue-600 underline" href={activity.productUrl} target="_blank">
                <Check className="w-6 text-green-700" />
                <span>{activity.title}</span>
              </Link>
              <button
                className="rounded-full bg-red-500 px-2 py-1 text-white"
                onClick={() => {
                  const newInterested = [...interested];
                  newInterested.splice(index, 1);
                  setInterested(newInterested);
                }}
              >
                <CloseIcon className="w-4" />
              </button>
            </div>
          );
        })}
      </div>
      <StepNavigation isValid={isValid} backPath={`/plan/step-4/`} nextPath={`/itinerary/`} />
    </>
  );
}
