
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: '' });

async function askAI({ systemPrompt, userPrompt }) {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    "role": "system",
                    "content": systemPrompt
                },
                {
                    "role": "user",
                    "content": userPrompt
                }
            ],
            temperature: 0.7,
        });

        const result = response.choices[0].message.content;
        console.log(result)
        return result;
        // const result = systemPrompt + userPrompt;
        // return result
    } catch (err) {
        console.error(err);
        throw err;
    }
}

/*
PROMPT DATA EXAMPLE
{
  destination: { name: 'Dubai', id: 828, timeZone: 'Asia/Dubai' },
  departure: {
    icao: '30NC',
    iata: '',
    name: 'Happy Bottom Airport',
    city: 'Advance',
    state: 'North Carolina',
    country: 'US',
    elevation: 705,
    lat: 36.0485992432,
    lon: -80.4569015503,
    tz: 'America/New_York'
  },
  travelDates: { from: '2024-01-31T20:00:00.000Z', to: '2024-02-21T20:00:00.000Z' },
  numberOfTravelers: 2,
  preferredTransport: [
    {
      value: 'rental-car',
      label: 'Taxi or Uber',
      description: 'Like the convenience of hailing a taxi?'
    },
    {
      value: 'boat-or-ferry',
      label: 'Boat or Ferry',
      description: 'Take a boat or ferry to get on the water.'
    },
    {
      value: 'public-transportation',
      label: 'Public Transportation',
      description: 'Do you enjoy moving around using the bus or metro?'
    }
  ],
  preferredActivities: [...]
  interested: [
    {
      productCode: '32484P9',
      title: 'Private Tour: Roam the Backstreets of Old Dubai with an Insider ',
      description: 'Dubai’s historic and humble beginnings tell a story like no other. We’ll start the day by marching the streets of old Dubai stopping by several enchanting sights and witnessing the city’s dynamic history woven by its people. \n' +
        '\n' +
        "We'll learn about the emirate’s history as we wander its streets and the aromatic spice and shiny gold souqs. We’ll meet shop owners and learn the secrets behind some of the world’s most expensive traded items. We'll hop on a traditional wooden abra boat and cross over the magnificent Dubai Creek. We’ll visit the Grand Mosque in Dubai, originally built in 1900, where we’ll enjoy an introduction to Islam’s core beliefs and the mosque’s beautiful architecture. We’ll explore the historic Al Fahidi neighborhood with its merchant houses and their incredible windtowers, and enjoy gahwa or Arabic coffee, a quintessential symbol of Emirati hospitality. By then, I guarantee our stomachs will be grumbling loud enough to guide us themselves to one of Dubai’s best eats.",
      images: [Array],
      reviews: [Object],
      duration: [Object],
      confirmationType: 'MANUAL',
      itineraryType: 'STANDARD',
      pricing: [Object],
      productUrl: 'https://www.viator.com/tours/Dubai/Private-Tour-Roam-the-Backstreets-of-Old-Dubai-with-an-Insider-Incl-Transport/d828-32484P9?mcid=42383&pid=P00148298&medium=api&api_version=2.0',
      destinations: [Array],
      tags: [Array],
      flags: [Array],
      translationInfo: [Object]
    },
  ]
}
*/
export async function POST(req) {
    const {
        promptData,
    } = await req.json();

    const {
        departure,
        destination,
        travelDates,
        numberOfTravelers,
        preferredTransport,
        preferredActivities,
        interested,
    } = promptData;

    const fromDate = new Date(travelDates.from);
    const toDate = new Date(travelDates.to);
    const readableFromDate = fromDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const readableToDate = toDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    // LEFT-OFF HERE, leftoff - continue; the bug you were working on is the output in the MDX editor was getting cut off because of the links in the GPT output. Consider using different editor?
    const userPrompt =  `
    You are an expert travel planner that returns properly formatted markdown documents of incredible travel itineraries. Generate a day by day travel plan for ${destination.name} given the following information:

    Information you have to aid you in planning the trip:
    - Trip dates: ${readableFromDate} until ${readableToDate}
    - Leaving from ${departure.name}, ${departure.city}, ${departure.country}
    - ${numberOfTravelers} people are traveling
    - Preferred method of travel is ${preferredTransport?.map(t => t.label).join(', ')}
    - These are a list of vague activities the user might be interested in, if you can logically fit them into the schedule, that is great; they are things to consider: ${preferredActivities?.map(t => t.label).join(', ')}
    - Preferred activities and links to them are (YOU MUST RE-REPORT THE EXACT LINKS IN OUTPUT EVERYWHERE APPROPRIATE in the markdown editor. Do not truncate links or remove affiliate tags from links!):
    ${interested?.map(interested => `${interested.title} - ${interested.productUrl}`).join('\n')}
    The returned plan should be as detailed as possible, include all links the user selected. Do not just fit the selected activities into the days lazily, structure activities around those days, and fill in their schedule intelligently. Be sure to individually address each day and make a plan for each day of the trip. Feel free to use famous itineraries from well-known bloggers as a guileline for the same destinations. Do not mention "arranged airport transportation" unless it is in the list of activities because this is false and will mislead the user.:
    FLIGHT INFORMATION: *Add on to what you were given with what you know about the flight/destination airports
    LIST OF ACTIVITIES: An overview list of activities the user wants to do/you suggested. Return in a bulleted list with accompanying links only.
    DAY BY DAY ITINERARY BREAKDOWN: Include meals, activities from popular itineraries and attractions you know about and other important scheduling items (do not skip days!)
    Then, after the day by day break down; add a todo list and packing list.
    TODO LIST: (fill in, return as bulleted list)
    PACKING LIST: (fill in, return as bulleted list)
    Return a formatted markdown document with the travel plan. Feel free to underline headings and markup whatever you feel necessary.
    `

    console.log(userPrompt);

    const travelPlan = await askAI({
        systemPrompt: `You are an expert travel planner that is given travel data and returns fun and logical, elegant markdown documents of travel itineraries.`,
        userPrompt
    });

    return Response.json({ travelPlan });
}

/*
    You are an expert travel planner that returns properly formatted markdown documents of travel itineraries. Generate a travel plan for ${destination.name} given the following information.

    Information you have to aid you in planning the trip:
    - Trip dates: ${readableFromDate} until ${readableToDate}
    - Leaving from ${departure.name}, ${departure.city}, ${departure.country}
    - ${numberOfTravelers} people are traveling
    - Preferred method of travel is ${preferredTransport?.map(t => t.label).join(', ')}
    - These are a list of vague activities the user might be interested in, if you can logically fit them into the schedule, that is great; they are things to consider: ${preferredActivities?.map(t => t.label).join(', ')}
    - Preferred activities and links to them are (YOU MUST RE-REPORT THE LINKS IN OUTPUT EVERYWHERE APPROPRIATE and LINKS MUST BE RETURNED IN THIS FORMAT: '<https://example.com>' or else they will not work in the markdown editor:
    ${interested?.map(interested => `${interested.title} - ${interested.productUrl}`).join('\n')}
    The returned plan should be as detailed as possible, include all links the user selected, and be formatted as follows with every header being underlined:
    FLIGHT INFORMATION: *Add on to what you were given with what you know about the flight/airports
    LIST OF ACTIVITIES: An overview list of activities the user wants to do/you suggested. Return in a bulleted list only.
    MM/DD/YY, DAY 1
     - Arrive/Breakfast/Process/Check-In etc.
     - (possibly) User Selected Activity 1
      Include detailed descriptions of what activities will occur, what will happen throughout the day etc. as bulleted points. Don't be afraid to give suggestions, as you are an expert travel planner, fleshing out their day.
     - (possibly) Your Selected Activity X (WITH LINK)
     - Meal X
     - Activity Y (and so on and so forth)
    MM/DD/YY, DAY 2 
     - Activity 2 (WITH LINK)
    MM/DD/YY, DAY X (and so on and so forth)
     - Activity Z
    TODO LIST: (fill in)
    PACKING LIST: (fill in)
    Return a formatted markdown document with the travel plan. Do not number any lists or else it will break the markdown editor. Remember, links must be returned in this format: '<https://example.com>' (in quotes between angle brackets/as a tag/html-esque). Feel free to underline headings and markup whatever you feel necessary.
    `
    */