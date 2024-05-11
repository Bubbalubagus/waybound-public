"use client";

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

import { useState, useEffect } from "react";
import Link from "next/link";

// Stores
import { useItenaryStore } from "@/app/stores";
import { cn } from "@/lib/utils";

// Components
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Loader as LoadingIcon,
  Copy as CopyIcon,
  Check as CheckIcon,
} from "react-feather";

import {
  MDXEditor,
  toolbarPlugin,
  BoldItalicUnderlineToggles,
  UndoRedo,
  BlockTypeSelect,
  CreateLink,
  headingsPlugin,
  listsPlugin,
  thematicBreakPlugin,
  linkPlugin,
  linkDialogPlugin,
  imagePlugin,
  tablePlugin,
  InsertImage,
  InsertTable
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";


async function getTravelPlan(promptData) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      promptData,
    }),
  };

  const res = await fetch(`/api/plan/`, requestOptions);
  const { travelPlan } = await res.json();
  console.log("_______________~~~~~~~___________________________________________________________________")
  console.log(travelPlan)
  console.log("_______________~~~~~~~___________________________________________________________________")
  return travelPlan;
}

export default function ({ className, ...props }) {
  const {
    // Getters
    destination,
    departure,
    travelDates,
    numberOfTravelers,
    preferredTransport,
    preferredActivities,
    interested,
    travelPlan,
    setTravelPlan,
  } = useItenaryStore();

  const [fetchStatus, setFetchStatus] = useState("idle"); // 'idle' | 'loading' | 'success' | 'failed'

  const travelPlanReqData = {
    destination,
    departure,
    travelDates,
    numberOfTravelers,
    preferredTransport,
    preferredActivities,
    interested,
  };

  
  // Add a script tag to the page
  let scriptLoaded = false;
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://tp.media/content?trs=287431&shmarker=473665&locale=en&powered_by=true&color_button=%23f2685f&color_focused=%23f2685f&secondary=%23FFFFFF&dark=%2311100f&light=%23FFFFFF&special=%23C4C4C4&border_radius=5&plain=true&no_labels=true&promo_id=8588&campaign_id=541';
    script.async = true;

    const container = document.getElementById('sim-card-widget-container');
    if (container && !scriptLoaded) {
      container.appendChild(script);
      scriptLoaded = true;
    }  
  }, 
  []);

  function reGeneratePlan() {
    setShowButtonDisabled(true); // Disable the button immediately when clicked
    setFetchStatus("loading");
  
    getTravelPlan(travelPlanReqData).then((data) => {
      if (!data) {
        setFetchStatus("failed");
        setShowButtonDisabled(false); // Re-enable the button if the fetch fails
        return;
      }
  
      setTravelPlan(data);
      setFetchStatus("success");
      setTimeout(() => setShowButtonDisabled(false), 36000); // Re-enable the button after 5 seconds
    });
  }

  const [isButtonDisabled, setShowButtonDisabled] = useState(false);

  useEffect(() => {
    // Get the plan from /api/generatePlan/
    if (fetchStatus === "idle") {
      if (travelPlan?.length < 50) {
        reGeneratePlan();
      } else {
        setFetchStatus("success");
      }
    }
  }, []);

  const [showCheckIcon, setShowCheckIcon] = useState(false);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(travelPlan)
      .then(() => {
        setShowCheckIcon(true);

        // Hide the check icon after a few seconds
        setTimeout(() => {
          setShowCheckIcon(false);
        }, 6000); // Adjust the duration as needed
      })
      .catch((error) => {
        console.error('Error copying to clipboard', error);
      });
  };

  return (
    <>
      {fetchStatus === "success" && (
        <MDXEditor
          className="mx-3 lg:mx-24 rounded-sm bg-slate-50"
          markdown={ travelPlan }
          contentEditableClassName="editor-content"
          onChange={(e) => setTravelPlan(e)}
          plugins={[
            tablePlugin(),
            imagePlugin({
              imageUploadHandler: (imageURL) => {
                return Promise.resolve(imageURL)
              },
              }),
            toolbarPlugin({
              toolbarContents: () => (
                <>
                  {" "}
                  <UndoRedo />
                  <BoldItalicUnderlineToggles />
                  <CreateLink />
                  <InsertTable />
                  <InsertImage />
                  <BlockTypeSelect />{" "}

                  <button
                    className={`rounded-md bg-blue-600 p-1 px-3 text-xs text-white ${isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={reGeneratePlan}
                    disabled={isButtonDisabled}
                  >
                    Re-Generate Itinerary
                  </button>
                </>
              ),
            }),
            headingsPlugin(),
            listsPlugin(),
            thematicBreakPlugin(),
            linkPlugin(),
            linkDialogPlugin(),
          ]}
        />
      )}
      {fetchStatus === "loading" && (
        <div className="text-center">
          <LoadingQuotes />
        </div>
      )}
      <div className="mx-1 mb-12 flex justify-between lg:mx-24 lg:mb-24">
        <div>
          <Link href="/plan/step-1/">
            <Button
              variant="outline"
              type="button"
              size="lg"
              className={`text-md mt-8 mr-4`}
            >
              <ArrowLeft className="mr-2 w-4" />
              back to the beginning
            </Button>
          </Link>
          <Link href="/plan/step-5/">
            <Button
              variant="outline"
              type="button"
              size="lg"
              className={`text-md mt-8`}
            >
              <ArrowLeft className="mr-2 w-4" />
              back to last step
            </Button>
          </Link>
        </div>
        <Button
          variant="blue"
          type="button"
          size="lg"
          className={`text-md mt-8 ${fetchStatus === 'success' ? '' : "cursor-not-allowed opacity-50"}`}
          onClick={handleCopyToClipboard}
        >
          {showCheckIcon ? (
            <CheckIcon className="mr-2 w-5" />
          ) : (
            <CopyIcon className="mr-3 w-4" />
          )}
          Copy to clipboard
        </Button>
      </div>
      <div className="mx-3 lg:mx-24">
        <label className="block text-md tracking-tight mt-8 mb-3 font-medium">
          Get an eSIM activated in 2 minutes and have your phone automatically work as soon as you land!
        </label>

        <div id="sim-card-widget-container"></div>
        <br/>
        <br/>
      </div>
    </>
  );
}


const LoadingQuotes = ({ className, ...props }) => {
  const quotes = [
    {
      quote: "Not all those who wander are lost.",
      author: "J.R.R. Tolkien",
    },
    {
      quote:
        "Surely, of all the wonders of the world, the horizon is the greatest.",
      author: "Freya Stark",
    },
    {
      quote:
        "Though we travel the world over to find the beautiful, we must carry it with us, or we find it not.",
      author: "Ralph Waldo Emerson",
    },
    {
      quote:
        "For my part, I travel not to go anywhere, but to go. I travel for travel's sake. The great affair is to move.",
      author: "Robert Louis Stevenson",
    },
    {
      quote:
        "This is what holidays, travels, vacations are about. It is not really rest or even leisure we chase. We strain to renew our capacity to wonder, to shock ourselves into astonishment once again.",
      author: "Shana Alexander",
    },
    {
      quote:
        "I am one of those who never knows the direction of my journey until I have almost arrived.",
      author: "Anna Louise Strong",
    },
    {
      quote:
        "We travel, some of us forever, to seek other states, other lives, other souls.",
      author: "Anaïs Nin",
    },
    {
      quote: "An adventure is only an inconvenience rightly considered.",
      author: "G.K. Chesterton",
    },
    {
      quote:
        "Happiness is not a station you arrive at, but a manner of traveling.",
      author: "Margaret Lee Runbeck",
    },
    {
      quote: "A journey of a thousand miles begins with a single step.",
      author: "Lao Tzu",
    },
  ];

  // Rotate through quotes every few seconds
  const [quoteIndex, setQuoteIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      // pick the next quote randomly
      const nextQuoteIndex = Math.floor(Math.random() * quotes.length);
      setQuoteIndex(nextQuoteIndex);
    }, 4000);
    return () => clearInterval(interval);
  }, [quoteIndex]);

  return (
    <div className={cn("relative z-20 mt-auto", className)} {...props}>
      <div className="my-24 flex items-center justify-center gap-4">
        <LoadingIcon className="w-6" />
        Generating your plan...{" "}
        <span className="italic text-slate-400">(takes a few min)</span>
      </div>
      <blockquote className="mx-auto mb-24 max-w-4xl space-y-2">
        <p className="text-lg">&ldquo;{quotes[quoteIndex].quote}&rdquo;</p>
        <footer className="text-sm">{quotes[quoteIndex].author}</footer>
      </blockquote>
    </div>
  );
};
